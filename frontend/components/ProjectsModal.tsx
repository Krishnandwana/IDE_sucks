'use client'

import { useState, useEffect } from 'react'
import { Project } from '@/types'
import { formatDate } from '@/utils/helpers'
import { X, Trash2 } from 'lucide-react'

interface ProjectsModalProps {
  onClose: () => void
  onLoadProject: (projectId: string) => void
}

export default function ProjectsModal({ onClose, onLoadProject }: ProjectsModalProps) {
  const [projects, setProjects] = useState<Project[]>([])

  useEffect(() => {
    const loadProjects = () => {
      const projectsList = JSON.parse(localStorage.getItem('projects') || '[]')
      setProjects(projectsList)
    }
    loadProjects()
  }, [])

  const deleteProject = (projectId: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      localStorage.removeItem(`project_${projectId}`)
      const updatedProjects = projects.filter(p => p.id !== projectId)
      localStorage.setItem('projects', JSON.stringify(updatedProjects))
      setProjects(updatedProjects)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-dark-sidebar rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-300 dark:border-dark-border">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-dark-text">
            Load Project
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
          >
            <X size={20} className="text-gray-700 dark:text-dark-text" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto max-h-[60vh]">
          {projects.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400 py-8">
              No saved projects found
            </p>
          ) : (
            <div className="space-y-2">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
                >
                  <div
                    className="flex-1 cursor-pointer"
                    onClick={() => onLoadProject(project.id)}
                  >
                    <h3 className="font-semibold text-gray-800 dark:text-dark-text">
                      {project.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {Object.keys(project.files).length} files
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      Updated: {formatDate(project.updatedAt)}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteProject(project.id)
                    }}
                    className="p-2 opacity-0 group-hover:opacity-100 hover:bg-red-100 dark:hover:bg-red-900 rounded transition-all"
                    title="Delete project"
                  >
                    <Trash2 size={18} className="text-red-600" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
