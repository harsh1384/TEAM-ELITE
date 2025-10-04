require('dotenv').config();
const { query } = require('../config/database');

const createTables = async () => {
  try {
    console.log('🔄 Starting database migration...');

    // Users table
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        employee_id VARCHAR(50) UNIQUE NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        department VARCHAR(100),
        position VARCHAR(100),
        location VARCHAR(255),
        timezone VARCHAR(50) DEFAULT 'America/New_York',
        language VARCHAR(10) DEFAULT 'en',
        bio TEXT,
        avatar_url VARCHAR(500),
        is_active BOOLEAN DEFAULT true,
        role VARCHAR(20) DEFAULT 'user',
        last_login TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Attendance sheets table
    await query(`
      CREATE TABLE IF NOT EXISTS attendance_sheets (
        id SERIAL PRIMARY KEY,
        sheet_id VARCHAR(50) UNIQUE NOT NULL,
        original_filename VARCHAR(255) NOT NULL,
        file_path VARCHAR(500) NOT NULL,
        file_size INTEGER NOT NULL,
        file_type VARCHAR(20) NOT NULL,
        upload_date DATE NOT NULL,
        shift_type VARCHAR(50),
        department VARCHAR(100),
        status VARCHAR(20) DEFAULT 'pending',
        processed_at TIMESTAMP,
        uploaded_by INTEGER REFERENCES users(id),
        total_signatures INTEGER DEFAULT 0,
        anomalies_count INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Signatures table
    await query(`
      CREATE TABLE IF NOT EXISTS signatures (
        id SERIAL PRIMARY KEY,
        sheet_id INTEGER REFERENCES attendance_sheets(id) ON DELETE CASCADE,
        employee_id VARCHAR(50) NOT NULL,
        employee_name VARCHAR(200),
        signature_data TEXT,
        signature_image_path VARCHAR(500),
        position_x FLOAT,
        position_y FLOAT,
        width FLOAT,
        height FLOAT,
        confidence_score FLOAT DEFAULT 0,
        is_verified BOOLEAN DEFAULT false,
        verified_by INTEGER REFERENCES users(id),
        verified_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Anomalies table
    await query(`
      CREATE TABLE IF NOT EXISTS anomalies (
        id SERIAL PRIMARY KEY,
        signature_id INTEGER REFERENCES signatures(id) ON DELETE CASCADE,
        sheet_id INTEGER REFERENCES attendance_sheets(id) ON DELETE CASCADE,
        employee_id VARCHAR(50) NOT NULL,
        anomaly_type VARCHAR(50) NOT NULL,
        severity VARCHAR(20) NOT NULL,
        description TEXT NOT NULL,
        confidence_score FLOAT NOT NULL,
        status VARCHAR(20) DEFAULT 'pending',
        reviewed_by INTEGER REFERENCES users(id),
        reviewed_at TIMESTAMP,
        resolution_notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Reports table
    await query(`
      CREATE TABLE IF NOT EXISTS reports (
        id SERIAL PRIMARY KEY,
        report_type VARCHAR(50) NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        parameters JSONB,
        generated_by INTEGER REFERENCES users(id),
        file_path VARCHAR(500),
        status VARCHAR(20) DEFAULT 'generating',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        completed_at TIMESTAMP
      )
    `);

    // User sessions table
    await query(`
      CREATE TABLE IF NOT EXISTS user_sessions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        session_token VARCHAR(255) UNIQUE NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        ip_address INET,
        user_agent TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Activity logs table
    await query(`
      CREATE TABLE IF NOT EXISTS activity_logs (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        action VARCHAR(100) NOT NULL,
        resource_type VARCHAR(50),
        resource_id INTEGER,
        details JSONB,
        ip_address INET,
        user_agent TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // System settings table
    await query(`
      CREATE TABLE IF NOT EXISTS system_settings (
        id SERIAL PRIMARY KEY,
        setting_key VARCHAR(100) UNIQUE NOT NULL,
        setting_value JSONB NOT NULL,
        description TEXT,
        updated_by INTEGER REFERENCES users(id),
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create indexes for better performance
    await query(`CREATE INDEX IF NOT EXISTS idx_users_employee_id ON users(employee_id)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_sheets_sheet_id ON attendance_sheets(sheet_id)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_sheets_status ON attendance_sheets(status)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_sheets_upload_date ON attendance_sheets(upload_date)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_signatures_sheet_id ON signatures(sheet_id)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_signatures_employee_id ON signatures(employee_id)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_anomalies_sheet_id ON anomalies(sheet_id)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_anomalies_status ON anomalies(status)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_anomalies_severity ON anomalies(severity)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON activity_logs(user_id)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs(created_at)`);

    console.log('✅ Database migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    throw error;
  }
};

// Run migration if called directly
if (require.main === module) {
  createTables()
    .then(() => {
      console.log('Migration finished');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration failed:', error);
      process.exit(1);
    });
}

module.exports = { createTables };