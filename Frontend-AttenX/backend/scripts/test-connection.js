require('dotenv').config();
const { connectDB, query } = require('../config/database');

const testConnection = async () => {
  try {
    console.log('🔄 Testing NeonDB connection...');
    console.log('📍 Database URL:', process.env.DATABASE_URL.replace(/:[^:@]*@/, ':****@'));
    
    // Test basic connection
    await connectDB();
    console.log('✅ Database connection successful!');
    
    // Test query execution
    const result = await query('SELECT version(), current_database(), current_user');
    console.log('📊 Database Info:');
    console.log('   Version:', result.rows[0].version.split(' ')[0] + ' ' + result.rows[0].version.split(' ')[1]);
    console.log('   Database:', result.rows[0].current_database);
    console.log('   User:', result.rows[0].current_user);
    
    // Test table creation (simple test)
    await query(`
      CREATE TABLE IF NOT EXISTS connection_test (
        id SERIAL PRIMARY KEY,
        test_message TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    await query(`
      INSERT INTO connection_test (test_message) 
      VALUES ('NeonDB connection test successful')
    `);
    
    const testResult = await query('SELECT * FROM connection_test ORDER BY created_at DESC LIMIT 1');
    console.log('✅ Test query result:', testResult.rows[0].test_message);
    
    // Clean up test table
    await query('DROP TABLE IF EXISTS connection_test');
    
    console.log('🎉 All tests passed! NeonDB is ready to use.');
    
  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
    console.error('🔍 Error details:', error);
    
    if (error.code === 'ENOTFOUND') {
      console.log('💡 Suggestion: Check your internet connection and database URL');
    } else if (error.code === '28P01') {
      console.log('💡 Suggestion: Check your database credentials');
    } else if (error.code === '3D000') {
      console.log('💡 Suggestion: Check if the database name is correct');
    }
    
    process.exit(1);
  }
  
  process.exit(0);
};

testConnection();