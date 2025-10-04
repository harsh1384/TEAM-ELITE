const express = require('express');
const { query } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Generate report
router.post('/generate', authenticateToken, async (req, res) => {
  try {
    const { reportType, title, description, parameters } = req.body;

    if (!reportType || !title) {
      return res.status(400).json({
        success: false,
        message: 'Report type and title are required'
      });
    }

    // Create report record
    const result = await query(`
      INSERT INTO reports (report_type, title, description, parameters, generated_by, status)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [reportType, title, description, JSON.stringify(parameters), req.user.id, 'generating']);

    const report = result.rows[0];

    // Simulate report generation (replace with actual report generation logic)
    setTimeout(async () => {
      try {
        const reportData = await generateReportData(reportType, parameters);
        
        await query(`
          UPDATE reports 
          SET status = $1, completed_at = CURRENT_TIMESTAMP
          WHERE id = $2
        `, ['completed', report.id]);

      } catch (error) {
        console.error('Report generation error:', error);
        await query(`
          UPDATE reports 
          SET status = $1, completed_at = CURRENT_TIMESTAMP
          WHERE id = $2
        `, ['failed', report.id]);
      }
    }, 3000);

    res.status(201).json({
      success: true,
      message: 'Report generation started',
      data: {
        id: report.id,
        reportType: report.report_type,
        title: report.title,
        status: report.status,
        createdAt: report.created_at
      }
    });

  } catch (error) {
    console.error('Generate report error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate report'
    });
  }
});

// Get all reports
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 20, status, reportType } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE 1=1';
    const params = [];
    let paramCount = 0;

    if (status) {
      paramCount++;
      whereClause += ` AND r.status = $${paramCount}`;
      params.push(status);
    }

    if (reportType) {
      paramCount++;
      whereClause += ` AND r.report_type = $${paramCount}`;
      params.push(reportType);
    }

    // Get total count
    const countResult = await query(`
      SELECT COUNT(*) as total FROM reports r ${whereClause}
    `, params);

    const total = parseInt(countResult.rows[0].total);

    // Get reports with pagination
    params.push(limit, offset);
    const result = await query(`
      SELECT 
        r.id, r.report_type, r.title, r.description, r.status,
        r.created_at, r.completed_at,
        u.first_name, u.last_name
      FROM reports r
      LEFT JOIN users u ON r.generated_by = u.id
      ${whereClause}
      ORDER BY r.created_at DESC
      LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}
    `, params);

    const reports = result.rows.map(row => ({
      id: row.id,
      reportType: row.report_type,
      title: row.title,
      description: row.description,
      status: row.status,
      generatedBy: row.first_name ? `${row.first_name} ${row.last_name}` : null,
      createdAt: row.created_at,
      completedAt: row.completed_at
    }));

    res.json({
      success: true,
      data: {
        reports,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Get reports error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reports'
    });
  }
});

// Get report by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(`
      SELECT 
        r.*, u.first_name, u.last_name
      FROM reports r
      LEFT JOIN users u ON r.generated_by = u.id
      WHERE r.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    const report = result.rows[0];

    res.json({
      success: true,
      data: {
        id: report.id,
        reportType: report.report_type,
        title: report.title,
        description: report.description,
        parameters: report.parameters,
        status: report.status,
        filePath: report.file_path,
        generatedBy: report.first_name ? `${report.first_name} ${report.last_name}` : null,
        createdAt: report.created_at,
        completedAt: report.completed_at
      }
    });

  } catch (error) {
    console.error('Get report error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch report'
    });
  }
});

// Get analytics data
router.get('/analytics/summary', authenticateToken, async (req, res) => {
  try {
    const { timeframe = '30d' } = req.query;
    
    let dateFilter = '';
    if (timeframe === '7d') {
      dateFilter = "AND created_at >= CURRENT_DATE - INTERVAL '7 days'";
    } else if (timeframe === '30d') {
      dateFilter = "AND created_at >= CURRENT_DATE - INTERVAL '30 days'";
    } else if (timeframe === '90d') {
      dateFilter = "AND created_at >= CURRENT_DATE - INTERVAL '90 days'";
    }

    // Processing statistics
    const processingStats = await query(`
      SELECT 
        COUNT(*) as total_sheets,
        COALESCE(SUM(total_signatures), 0) as total_signatures,
        COALESCE(SUM(anomalies_count), 0) as total_anomalies,
        COALESCE(AVG(total_signatures), 0) as avg_signatures_per_sheet
      FROM attendance_sheets
      WHERE status = 'completed' ${dateFilter}
    `);

    // Daily processing trends
    const dailyTrends = await query(`
      SELECT 
        DATE_TRUNC('day', created_at) as date,
        COUNT(*) as sheets_processed,
        COALESCE(SUM(anomalies_count), 0) as anomalies_detected
      FROM attendance_sheets
      WHERE status = 'completed' ${dateFilter}
      GROUP BY DATE_TRUNC('day', created_at)
      ORDER BY date
    `);

    // Anomaly type distribution
    const anomalyTypes = await query(`
      SELECT 
        anomaly_type,
        COUNT(*) as count,
        ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER(), 2) as percentage
      FROM anomalies
      WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
      GROUP BY anomaly_type
      ORDER BY count DESC
    `);

    // Department statistics
    const departmentStats = await query(`
      SELECT 
        department,
        COUNT(*) as sheets_count,
        COALESCE(SUM(anomalies_count), 0) as anomalies_count
      FROM attendance_sheets
      WHERE status = 'completed' ${dateFilter}
        AND department IS NOT NULL
      GROUP BY department
      ORDER BY sheets_count DESC
    `);

    const stats = processingStats.rows[0];
    const accuracyRate = stats.total_signatures > 0 ? 
      ((stats.total_signatures - stats.total_anomalies) / stats.total_signatures * 100).toFixed(2) : 100;

    res.json({
      success: true,
      data: {
        summary: {
          totalSheets: parseInt(stats.total_sheets),
          totalSignatures: parseInt(stats.total_signatures),
          totalAnomalies: parseInt(stats.total_anomalies),
          accuracyRate: parseFloat(accuracyRate),
          avgSignaturesPerSheet: parseFloat(stats.avg_signatures_per_sheet).toFixed(1)
        },
        dailyTrends: dailyTrends.rows.map(row => ({
          date: row.date,
          sheetsProcessed: parseInt(row.sheets_processed),
          anomaliesDetected: parseInt(row.anomalies_detected)
        })),
        anomalyTypes: anomalyTypes.rows.map(row => ({
          type: row.anomaly_type,
          count: parseInt(row.count),
          percentage: parseFloat(row.percentage)
        })),
        departmentStats: departmentStats.rows.map(row => ({
          department: row.department,
          sheetsCount: parseInt(row.sheets_count),
          anomaliesCount: parseInt(row.anomalies_count),
          anomalyRate: row.sheets_count > 0 ? 
            (row.anomalies_count / row.sheets_count * 100).toFixed(2) : 0
        }))
      }
    });

  } catch (error) {
    console.error('Analytics summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics data'
    });
  }
});

// Delete report
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      'DELETE FROM reports WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    res.json({
      success: true,
      message: 'Report deleted successfully'
    });

  } catch (error) {
    console.error('Delete report error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete report'
    });
  }
});

// Mock report data generation (replace with actual logic)
async function generateReportData(reportType, parameters) {
  // Simulate report generation delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  switch (reportType) {
    case 'summary':
      return generateSummaryReport(parameters);
    case 'detailed':
      return generateDetailedReport(parameters);
    case 'anomalies':
      return generateAnomaliesReport(parameters);
    case 'performance':
      return generatePerformanceReport(parameters);
    default:
      throw new Error('Unknown report type');
  }
}

function generateSummaryReport(parameters) {
  return {
    type: 'summary',
    data: {
      totalSheets: 156,
      totalSignatures: 2847,
      anomaliesDetected: 23,
      accuracyRate: 98.2
    }
  };
}

function generateDetailedReport(parameters) {
  return {
    type: 'detailed',
    data: {
      sheets: [],
      signatures: [],
      anomalies: []
    }
  };
}

function generateAnomaliesReport(parameters) {
  return {
    type: 'anomalies',
    data: {
      totalAnomalies: 23,
      byType: {
        signature_mismatch: 12,
        duplicate_signature: 6,
        missing_signature: 3,
        unusual_pattern: 2
      }
    }
  };
}

function generatePerformanceReport(parameters) {
  return {
    type: 'performance',
    data: {
      avgProcessingTime: 2.3,
      successRate: 98.7,
      throughput: 156
    }
  };
}

module.exports = router;