const express = require('express');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const { query } = require('../config/database');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// Get current user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const result = await query(`
      SELECT 
        id, employee_id, first_name, last_name, email, phone, department,
        position, location, timezone, language, bio, avatar_url, role,
        last_login, created_at
      FROM users WHERE id = $1
    `, [req.user.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const user = result.rows[0];

    res.json({
      success: true,
      data: {
        id: user.id,
        employeeId: user.employee_id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        phone: user.phone,
        department: user.department,
        position: user.position,
        location: user.location,
        timezone: user.timezone,
        language: user.language,
        bio: user.bio,
        avatarUrl: user.avatar_url,
        role: user.role,
        lastLogin: user.last_login,
        createdAt: user.created_at
      }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile'
    });
  }
});

// Update user profile
router.put('/profile', authenticateToken, [
  body('firstName').optional().notEmpty().withMessage('First name cannot be empty'),
  body('lastName').optional().notEmpty().withMessage('Last name cannot be empty'),
  body('email').optional().isEmail().withMessage('Valid email is required'),
  body('phone').optional().isMobilePhone().withMessage('Valid phone number is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const {
      firstName, lastName, email, phone, department, position,
      location, timezone, language, bio
    } = req.body;

    // Check if email is already taken by another user
    if (email) {
      const emailCheck = await query(
        'SELECT id FROM users WHERE email = $1 AND id != $2',
        [email, req.user.id]
      );

      if (emailCheck.rows.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Email is already taken'
        });
      }
    }

    const result = await query(`
      UPDATE users SET
        first_name = COALESCE($1, first_name),
        last_name = COALESCE($2, last_name),
        email = COALESCE($3, email),
        phone = COALESCE($4, phone),
        department = COALESCE($5, department),
        position = COALESCE($6, position),
        location = COALESCE($7, location),
        timezone = COALESCE($8, timezone),
        language = COALESCE($9, language),
        bio = COALESCE($10, bio),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $11
      RETURNING id, employee_id, first_name, last_name, email, phone,
                department, position, location, timezone, language, bio
    `, [
      firstName, lastName, email, phone, department, position,
      location, timezone, language, bio, req.user.id
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const user = result.rows[0];

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        id: user.id,
        employeeId: user.employee_id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        phone: user.phone,
        department: user.department,
        position: user.position,
        location: user.location,
        timezone: user.timezone,
        language: user.language,
        bio: user.bio
      }
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile'
    });
  }
});

// Change password
router.put('/password', authenticateToken, [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { currentPassword, newPassword } = req.body;

    // Get current password hash
    const userResult = await query(
      'SELECT password_hash FROM users WHERE id = $1',
      [req.user.id]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const user = userResult.rows[0];

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isValidPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Hash new password
    const saltRounds = 12;
    const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    await query(
      'UPDATE users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [newPasswordHash, req.user.id]
    );

    res.json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to change password'
    });
  }
});

// Get user activity stats
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    // Sheets processed by user
    const sheetsResult = await query(`
      SELECT COUNT(*) as sheets_processed
      FROM attendance_sheets
      WHERE uploaded_by = $1
    `, [req.user.id]);

    // Anomalies reviewed by user
    const anomaliesResult = await query(`
      SELECT COUNT(*) as anomalies_reviewed
      FROM anomalies
      WHERE reviewed_by = $1
    `, [req.user.id]);

    // Reports generated by user
    const reportsResult = await query(`
      SELECT COUNT(*) as reports_generated
      FROM reports
      WHERE generated_by = $1
    `, [req.user.id]);

    // Days active (days since account creation)
    const daysActiveResult = await query(`
      SELECT EXTRACT(DAY FROM CURRENT_DATE - created_at::date) as days_active
      FROM users
      WHERE id = $1
    `, [req.user.id]);

    res.json({
      success: true,
      data: {
        sheetsProcessed: parseInt(sheetsResult.rows[0].sheets_processed),
        anomaliesReviewed: parseInt(anomaliesResult.rows[0].anomalies_reviewed),
        reportsGenerated: parseInt(reportsResult.rows[0].reports_generated),
        daysActive: parseInt(daysActiveResult.rows[0].days_active) || 0
      }
    });

  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user statistics'
    });
  }
});

// Get user activity history
router.get('/activity', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const result = await query(`
      SELECT action, resource_type, resource_id, details, created_at
      FROM activity_logs
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT $2 OFFSET $3
    `, [req.user.id, limit, offset]);

    const activities = result.rows.map(row => ({
      action: row.action,
      resourceType: row.resource_type,
      resourceId: row.resource_id,
      details: row.details,
      timestamp: row.created_at
    }));

    res.json({
      success: true,
      data: activities
    });

  } catch (error) {
    console.error('Get user activity error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user activity'
    });
  }
});

// Get all users (admin only)
router.get('/', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const { page = 1, limit = 20, search, department, role } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE 1=1';
    const params = [];
    let paramCount = 0;

    if (search) {
      paramCount++;
      whereClause += ` AND (first_name ILIKE $${paramCount} OR last_name ILIKE $${paramCount} OR email ILIKE $${paramCount} OR employee_id ILIKE $${paramCount})`;
      params.push(`%${search}%`);
    }

    if (department) {
      paramCount++;
      whereClause += ` AND department = $${paramCount}`;
      params.push(department);
    }

    if (role) {
      paramCount++;
      whereClause += ` AND role = $${paramCount}`;
      params.push(role);
    }

    // Get total count
    const countResult = await query(`
      SELECT COUNT(*) as total FROM users ${whereClause}
    `, params);

    const total = parseInt(countResult.rows[0].total);

    // Get users with pagination
    params.push(limit, offset);
    const result = await query(`
      SELECT 
        id, employee_id, first_name, last_name, email, department,
        position, role, is_active, last_login, created_at
      FROM users
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}
    `, params);

    const users = result.rows.map(row => ({
      id: row.id,
      employeeId: row.employee_id,
      firstName: row.first_name,
      lastName: row.last_name,
      email: row.email,
      department: row.department,
      position: row.position,
      role: row.role,
      isActive: row.is_active,
      lastLogin: row.last_login,
      createdAt: row.created_at
    }));

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users'
    });
  }
});

module.exports = router;