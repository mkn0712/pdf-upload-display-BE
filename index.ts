import express, { NextFunction, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import connectDB from './db';
import FileModel, { IFile } from './FileModel';

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

// Multer Storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});
const upload = multer({ storage: storage });



// Add headers before the routes are defined
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
});

// Serve uploaded PDFs
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Handle PDF upload
app.post('/upload', upload.array('pdfFiles'), async (req: Request, res: Response) => {
  try { 

    const files = req.files;
    const pdfDocs: IFile[] = [];
    if (!files) {
      return res.status(400).json({ error: 'No files were uploaded' });
    }

    if (!Array.isArray(files)) {
      return res.status(400).json({ error: 'Invalid request: files must be an array' });
    }

    if (files.length === 0) {
      return res.status(400).json({ error: 'No files were uploaded' });
    }
    
    files?.forEach((file: { originalname: any; path: any; }) => {
      const originalname= file?.originalname;
      const filePath = "http://localhost:3000/uploads/" + originalname;
      const newPdf = new FileModel({ fileName: originalname, filePath })
      pdfDocs.push(newPdf);
    })


    try {
      const docs = await FileModel.insertMany(pdfDocs);
      console.log('PDF files saved to database:', docs);
      res.json({ message: 'PDF files uploaded and saved successfully' });
    } catch (err) {
      console.error('Error saving PDF files to database:', err);
      res.status(500).json({ error: 'Failed to save PDF files to database' });
    }
  } catch (error) {
    console.error('Error uploading PDF:', error);
    res.status(500).send('Error uploading PDF');
  }
});

// Get all files
app.get('/files', async (req: Request, res: Response) => {
  try {
    const files: IFile[] = await FileModel.find();
    res.json(files);
  } catch (error) {
    console.error('Error fetching files:', error);
    res.status(500).send('Error fetching files');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});