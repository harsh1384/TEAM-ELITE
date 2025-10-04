require('dotenv').config();
const bcrypt = require('bcryptjs');
const { query } = require('../config/database');

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 12);
    await query(`
      INSERT INTO users (
        employee_id, first_name, last_name, email, password_hash,
        department, position, role, is_active
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      ON CONFLICT (email) DO NOTHING
    `, [
      'ADMIN001', 'Admin', 'User', 'admin@company.com', adminPassword,
      'IT', 'System Administrator', 'admin', true
    ]);

    // Create sample users
    const sampleUsers = [
      {
        employeeId: 'EMP001',
        firstName: 'John',
        lastName: 'Smith',
        email: 'john.smith@company.com',
        department: 'Human Resources',
        position: 'HR Manager'
      },
      {
        employeeId: 'EMP002',
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sarah.johnson@company.com',
        department: 'Finance',
        position: 'Financial Analyst'
      },
      {
        employeeId: 'EMP003',
        firstName: 'Mike',
        lastName: 'Davis',
        email: 'mike.davis@company.com',
        department: 'Operations',
        position: 'Operations Manager'
      }
    ];

    const userPassword = await bcrypt.hash('password123', 12);
    
    for (const user of sampleUsers) {
      await query(`
        INSERT INTO users (
          employee_id, first_name, last_name, email, password_hash,
          department, position, role, is_active
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        ON CONFLICT (email) DO NOTHING
      `, [
        user.employeeId, user.firstName, user.lastName, user.email, userPassword,
        user.department, user.position, 'user', true
      ]);
    }

    // Insert system settings
    const systemSettings = [
      {
        key: 'confidence_threshold',
        value: { threshold: 0.85 },
        description: 'Minimum confidence threshold for anomaly detection'
      },
      {
        key: 'batch_processing_size',
        value: { size: 50 },
        description: 'Number of files to process in each batch'
      },
      {
        key: 'notification_settings',
        value: {
          email_enabled: true,
          sms_enabled: false,
          admin_email: 'admin@company.com'
        },
        description: 'System notification preferences'
      }
    ];

    for (const setting of systemSettings) {
      await query(`
        INSERT INTO system_settings (setting_key, setting_value, description)
        VALUES ($1, $2, $3)
        ON CONFLICT (setting_key) DO UPDATE SET
          setting_value = EXCLUDED.setting_value,
          updated_at = CURRENT_TIMESTAMP
      `, [setting.key, JSON.stringify(setting.value), setting.description]);
    }

    // Create sample attendance sheets
    const sampleSheets = [
      {
        sheetId: 'A-2024-001',
        filename: 'morning_shift_2024_01_15.pdf',
        filePath: '/uploads/sample1.pdf',
        fileSize: 2048576,
        fileType: 'application/pdf',
        uploadDate: '2024-01-15',
        shiftType: 'morning',
        department: 'Operations',
        status: 'completed',
        totalSignatures: 25,
        anomaliesCount: 2
      },
      {
        sheetId: 'B-2024-002',
        filename: 'evening_shift_2024_01_14.pdf',
        filePath: '/uploads/sample2.pdf',
        fileSize: 1536000,
        fileType: 'application/pdf',
        uploadDate: '2024-01-14',
        shiftType: 'evening',
        department: 'Finance',
        status: 'completed',
        totalSignatures: 18,
        anomaliesCount: 1
      }
    ];

    for (const sheet of sampleSheets) {
      const result = await query(`
        INSERT INTO attendance_sheets (
          sheet_id, original_filename, file_path, file_size, file_type,
          upload_date, shift_type, department, status, uploaded_by,
          total_signatures, anomalies_count, processed_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, CURRENT_TIMESTAMP)
        ON CONFLICT (sheet_id) DO NOTHING
        RETURNING id
      `, [
        sheet.sheetId, sheet.filename, sheet.filePath, sheet.fileSize, sheet.fileType,
        sheet.uploadDate, sheet.shiftType, sheet.department, sheet.status, 1,
        sheet.totalSignatures, sheet.anomaliesCount
      ]);

      if (result.rows.length > 0) {
        const sheetDbId = result.rows[0].id;

        // Create sample signatures for this sheet
        const signatures = generateSampleSignatures(sheetDbId, sheet.totalSignatures);
        for (const sig of signatures) {
          const sigResult = await query(`
            INSERT INTO signatures (
              sheet_id, employee_id, employee_name, confidence_score,
              position_x, position_y, width, height, is_verified
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING id
          `, [
            sheetDbId, sig.employeeId, sig.employeeName, sig.confidence,
            sig.x, sig.y, sig.width, sig.height, sig.isVerified
          ]);

          // Create anomalies for some signatures
          if (sig.hasAnomaly) {
            await query(`
              INSERT INTO anomalies (
                signature_id, sheet_id, employee_id, anomaly_type,
                severity, description, confidence_score, status
              ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            `, [
              sigResult.rows[0].id, sheetDbId, sig.employeeId, sig.anomalyType,
              sig.severity, sig.anomalyDescription, sig.anomalyConfidence, 'pending'
            ]);
          }
        }
      }
    }

    // Create sample activity logs
    await query(`
      INSERT INTO activity_logs (user_id, action, resource_type, resource_id, details)
      VALUES 
        (1, 'upload_sheet', 'attendance_sheet', 1, '{"filename": "morning_shift_2024_01_15.pdf"}'),
        (1, 'process_sheet', 'attendance_sheet', 1, '{"signatures_found": 25, "anomalies_detected": 2}'),
        (2, 'review_anomaly', 'anomaly', 1, '{"status": "approved", "notes": "Signature verified manually"}')
    `);

    console.log('✅ Database seeding completed successfully!');
    console.log('📧 Admin credentials: admin@company.com / admin123');
    console.log('👤 Sample user credentials: john.smith@company.com / password123');

  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    throw error;
  }
};

// Generate sample signatures
function generateSampleSignatures(sheetId, count) {
  const employees = [
    'John Smith', 'Sarah Johnson', 'Mike Davis', 'Lisa Wilson', 'Robert Brown',
    'Emily Chen', 'David Miller', 'Anna Garcia', 'James Taylor', 'Maria Rodriguez',
    'Alex Thompson', 'Jessica Lee', 'Ryan Clark', 'Amanda White', 'Kevin Martinez'
  ];

  const anomalyTypes = ['signature_mismatch', 'duplicate_signature', 'unusual_pattern'];
  const severities = ['low', 'medium', 'high'];

  return Array.from({ length: count }, (_, index) => {
    const hasAnomaly = Math.random() < 0.15; // 15% chance of anomaly
    const employeeName = employees[index % employees.length];
    const employeeId = `EMP${String(index + 1).padStart(3, '0')}`;

    return {
      employeeId,
      employeeName,
      confidence: hasAnomaly ? 0.6 + Math.random() * 0.2 : 0.8 + Math.random() * 0.2,
      x: Math.random() * 500,
      y: Math.random() * 700,
      width: 80 + Math.random() * 40,
      height: 25 + Math.random() * 15,
      isVerified: !hasAnomaly,
      hasAnomaly,
      anomalyType: hasAnomaly ? anomalyTypes[Math.floor(Math.random() * anomalyTypes.length)] : null,
      severity: hasAnomaly ? severities[Math.floor(Math.random() * severities.length)] : null,
      anomalyDescription: hasAnomaly ? `Detected ${anomalyTypes[Math.floor(Math.random() * anomalyTypes.length)].replace('_', ' ')} for ${employeeName}` : null,
      anomalyConfidence: hasAnomaly ? 0.7 + Math.random() * 0.3 : null
    };
  });
}

// Run seeding if called directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('Seeding finished');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seeding failed:', error);
      process.exit(1);
    });
}

module.exports = { seedDatabase };