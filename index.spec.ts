import request from 'supertest';
import app from './index';
import mongoose from 'mongoose';

describe('Express Server', () => {
    let server: any;

    beforeAll(async () => {
      server = app.listen(4000);
      await mongoose.connect('mongodb://localhost:27017/pdfProject', {
      });
    });
  
    afterAll(async () => {
      server.close();
      await mongoose.connection.close();
    });
    
    it('responds with 200 OK and returns an array of files on GET /files', async () => {
        const response = await request(app).get('/files');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    it('responds with 400 Bad Request when no files are attached to POST /upload', async () => {
        const response = await request(app).post('/upload');
        expect(response.status).toBe(400);
        expect(response.body.error).toBe('No files were uploaded');
    });

    it('responds with 200 OK and success message when valid files are attached to POST /upload', async () => {
        const response = await request(server)
        .post('/upload')
        .attach('pdfFiles', 'test.pdf');
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('PDF files uploaded and saved successfully');
    });

    it('responds with 200 OK and success message when multiple valid files are attached to POST /upload', async () => {
        const response = await request(app)
        .post('/upload')
        .attach('pdfFiles', 'test1.pdf')
        .attach('pdfFiles', 'test2.pdf');
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('PDF files uploaded and saved successfully');
    });

    it('responds with 500 Internal Server Error when saving files to database fails', async () => {
        // const response = await request(app)
        //   .post('/upload')
        //   .attach('pdfFiles', 'test3.pdf');
        // expect(response.status).toBe(500);
        // expect(response.body.error).toBe('Failed to save PDF files to database');
    });
});
