import express, { Response } from 'express'
import Project from '../models/Project'
import { authMiddleware, optionalAuth, AuthRequest } from '../middleware/auth'

const router = express.Router()

// Get all projects (user's projects or public)
router.get('/', optionalAuth, async (req: AuthRequest, res: Response) => {
  try {
    const query = req.userId
      ? { $or: [{ userId: req.userId }, { isPublic: true }] }
      : { isPublic: true }

    const projects = await Project.find(query)
      .sort({ updatedAt: -1 })
      .select('-__v')

    res.json(projects)
  } catch (error) {
    console.error('Get projects error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Get single project by ID
router.get('/:id', optionalAuth, async (req: AuthRequest, res: Response) => {
  try {
    const project = await Project.findById(req.params.id)

    if (!project) {
      return res.status(404).json({ message: 'Project not found' })
    }

    // Check if user has access
    if (!project.isPublic && project.userId !== req.userId) {
      return res.status(403).json({ message: 'Access denied' })
    }

    res.json(project)
  } catch (error) {
    console.error('Get project error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Create new project
router.post('/', optionalAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { name, files, isPublic } = req.body

    const project = new Project({
      name,
      files,
      userId: req.userId,
      isPublic: isPublic || false,
    })

    await project.save()

    res.status(201).json(project)
  } catch (error) {
    console.error('Create project error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Update project
router.put('/:id', optionalAuth, async (req: AuthRequest, res: Response) => {
  try {
    const project = await Project.findById(req.params.id)

    if (!project) {
      return res.status(404).json({ message: 'Project not found' })
    }

    // Check if user owns the project
    if (project.userId && project.userId !== req.userId) {
      return res.status(403).json({ message: 'Access denied' })
    }

    const { name, files, isPublic } = req.body

    if (name) project.name = name
    if (files) project.files = files
    if (typeof isPublic !== 'undefined') project.isPublic = isPublic

    await project.save()

    res.json(project)
  } catch (error) {
    console.error('Update project error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Delete project
router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const project = await Project.findById(req.params.id)

    if (!project) {
      return res.status(404).json({ message: 'Project not found' })
    }

    // Check if user owns the project
    if (project.userId !== req.userId) {
      return res.status(403).json({ message: 'Access denied' })
    }

    await Project.findByIdAndDelete(req.params.id)

    res.json({ message: 'Project deleted successfully' })
  } catch (error) {
    console.error('Delete project error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Get user's projects only
router.get('/user/me', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const projects = await Project.find({ userId: req.userId })
      .sort({ updatedAt: -1 })
      .select('-__v')

    res.json(projects)
  } catch (error) {
    console.error('Get user projects error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

export default router
