# Attendance Anomaly Detection Backend

A robust Node.js/Express backend API for the Attendance Anomaly Detection System with NeonDB integration.

## 🚀 Features

### Core Functionality
- **User Authentication**: JWT-based auth with role-based access control
- **File Upload**: Secure file handling for attendance sheets (PDF, JPG, PNG)
- **Anomaly Detection**: AI-powered signature analysis and anomaly detection
- **Real-time Processing**: Asynchronous file processing with status tracking
- **Comprehensive Reporting**: Analytics and report generation
- **Activity Logging**: Complete audit trail of user actions

### Security & Performance
- **Rate Limiting**: API rate limiting to prevent abuse
- **Input Validation**: Comprehensive request validation
- **Error Handling**: Centralized error handling with proper logging
- **Database Optimization**: Indexed queries and connection pooling
- **CORS Protection**: Configurable CORS policies

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL database (NeonDB recommended)
- npm or yarn package manager

## 🛠️ Installation

### 1. Clone and Install Dependencies
```bash
cd backend
npm install
```

### 2. Environment Configuration
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
# Database (NeonDB)
DATABASE_URL=postgresql://username:password@ep-example.us-east-2.aws.neon.tech/attendance_db?sslmode=require

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Server Configuration
PORT=8000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

### 3. Database Setup
```bash
# Run migrations to create tables
npm run migrate

# Seed with sample data (optional)
npm run seed
```

### 4. Start the Server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## 🗄️ Database Schema

### Core Tables
- **users**: User accounts and profiles
- **attendance_sheets**: Uploaded attendance documents
- **signatures**: Extracted signature data
- **anomalies**: Detected signature anomalies
- **reports**: Generated reports and analytics
- **activity_logs**: System activity audit trail

### NeonDB Integration
The backend is optimized for NeonDB with:
- SSL connection support
- Connection pooling
- Automatic reconnection
- Query optimization for serverless environments

## 🔌 API Endpoints

### Authentication
```
POST /api/auth/register    - Register new user
POST /api/auth/login       - User login
GET  /api/auth/profile     - Get current user profile
```

### File Upload & Processing
```
POST /api/upload           - Upload attendance sheet
POST /api/upload/:id/process - Process uploaded file
GET  /api/upload/:id/status  - Get processing status
```

### Anomaly Management
```
GET    /api/anomalies      - List anomalies (with filtering)
GET    /api/anomalies/:id  - Get anomaly details
PATCH  /api/anomalies/:id  - Update anomaly status
GET    /api/anomalies/stats/summary - Anomaly statistics
```

### Dashboard & Analytics
```
GET /api/dashboard/stats              - Dashboard statistics
GET /api/dashboard/activity           - Recent activity
GET /api/dashboard/trends/weekly      - Weekly processing trends
GET /api/dashboard/anomalies/distribution - Anomaly distribution
```

### Reports
```
POST   /api/reports/generate          - Generate new report
GET    /api/reports                   - List reports
GET    /api/reports/:id               - Get report details
GET    /api/reports/analytics/summary - Analytics data
DELETE /api/reports/:id               - Delete report
```

### User Management
```
GET /api/users/profile    - Get user profile
PUT /api/users/profile    - Update profile
PUT /api/users/password   - Change password
GET /api/users/stats      - User activity stats
GET /api/users/activity   - User activity history
GET /api/users            - List all users (admin only)
```

## 🔐 Authentication & Authorization

### JWT Authentication
- Secure JWT tokens with configurable expiration
- Automatic token validation middleware
- Role-based access control (admin, user)

### Sample Credentials (after seeding)
```
Admin: admin@company.com / admin123
User:  john.smith@company.com / password123
```

## 📊 File Processing Pipeline

1. **Upload**: Files uploaded to secure storage
2. **Validation**: File type and size validation
3. **Processing**: Signature extraction and analysis
4. **Anomaly Detection**: AI-powered anomaly identification
5. **Storage**: Results stored in database
6. **Notification**: Status updates and alerts

## 🔧 Configuration Options

### Environment Variables
```env
# Server
PORT=8000
NODE_ENV=development

# Database
DATABASE_URL=postgresql://...
DB_HOST=localhost
DB_PORT=5432
DB_NAME=attendance_db
DB_USER=username
DB_PASSWORD=password

# Security
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
ALLOWED_FILE_TYPES=pdf,jpg,jpeg,png

# API
API_RATE_LIMIT=100
CORS_ORIGIN=http://localhost:3000

# Processing
CONFIDENCE_THRESHOLD=0.85
BATCH_SIZE=50
```

## 📈 Monitoring & Logging

### Request Logging
- Morgan HTTP request logging
- Configurable log levels for development/production
- Request timing and response status tracking

### Error Handling
- Centralized error handling middleware
- Detailed error logging with stack traces
- User-friendly error responses

### Database Monitoring
- Query performance logging
- Connection pool monitoring
- Automatic retry logic

## 🚀 Deployment

### NeonDB Setup
1. Create a NeonDB database
2. Copy the connection string
3. Update `DATABASE_URL` in environment variables
4. Run migrations: `npm run migrate`

### Production Deployment
```bash
# Build and start
npm install --production
npm run migrate
npm start
```

### Docker Deployment (Optional)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 8000
CMD ["npm", "start"]
```

## 🧪 Testing

### API Testing
Use tools like Postman or curl to test endpoints:

```bash
# Health check
curl http://localhost:8000/health

# Login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@company.com","password":"admin123"}'

# Upload file (with token)
curl -X POST http://localhost:8000/api/upload \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@attendance.pdf"
```

## 📝 Development

### Adding New Features
1. Create route files in `/routes`
2. Add middleware in `/middleware`
3. Update database schema in `/scripts/migrate.js`
4. Add validation rules using express-validator

### Database Migrations
```bash
# Create new migration
node scripts/migrate.js

# Reset database (development only)
# Drop all tables and recreate
```

## 🔒 Security Best Practices

- JWT tokens with secure secrets
- Password hashing with bcrypt
- Input validation and sanitization
- Rate limiting on API endpoints
- CORS configuration
- Helmet.js security headers
- SQL injection prevention with parameterized queries

## 📚 API Documentation

For detailed API documentation with request/response examples, see the `/docs` folder or use tools like Swagger/OpenAPI.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**Ready for NeonDB integration and production deployment!** 🎉