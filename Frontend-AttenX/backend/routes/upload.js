const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');
const { query } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, JPG, and PNG files are allowed.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024 // 10MB
  }
});

// Add multer error handling middleware
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    console.error('❌ Multer error:', err.message);
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 10MB.'
      });
    }
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
  if (err) {
    console.error('❌ File upload error:', err.message);
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
  next();
};

// Upload attendance sheet (temporarily without auth for testing)
router.post('/', upload.single('file'), handleMulterError, async (req, res) => {
  try {
    console.log('📁 Upload request received');
    console.log('📄 File:', req.file);
    console.log('📋 Body:', req.body);
    
    if (!req.file) {
      console.log('❌ No file in request');
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }
    
    console.log('✅ File received:', req.file.originalname);

    const { shiftType, department } = req.body;
    const sheetId = `${shiftType?.charAt(0) || 'A'}-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;

    // Save file info to database
    const result = await query(`
      INSERT INTO attendance_sheets (
        sheet_id, original_filename, file_path, file_size, file_type,
        upload_date, shift_type, department, uploaded_by, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `, [
      sheetId,
      req.file.originalname,
      req.file.path,
      req.file.size,
      req.file.mimetype,
      new Date(),
      shiftType || 'morning',
      department || 'general',
      1, // Default to admin user for testing
      'uploaded'
    ]);

    const sheet = result.rows[0];
    console.log('✅ File saved to database:', sheet.sheet_id);

    res.status(201).json({
      success: true,
      message: 'File uploaded successfully',
      data: {
        id: sheet.id,
        sheetId: sheet.sheet_id,
        originalFilename: sheet.original_filename,
        fileSize: sheet.file_size,
        fileType: sheet.file_type,
        uploadDate: sheet.upload_date,
        shiftType: sheet.shift_type,
        department: sheet.department,
        status: sheet.status
      }
    });

  } catch (error) {
    console.error('❌ Upload error:', error.message);
    console.error('❌ Full error:', error);
    
    // Clean up uploaded file if database save fails
    if (req.file) {
      try {
        await fs.unlink(req.file.path);
      } catch (unlinkError) {
        console.error('Failed to delete uploaded file:', unlinkError);
      }
    }

    res.status(500).json({
      success: false,
      message: 'Upload failed'
    });
  }
});

// Process uploaded file (temporarily without auth for testing)
router.post('/:id/process', async (req, res) => {
  try {
    const { id } = req.params;

    // Get sheet info
    const sheetResult = await query(
      'SELECT * FROM attendance_sheets WHERE id = $1',
      [id]
    );

    if (sheetResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Sheet not found'
      });
    }

    const sheet = sheetResult.rows[0];

    // Update status to processing
    await query(
      'UPDATE attendance_sheets SET status = $1, processed_at = CURRENT_TIMESTAMP WHERE id = $2',
      ['processing', id]
    );

    // Simulate processing (replace with actual ML/AI processing)
    setTimeout(async () => {
      try {
        // Simulate signature extraction and anomaly detection
        const mockSignatures = generateMockSignatures(sheet.sheet_id);
        const mockAnomalies = generateMockAnomalies(mockSignatures);

        // Save signatures to database
        for (const sig of mockSignatures) {
          const sigResult = await query(`
            INSERT INTO signatures (
              sheet_id, employee_id, employee_name, confidence_score,
              position_x, position_y, width, height
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING id
          `, [
            id, sig.employeeId, sig.employeeName, sig.confidence,
            sig.x, sig.y, sig.width, sig.height
          ]);

          sig.id = sigResult.rows[0].id;
        }

        // Save anomalies to database
        for (const anomaly of mockAnomalies) {
          await query(`
            INSERT INTO anomalies (
              signature_id, sheet_id, employee_id, anomaly_type,
              severity, description, confidence_score
            ) VALUES ($1, $2, $3, $4, $5, $6, $7)
          `, [
            anomaly.signatureId, id, anomaly.employeeId, anomaly.type,
            anomaly.severity, anomaly.description, anomaly.confidence
          ]);
        }

        // Update sheet status
        await query(`
          UPDATE attendance_sheets 
          SET status = $1, total_signatures = $2, anomalies_count = $3
          WHERE id = $4
        `, ['completed', mockSignatures.length, mockAnomalies.length, id]);

      } catch (error) {
        console.error('Processing error:', error);
        await query(
          'UPDATE attendance_sheets SET status = $1 WHERE id = $2',
          ['failed', id]
        );
      }
    }, 2000);

    res.json({
      success: true,
      message: 'Processing started',
      data: { status: 'processing' }
    });

  } catch (error) {
    console.error('Process initiation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to start processing'
    });
  }
});

// Get upload status (temporarily without auth for testing)
router.get('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(`
      SELECT id, sheet_id, status, total_signatures, anomalies_count, 
             processed_at, created_at
      FROM attendance_sheets WHERE id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Sheet not found'
      });
    }

    const sheet = result.rows[0];

    res.json({
      success: true,
      data: {
        id: sheet.id,
        sheetId: sheet.sheet_id,
        status: sheet.status,
        totalSignatures: sheet.total_signatures,
        anomaliesCount: sheet.anomalies_count,
        processedAt: sheet.processed_at,
        createdAt: sheet.created_at
      }
    });

  } catch (error) {
    console.error('Status check error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get status'
    });
  }
});

// Mock data generators (replace with actual ML processing)
function generateMockSignatures(sheetId) {
  const employees = [
    'John Smith', 'Sarah Johnson', 'Mike Davis', 'Lisa Wilson', 'Robert Brown',
    'Emily Chen', 'David Miller', 'Anna Garcia', 'James Taylor', 'Maria Rodriguez'
  ];

  return employees.map((name, index) => ({
    employeeId: `EMP${String(index + 1).padStart(3, '0')}`,
    employeeName: name,
    confidence: 0.7 + Math.random() * 0.3,
    x: Math.random() * 100,
    y: Math.random() * 100,
    width: 50 + Math.random() * 30,
    height: 20 + Math.random() * 15
  }));
}

function generateMockAnomalies(signatures) {
  const anomalyTypes = ['signature_mismatch', 'duplicate_signature', 'missing_signature', 'unusual_pattern'];
  const severities = ['low', 'medium', 'high'];
  
  return signatures
    .filter(() => Math.random() < 0.2) // 20% chance of anomaly
    .map(sig => ({
      signatureId: sig.id,
      employeeId: sig.employeeId,
      type: anomalyTypes[Math.floor(Math.random() * anomalyTypes.length)],
      severity: severities[Math.floor(Math.random() * severities.length)],
      description: `Detected ${anomalyTypes[Math.floor(Math.random() * anomalyTypes.length)].replace('_', ' ')} for ${sig.employeeName}`,
      confidence: 0.6 + Math.random() * 0.4
    }));
}

module.exports = router;