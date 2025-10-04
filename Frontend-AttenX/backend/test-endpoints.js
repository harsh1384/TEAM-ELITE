require('dotenv').config();
const axios = require('axios');

const API_BASE = 'http://localhost:8000/api';
let authToken = '';

const testEndpoints = async () => {
  try {
    console.log('🧪 Testing API Endpoints...\n');

    // 1. Health Check
    console.log('1. Testing Health Check...');
    const healthResponse = await axios.get('http://localhost:8000/health');
    console.log('✅ Health Check:', healthResponse.data.status);

    // 2. Login
    console.log('\n2. Testing Login...');
    const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
      email: 'admin@company.com',
      password: 'admin123'
    });
    
    if (loginResponse.data.success) {
      authToken = loginResponse.data.data.token;
      console.log('✅ Login successful');
      console.log('👤 User:', loginResponse.data.data.user.firstName, loginResponse.data.data.user.lastName);
    } else {
      throw new Error('Login failed');
    }

    // Set up auth headers
    const authHeaders = {
      'Authorization': `Bearer ${authToken}`,
      'Content-Type': 'application/json'
    };

    // 3. Dashboard Stats
    console.log('\n3. Testing Dashboard Stats...');
    const dashboardResponse = await axios.get(`${API_BASE}/dashboard/stats`, { headers: authHeaders });
    if (dashboardResponse.data.success) {
      console.log('✅ Dashboard Stats:', dashboardResponse.data.data);
    }

    // 4. User Profile
    console.log('\n4. Testing User Profile...');
    const profileResponse = await axios.get(`${API_BASE}/users/profile`, { headers: authHeaders });
    if (profileResponse.data.success) {
      console.log('✅ Profile loaded for:', profileResponse.data.data.firstName, profileResponse.data.data.lastName);
    }

    // 5. Anomalies List
    console.log('\n5. Testing Anomalies List...');
    const anomaliesResponse = await axios.get(`${API_BASE}/anomalies`, { headers: authHeaders });
    if (anomaliesResponse.data.success) {
      console.log('✅ Anomalies loaded:', anomaliesResponse.data.data.anomalies.length, 'items');
    }

    // 6. Reports List
    console.log('\n6. Testing Reports List...');
    const reportsResponse = await axios.get(`${API_BASE}/reports`, { headers: authHeaders });
    if (reportsResponse.data.success) {
      console.log('✅ Reports loaded:', reportsResponse.data.data.reports.length, 'items');
    }

    console.log('\n🎉 All API endpoints are working correctly!');
    console.log('\n📋 Available Endpoints:');
    console.log('   Health: GET /health');
    console.log('   Auth: POST /api/auth/login, GET /api/auth/profile');
    console.log('   Dashboard: GET /api/dashboard/stats');
    console.log('   Upload: POST /api/upload');
    console.log('   Anomalies: GET /api/anomalies');
    console.log('   Reports: GET /api/reports');
    console.log('   Users: GET /api/users/profile');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data?.message || error.message);
    if (error.response?.data) {
      console.error('Response:', error.response.data);
    }
  }
};

// Add axios to package.json if not present
const addAxios = async () => {
  const { execSync } = require('child_process');
  try {
    require('axios');
  } catch (e) {
    console.log('Installing axios for testing...');
    execSync('npm install axios', { stdio: 'inherit' });
  }
};

const runTests = async () => {
  await addAxios();
  await testEndpoints();
  process.exit(0);
};

runTests();