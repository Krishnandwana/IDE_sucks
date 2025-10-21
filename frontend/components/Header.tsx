'use client'

import { useState } from 'react'
import { Save, FolderOpen, Plus, Sun, Moon, ToggleLeft, ToggleRight } from 'lucide-react'
import { Project } from '@/types'
import ProjectsModal from './ProjectsModal'

interface HeaderProps {
  theme: 'light' | 'dark'
  toggleTheme: () => void
  saveProject: () => void
  loadProject: (projectId: string) => void
  createNewProject: () => void
  currentProject: Project | null
  autoSave: boolean
  toggleAutoSave: () => void
}

export default function Header({
  theme,
  toggleTheme,
  saveProject,
  loadProject,
  createNewProject,
  currentProject,
  autoSave,
  toggleAutoSave
}: HeaderProps) {
  const [showProjectsModal, setShowProjectsModal] = useState(false)

  return (
    <>
      <header className="h-12 bg-gray-100 dark:bg-dark-sidebar border-b border-gray-300 dark:border-dark-border flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-gray-800 dark:text-dark-text">
            <span className="text-indigo-500">Cipher</span>Studio
          </h1>
          {currentProject && (
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {currentProject.name}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={createNewProject}
            className="flex items-center gap-2 px-3 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded transition-colors text-sm"
            title="New Project"
          >
            <Plus size={16} />
            <span className="hidden sm:inline">New</span>
          </button>

          <button
            onClick={saveProject}
            className="flex items-center gap-2 px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded transition-colors text-sm"
            title="Save Project"
          >
            <Save size={16} />
            <span className="hidden sm:inline">Save</span>
          </button>

          <button
            onClick={() => setShowProjectsModal(true)}
            className="flex items-center gap-2 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors text-sm"
            title="Load Project"
          >
            <FolderOpen size={16} />
            <span className="hidden sm:inline">Load</span>
          </button>

          <button
            onClick={toggleAutoSave}
            className={`flex items-center gap-2 px-3 py-1.5 rounded transition-colors text-sm ${
              autoSave
                ? 'bg-purple-500 hover:bg-purple-600 text-white'
                : 'bg-gray-300 hover:bg-gray-400 text-gray-700'
            }`}
            title={autoSave ? 'Auto-save On' : 'Auto-save Off'}
          >
            {autoSave ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
            <span className="hidden sm:inline">Auto-save</span>
          </button>

          <button
            onClick={toggleTheme}
            className="p-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded transition-colors"
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
        </div>
      </header>

      {showProjectsModal && (
        <ProjectsModal
          onClose={() => setShowProjectsModal(false)}
          onLoadProject={(projectId) => {
            loadProject(projectId)
            setShowProjectsModal(false)
          }}
        />
      )}
    </>
  )
}
