const express = require('express');
const { query } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all anomalies with filtering and pagination
router.get('/', authenticateToken, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      severity,
      employeeId,
      sheetId,
      sortBy = 'created_at',
      sortOrder = 'DESC'
    } = req.query;

    const offset = (page - 1) * limit;
    let whereClause = 'WHERE 1=1';
    const params = [];
    let paramCount = 0;

    // Build dynamic WHERE clause
    if (status) {
      paramCount++;
      whereClause += ` AND a.status = $${paramCount}`;
      params.push(status);
    }

    if (severity) {
      paramCount++;
      whereClause += ` AND a.severity = $${paramCount}`;
      params.push(severity);
    }

    if (employeeId) {
      paramCount++;
      whereClause += ` AND a.employee_id = $${paramCount}`;
      params.push(employeeId);
    }

    if (sheetId) {
      paramCount++;
      whereClause += ` AND s.sheet_id = $${paramCount}`;
      params.push(sheetId);
    }

    // Get total count
    const countResult = await query(`
      SELECT COUNT(*) as total
      FROM anomalies a
      JOIN attendance_sheets s ON a.sheet_id = s.id
      ${whereClause}
    `, params);

    const total = parseInt(countResult.rows[0].total);

    // Get anomalies with pagination
    params.push(limit, offset);
    const result = await query(`
      SELECT 
        a.id, a.employee_id, a.anomaly_type, a.severity, a.description,
        a.confidence_score, a.status, a.created_at, a.updated_at,
        s.sheet_id, s.original_filename, s.upload_date, s.shift_type,
        u.first_name as reviewed_by_first_name, u.last_name as reviewed_by_last_name,
        a.reviewed_at, a.resolution_notes
      FROM anomalies a
      JOIN attendance_sheets s ON a.sheet_id = s.id
      LEFT JOIN users u ON a.reviewed_by = u.id
      ${whereClause}
      ORDER BY a.${sortBy} ${sortOrder}
      LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}
    `, params);

    const anomalies = result.rows.map(row => ({
      id: row.id,
      employeeId: row.employee_id,
      type: row.anomaly_type,
      severity: row.severity,
      description: row.description,
      confidence: row.confidence_score,
      status: row.status,
      sheet: {
        id: row.sheet_id,
        filename: row.original_filename,
        uploadDate: row.upload_date,
        shiftType: row.shift_type
      },
      reviewedBy: row.reviewed_by_first_name ? 
        `${row.reviewed_by_first_name} ${row.reviewed_by_last_name}` : null,
      reviewedAt: row.reviewed_at,
      resolutionNotes: row.resolution_notes,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }));

    res.json({
      success: true,
      data: {
        anomalies,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Get anomalies error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch anomalies'
    });
  }
});

// Get anomaly by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(`
      SELECT 
        a.*, s.sheet_id, s.original_filename, s.upload_date,
        sig.employee_name, sig.signature_image_path,
        u.first_name as reviewed_by_first_name, u.last_name as reviewed_by_last_name
      FROM anomalies a
      JOIN attendance_sheets s ON a.sheet_id = s.id
      LEFT JOIN signatures sig ON a.signature_id = sig.id
      LEFT JOIN users u ON a.reviewed_by = u.id
      WHERE a.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Anomaly not found'
      });
    }

    const anomaly = result.rows[0];

    res.json({
      success: true,
      data: {
        id: anomaly.id,
        employeeId: anomaly.employee_id,
        employeeName: anomaly.employee_name,
        type: anomaly.anomaly_type,
        severity: anomaly.severity,
        description: anomaly.description,
        confidence: anomaly.confidence_score,
        status: anomaly.status,
        signatureImagePath: anomaly.signature_image_path,
        sheet: {
          id: anomaly.sheet_id,
          filename: anomaly.original_filename,
          uploadDate: anomaly.upload_date
        },
        reviewedBy: anomaly.reviewed_by_first_name ? 
          `${anomaly.reviewed_by_first_name} ${anomaly.reviewed_by_last_name}` : null,
        reviewedAt: anomaly.reviewed_at,
        resolutionNotes: anomaly.resolution_notes,
        createdAt: anomaly.created_at,
        updatedAt: anomaly.updated_at
      }
    });

  } catch (error) {
    console.error('Get anomaly error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch anomaly'
    });
  }
});

// Update anomaly status
router.patch('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, resolutionNotes } = req.body;

    if (!['pending', 'reviewed', 'approved', 'flagged'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const result = await query(`
      UPDATE anomalies 
      SET status = $1, resolution_notes = $2, reviewed_by = $3, 
          reviewed_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
      WHERE id = $4
      RETURNING *
    `, [status, resolutionNotes, req.user.id, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Anomaly not found'
      });
    }

    res.json({
      success: true,
      message: 'Anomaly updated successfully',
      data: {
        id: result.rows[0].id,
        status: result.rows[0].status,
        resolutionNotes: result.rows[0].resolution_notes,
        reviewedAt: result.rows[0].reviewed_at
      }
    });

  } catch (error) {
    console.error('Update anomaly error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update anomaly'
    });
  }
});

// Get anomaly statistics
router.get('/stats/summary', authenticateToken, async (req, res) => {
  try {
    const { timeframe = '7d' } = req.query;
    
    let dateFilter = '';
    if (timeframe === '7d') {
      dateFilter = "AND created_at >= CURRENT_DATE - INTERVAL '7 days'";
    } else if (timeframe === '30d') {
      dateFilter = "AND created_at >= CURRENT_DATE - INTERVAL '30 days'";
    } else if (timeframe === '90d') {
      dateFilter = "AND created_at >= CURRENT_DATE - INTERVAL '90 days'";
    }

    // Get counts by severity
    const severityResult = await query(`
      SELECT severity, COUNT(*) as count
      FROM anomalies
      WHERE 1=1 ${dateFilter}
      GROUP BY severity
    `);

    // Get counts by status
    const statusResult = await query(`
      SELECT status, COUNT(*) as count
      FROM anomalies
      WHERE 1=1 ${dateFilter}
      GROUP BY status
    `);

    // Get counts by type
    const typeResult = await query(`
      SELECT anomaly_type, COUNT(*) as count
      FROM anomalies
      WHERE 1=1 ${dateFilter}
      GROUP BY anomaly_type
    `);

    // Get total count
    const totalResult = await query(`
      SELECT COUNT(*) as total
      FROM anomalies
      WHERE 1=1 ${dateFilter}
    `);

    res.json({
      success: true,
      data: {
        total: parseInt(totalResult.rows[0].total),
        bySeverity: severityResult.rows.reduce((acc, row) => {
          acc[row.severity] = parseInt(row.count);
          return acc;
        }, {}),
        byStatus: statusResult.rows.reduce((acc, row) => {
          acc[row.status] = parseInt(row.count);
          return acc;
        }, {}),
        byType: typeResult.rows.reduce((acc, row) => {
          acc[row.anomaly_type] = parseInt(row.count);
          return acc;
        }, {})
      }
    });

  } catch (error) {
    console.error('Get anomaly stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch anomaly statistics'
    });
  }
});

module.exports = router;