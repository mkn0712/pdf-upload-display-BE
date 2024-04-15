import mongoose, { Schema, Document } from 'mongoose';

export interface IFile extends Document {
  fileName: string;
  filePath: string;
}

const FileSchema: Schema = new Schema({
  fileName: { type: String, required: true },
  filePath: { type: String, required: true }
});

export default mongoose.model<IFile>('File', FileSchema);