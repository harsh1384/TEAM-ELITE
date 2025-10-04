const express = require('express');
const { query } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get dashboard statistics
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    // Total sheets processed
    const sheetsResult = await query(`
      SELECT COUNT(*) as total_sheets,
             COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_sheets,
             COUNT(CASE WHEN status = 'processing' THEN 1 END) as processing_sheets
      FROM attendance_sheets
    `);

    // Total signatures and anomalies
    const signaturesResult = await query(`
      SELECT 
        COALESCE(SUM(total_signatures), 0) as total_signatures,
        COALESCE(SUM(anomalies_count), 0) as total_anomalies
      FROM attendance_sheets
      WHERE status = 'completed'
    `);

    // Active users (users who logged in within last 30 days)
    const activeUsersResult = await query(`
      SELECT COUNT(*) as active_users
      FROM users
      WHERE last_login >= CURRENT_DATE - INTERVAL '30 days'
        AND is_active = true
    `);

    // Calculate accuracy rate
    const totalSignatures = parseInt(signaturesResult.rows[0].total_signatures) || 0;
    const totalAnomalies = parseInt(signaturesResult.rows[0].total_anomalies) || 0;
    const accuracyRate = totalSignatures > 0 ? 
      ((totalSignatures - totalAnomalies) / totalSignatures * 100).toFixed(1) : 100;

    res.json({
      success: true,
      data: {
        totalSheets: parseInt(sheetsResult.rows[0].total_sheets),
        completedSheets: parseInt(sheetsResult.rows[0].completed_sheets),
        processingSheets: parseInt(sheetsResult.rows[0].processing_sheets),
        totalSignatures: totalSignatures,
        totalAnomalies: totalAnomalies,
        activeUsers: parseInt(activeUsersResult.rows[0].active_users),
        accuracyRate: parseFloat(accuracyRate)
      }
    });

  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard statistics'
    });
  }
});

// Get recent activity
router.get('/activity', authenticateToken, async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const result = await query(`
      SELECT 
        al.action, al.resource_type, al.resource_id, al.details,
        al.created_at, u.first_name, u.last_name
      FROM activity_logs al
      LEFT JOIN users u ON al.user_id = u.id
      ORDER BY al.created_at DESC
      LIMIT $1
    `, [limit]);

    const activities = result.rows.map(row => ({
      action: row.action,
      resourceType: row.resource_type,
      resourceId: row.resource_id,
      details: row.details,
      user: row.first_name ? `${row.first_name} ${row.last_name}` : 'System',
      timestamp: row.created_at
    }));

    res.json({
      success: true,
      data: activities
    });

  } catch (error) {
    console.error('Recent activity error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch recent activity'
    });
  }
});

// Get weekly processing trends
router.get('/trends/weekly', authenticateToken, async (req, res) => {
  try {
    const result = await query(`
      SELECT 
        DATE_TRUNC('day', created_at) as date,
        COUNT(*) as sheets_count,
        COALESCE(SUM(anomalies_count), 0) as anomalies_count,
        COALESCE(AVG(total_signatures), 0) as avg_signatures
      FROM attendance_sheets
      WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'
        AND status = 'completed'
      GROUP BY DATE_TRUNC('day', created_at)
      ORDER BY date
    `);

    const trends = result.rows.map(row => ({
      date: row.date,
      sheetsCount: parseInt(row.sheets_count),
      anomaliesCount: parseInt(row.anomalies_count),
      avgSignatures: parseFloat(row.avg_signatures).toFixed(1),
      accuracyRate: row.sheets_count > 0 ? 
        ((parseInt(row.sheets_count) - parseInt(row.anomalies_count)) / parseInt(row.sheets_count) * 100).toFixed(1) : 100
    }));

    res.json({
      success: true,
      data: trends
    });

  } catch (error) {
    console.error('Weekly trends error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch weekly trends'
    });
  }
});

// Get anomaly distribution
router.get('/anomalies/distribution', authenticateToken, async (req, res) => {
  try {
    const typeResult = await query(`
      SELECT anomaly_type, COUNT(*) as count
      FROM anomalies
      WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
      GROUP BY anomaly_type
      ORDER BY count DESC
    `);

    const severityResult = await query(`
      SELECT severity, COUNT(*) as count
      FROM anomalies
      WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
      GROUP BY severity
      ORDER BY 
        CASE severity 
          WHEN 'high' THEN 1 
          WHEN 'medium' THEN 2 
          WHEN 'low' THEN 3 
        END
    `);

    res.json({
      success: true,
      data: {
        byType: typeResult.rows.map(row => ({
          type: row.anomaly_type,
          count: parseInt(row.count)
        })),
        bySeverity: severityResult.rows.map(row => ({
          severity: row.severity,
          count: parseInt(row.count)
        }))
      }
    });

  } catch (error) {
    console.error('Anomaly distribution error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch anomaly distribution'
    });
  }
});

// Get top employees with anomalies
router.get('/employees/top-anomalies', authenticateToken, async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const result = await query(`
      SELECT 
        a.employee_id,
        COUNT(*) as anomaly_count,
        COUNT(DISTINCT a.sheet_id) as sheet_count,
        ROUND(COUNT(*)::numeric / COUNT(DISTINCT a.sheet_id), 2) as anomaly_rate
      FROM anomalies a
      WHERE a.created_at >= CURRENT_DATE - INTERVAL '30 days'
      GROUP BY a.employee_id
      HAVING COUNT(*) > 0
      ORDER BY anomaly_count DESC
      LIMIT $1
    `, [limit]);

    const employees = result.rows.map(row => ({
      employeeId: row.employee_id,
      anomalyCount: parseInt(row.anomaly_count),
      sheetCount: parseInt(row.sheet_count),
      anomalyRate: parseFloat(row.anomaly_rate)
    }));

    res.json({
      success: true,
      data: employees
    });

  } catch (error) {
    console.error('Top employees error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch top employees with anomalies'
    });
  }
});

// Get system performance metrics
router.get('/performance', authenticateToken, async (req, res) => {
  try {
    // Average processing time (mock data for now)
    const avgProcessingTime = 2.3;

    // Success rate
    const successResult = await query(`
      SELECT 
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed,
        COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed,
        COUNT(*) as total
      FROM attendance_sheets
      WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'
    `);

    const successRate = successResult.rows[0].total > 0 ? 
      (successResult.rows[0].completed / successResult.rows[0].total * 100).toFixed(1) : 100;

    // Queue status
    const queueResult = await query(`
      SELECT 
        COUNT(CASE WHEN status = 'uploaded' THEN 1 END) as pending,
        COUNT(CASE WHEN status = 'processing' THEN 1 END) as processing
      FROM attendance_sheets
    `);

    res.json({
      success: true,
      data: {
        avgProcessingTime: avgProcessingTime,
        successRate: parseFloat(successRate),
        queueStatus: {
          pending: parseInt(queueResult.rows[0].pending),
          processing: parseInt(queueResult.rows[0].processing)
        },
        completedToday: parseInt(successResult.rows[0].completed),
        failedToday: parseInt(successResult.rows[0].failed)
      }
    });

  } catch (error) {
    console.error('Performance metrics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch performance metrics'
    });
  }
});

module.exports = router;