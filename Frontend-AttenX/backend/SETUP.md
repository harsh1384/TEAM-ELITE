# Quick Setup Guide for NeonDB Integration

## 🚀 Getting Started

Your backend is now configured to work with your NeonDB instance!

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Test Database Connection
```bash
npm run test-db
```
This will verify your NeonDB connection is working properly.

### 3. Setup Database Schema
```bash
npm run migrate
```
This creates all the necessary tables in your NeonDB database.

### 4. Add Sample Data (Optional)
```bash
npm run seed
```
This adds sample users, attendance sheets, and test data.

### 5. Start the Server
```bash
npm run dev
```
Your backend will be running on `http://localhost:8000`

## 🔧 One-Command Setup
```bash
npm run setup
```
This runs connection test, migration, and seeding in one command.

## 📊 Your NeonDB Configuration

- **Database**: `neondb`
- **Host**: `ep-polished-bonus-adq4zj4u-pooler.c-2.us-east-1.aws.neon.tech`
- **SSL**: Required (automatically configured)
- **Connection Pooling**: Optimized for serverless

## 🔐 Default Credentials (After Seeding)

### Admin Account
- **Email**: `admin@company.com`
- **Password**: `admin123`
- **Role**: Administrator

### Sample User Account
- **Email**: `john.smith@company.com`
- **Password**: `password123`
- **Role**: Regular User

## 🧪 Testing the API

### Health Check
```bash
curl http://localhost:8000/health
```

### Login Test
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@company.com","password":"admin123"}'
```

### Get Dashboard Stats (with token)
```bash
curl -X GET http://localhost:8000/api/dashboard/stats \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 📁 Project Structure
```
backend/
├── config/
│   └── database.js          # NeonDB connection config
├── middleware/
│   ├── auth.js             # JWT authentication
│   └── errorHandler.js     # Error handling
├── routes/
│   ├── auth.js             # Authentication endpoints
│   ├── upload.js           # File upload & processing
│   ├── anomalies.js        # Anomaly management
│   ├── dashboard.js        # Dashboard data
│   ├── reports.js          # Reports & analytics
│   └── users.js            # User management
├── scripts/
│   ├── migrate.js          # Database schema setup
│   ├── seed.js             # Sample data insertion
│   └── test-connection.js  # Connection testing
└── server.js               # Main server file
```

## 🔄 Frontend Integration

Your Next.js frontend should connect to:
```javascript
const API_BASE_URL = 'http://localhost:8000/api'
```

Update your frontend's API calls to use this base URL.

## 🚨 Troubleshooting

### Connection Issues
```bash
npm run test-db
```
This will diagnose connection problems.

### Migration Issues
```bash
# Reset and recreate tables
npm run migrate
```

### Check Logs
The server logs will show detailed error information for debugging.

## 🌐 Production Deployment

For production, update these environment variables:
```env
NODE_ENV=production
CORS_ORIGIN=https://your-frontend-domain.com
JWT_SECRET=your-super-secure-production-secret
```

## 📈 Monitoring

- **Health Endpoint**: `/health`
- **Database Logs**: Check NeonDB dashboard
- **API Logs**: Server console output

---

**Your NeonDB backend is ready to go!** 🎉

Run `npm run setup` to get started immediately.