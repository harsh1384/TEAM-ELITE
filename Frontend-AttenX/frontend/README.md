# Attendance Anomaly Detection - Frontend

A professional Next.js frontend application for detecting signature anomalies in scanned attendance sheets using AI-powered analysis.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation & Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   ```bash
   # .env.local is already configured for local development
   # Backend API: http://localhost:8000/api
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   ```
   http://localhost:3000
   ```

## 📁 Project Structure

```
frontend/
├── app/                    # Next.js App Router
│   ├── layout.js          # Root layout with navigation
│   ├── page.js            # Dashboard page
│   ├── upload/            # File upload functionality
│   ├── anomalies/         # Anomaly review interface
│   ├── reports/           # Analytics and reporting
│   ├── profile/           # User profile management
│   └── globals.css        # Global styles
├── lib/
│   └── api.js             # API client for backend integration
├── package.json           # Dependencies and scripts
├── tailwind.config.js     # Tailwind CSS configuration
├── postcss.config.js      # PostCSS configuration
└── .env.local            # Environment variables
```

## 🎨 Features

### Core Pages
- **Dashboard**: Real-time overview with stats and recent activity
- **Upload**: Drag-and-drop file upload with progress tracking
- **Anomalies**: Signature anomaly review and management
- **Reports**: Analytics dashboard with charts and insights
- **Profile**: User profile and notification settings

### UI/UX Features
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Dark/Light Mode**: Toggle with persistent preference
- **Amber Theme**: Professional amber and white color scheme
- **Smooth Animations**: Transitions and hover effects
- **Loading States**: Progress indicators and status updates

## 🔌 Backend Integration

The frontend connects to the backend API running on `http://localhost:8000/api`

### API Client Usage
```javascript
import apiClient from '../lib/api'

// Login
const response = await apiClient.login('admin@company.com', 'admin123')

// Get dashboard data
const stats = await apiClient.getDashboardStats()

// Upload file
const formData = new FormData()
formData.append('file', file)
const uploadResponse = await apiClient.uploadFile(formData)
```

## 🛠️ Development

### Available Scripts
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Environment Variables
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_APP_NAME=AttendanceAI
```

## 🎯 Key Components

### Layout (`app/layout.js`)
- Responsive sidebar navigation
- Dark mode toggle
- Mobile-friendly design
- Authentication state management

### Dashboard (`app/page.js`)
- Statistics cards with real-time data
- Quick action buttons
- Recent activity timeline
- Performance metrics

### Upload (`app/upload/page.js`)
- Drag-and-drop file interface
- File validation and preview
- Progress tracking
- Batch processing

### API Integration (`lib/api.js`)
- Centralized API client
- Authentication handling
- Error management
- Request/response formatting

## 🚀 Deployment

### Build for Production
```bash
npm run build
npm run start
```

### Environment Setup
Update `.env.local` for production:
```env
NEXT_PUBLIC_API_URL=https://your-backend-api.com/api
```

## 🔧 Customization

### Theme Colors
Edit `tailwind.config.js` to customize the amber color palette:
```javascript
colors: {
  amber: {
    // Custom amber shades
  }
}
```

### API Configuration
Update `lib/api.js` to modify API endpoints or add new methods.

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

**Ready to connect with your backend API!** 🎉