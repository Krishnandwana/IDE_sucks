import mongoose, { Schema, Document } from 'mongoose'

interface IFile {
  [key: string]: {
    code: string
  }
}

export interface IProject extends Document {
  name: string
  files: IFile
  userId?: string
  isPublic: boolean
  createdAt: Date
  updatedAt: Date
}

const ProjectSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    files: {
      type: Schema.Types.Mixed,
      required: true,
      default: {},
    },
    userId: {
      type: String,
      required: false,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)

// Indexes for better query performance
ProjectSchema.index({ userId: 1, updatedAt: -1 })
ProjectSchema.index({ isPublic: 1, updatedAt: -1 })

export default mongoose.model<IProject>('Project', ProjectSchema)
