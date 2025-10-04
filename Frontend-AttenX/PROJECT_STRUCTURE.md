# Attendance Anomaly Detection System

A full-stack application for detecting signature anomalies in scanned attendance sheets using AI-powered analysis.

## 📁 Project Structure

```
attendance-anomaly-system/
├── frontend/                    # Next.js Frontend Application
│   ├── app/                    # Next.js App Router
│   │   ├── layout.js          # Root layout with navigation
│   │   ├── page.js            # Dashboard page
│   │   ├── upload/            # File upload functionality
│   │   ├── anomalies/         # Anomaly review interface
│   │   ├── reports/           # Analytics and reporting
│   │   ├── profile/           # User profile management
│   │   └── globals.css        # Global styles
│   ├── lib/
│   │   └── api.js             # API client for backend integration
│   ├── package.json           # Frontend dependencies
│   ├── tailwind.config.js     # Tailwind CSS configuration
│   └── .env.local            # Frontend environment variables
│
├── backend/                     # Node.js/Express Backend API
│   ├── config/
│   │   └── database.js        # NeonDB connection configuration
│   ├── middleware/
│   │   ├── auth.js            # JWT authentication middleware
│   │   └── errorHandler.js    # Error handling middleware
│   ├── routes/
│   │   ├── auth.js            # Authentication endpoints
│   │   ├── upload.js          # File upload & processing
│   │   ├── anomalies.js       # Anomaly management
│   │   ├── dashboard.js       # Dashboard data
│   │   ├── reports.js         # Reports & analytics
│   │   └── users.js           # User management
│   ├── scripts/
│   │   ├── migrate.js         # Database schema setup
│   │   ├── seed.js            # Sample data insertion
│   │   └── test-connection.js # Database connection testing
│   ├── uploads/               # File upload directory
│   ├── package.json           # Backend dependencies
│   ├── server.js              # Main server file
│   └── .env                   # Backend environment variables
│
└── PROJECT_STRUCTURE.md        # This file
```

## 🚀 Quick Start

### 1. Backend Setup
```bash
cd backend
npm install
npm run migrate    # Setup database tables
npm run seed      # Add sample data
npm run dev       # Start backend server (port 8000)
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev       # Start frontend server (port 3000)
```

### 3. Access Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000/api
- **Health Check**: http://localhost:8000/health

## 🔐 Default Credentials

After running the seed script:
- **Admin**: `admin@company.com` / `admin123`
- **User**: `john.smith@company.com` / `password123`

## 🗄️ Database (NeonDB)

The backend is configured to work with your NeonDB instance:
- **Connection**: Configured in `backend/.env`
- **Tables**: 8 tables for users, attendance sheets, signatures, anomalies, etc.
- **Sample Data**: Includes test users, attendance sheets, and anomalies

## 🔌 API Integration

The frontend communicates with the backend through:
- **API Client**: `frontend/lib/api.js`
- **Base URL**: `http://localhost:8000/api`
- **Authentication**: JWT tokens stored in localStorage

## 📊 Features

### Frontend (Next.js)
- **Dashboard**: Real-time statistics and activity feed
- **Upload**: Drag-and-drop file upload with progress tracking
- **Anomalies**: Review and manage detected signature anomalies
- **Reports**: Analytics dashboard with charts and insights
- **Profile**: User profile and notification settings
- **Responsive**: Works on desktop, tablet, and mobile
- **Dark Mode**: Toggle between light and dark themes
- **Amber Theme**: Professional amber and white color scheme

### Backend (Node.js/Express)
- **Authentication**: JWT-based auth with role management
- **File Processing**: Secure upload and anomaly detection simulation
- **Database**: Full CRUD operations with NeonDB
- **API Endpoints**: RESTful API for all frontend operations
- **Security**: Rate limiting, input validation, error handling
- **Logging**: Request logging and error tracking

## 🛠️ Development Workflow

### Making Changes

1. **Frontend Changes**:
   ```bash
   cd frontend
   # Edit files in app/ or lib/
   # Changes auto-reload at http://localhost:3000
   ```

2. **Backend Changes**:
   ```bash
   cd backend
   # Edit files in routes/, middleware/, etc.
   # Server auto-restarts with nodemon
   ```

3. **Database Changes**:
   ```bash
   cd backend
   # Edit scripts/migrate.js
   npm run migrate
   ```

### Testing API Endpoints

```bash
cd backend
node test-endpoints.js  # Test all API endpoints
```

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
cd frontend
npm run build
# Deploy dist/ folder
```

### Backend (Railway/Heroku/VPS)
```bash
cd backend
# Set environment variables
npm run migrate  # Setup production database
npm start       # Start production server
```

### Environment Variables

**Frontend (.env.local)**:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_APP_NAME=AttendanceAI
```

**Backend (.env)**:
```env
DATABASE_URL=postgresql://neondb_owner:npg_c7GCqjTkF0Kw@ep-polished-bonus-adq4zj4u-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require
JWT_SECRET=your-secret-key
PORT=8000
NODE_ENV=development
```

## 📝 API Documentation

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/profile` - Get current user

### Dashboard
- `GET /api/dashboard/stats` - Dashboard statistics
- `GET /api/dashboard/activity` - Recent activity

### Upload & Processing
- `POST /api/upload` - Upload attendance sheet
- `POST /api/upload/:id/process` - Process uploaded file
- `GET /api/upload/:id/status` - Get processing status

### Anomalies
- `GET /api/anomalies` - List anomalies (with filtering)
- `GET /api/anomalies/:id` - Get anomaly details
- `PATCH /api/anomalies/:id` - Update anomaly status

### Reports
- `GET /api/reports` - List reports
- `POST /api/reports/generate` - Generate new report
- `GET /api/reports/analytics/summary` - Analytics data

## 🔧 Troubleshooting

### Common Issues

1. **Port Already in Use**:
   ```bash
   # Kill process on port 8000
   netstat -ano | findstr :8000
   taskkill /PID <PID> /F
   ```

2. **Database Connection Issues**:
   ```bash
   cd backend
   npm run test-db  # Test NeonDB connection
   ```

3. **Frontend API Connection**:
   - Check `frontend/.env.local` has correct API URL
   - Ensure backend is running on port 8000

### Getting Help

- Check the README files in `frontend/` and `backend/` folders
- Review the API test results: `backend/test-endpoints.js`
- Verify database connection: `backend/scripts/test-connection.js`

---

**Your full-stack attendance anomaly detection system is ready!** 🎉

Both frontend and backend are properly separated and can be developed, deployed, and scaled independently.