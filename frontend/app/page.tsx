'use client'

import { useState, useEffect } from 'react'
import Editor from '@/components/Editor'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import { FileStructure, Project } from '@/types'
import { generateId } from '@/utils/helpers'

const defaultFiles: FileStructure = {
  '/App.js': {
    code: `export default function App() {
  return (
    <div style={{
      padding: '20px',
      fontFamily: 'system-ui, sans-serif',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      <h1 style={{ color: '#6366f1' }}>Welcome to CipherStudio!</h1>
      <p>Start editing to see changes in real-time.</p>
      <div style={{
        marginTop: '20px',
        padding: '15px',
        backgroundColor: '#f3f4f6',
        borderRadius: '8px'
      }}>
        <h2>Features:</h2>
        <ul>
          <li>Create and manage multiple files</li>
          <li>Live preview of your React code</li>
          <li>Save and load projects</li>
          <li>Dark/Light theme support</li>
        </ul>
      </div>
    </div>
  )
}`,
  },
  '/styles.css': {
    code: `body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

p {
  font-size: 1.1rem;
  line-height: 1.6;
  color: #374151;
}`,
  },
}

export default function Home() {
  const [files, setFiles] = useState<FileStructure>(defaultFiles)
  const [activeFile, setActiveFile] = useState<string>('/App.js')
  const [theme, setTheme] = useState<'light' | 'dark'>('dark')
  const [currentProject, setCurrentProject] = useState<Project | null>(null)
  const [autoSave, setAutoSave] = useState<boolean>(false)

  // Load initial project from localStorage
  useEffect(() => {
    const savedProjectId = localStorage.getItem('lastProjectId')
    if (savedProjectId) {
      const savedProject = localStorage.getItem(`project_${savedProjectId}`)
      if (savedProject) {
        const project: Project = JSON.parse(savedProject)
        setFiles(project.files)
        setCurrentProject(project)
      }
    }
  }, [])

  // Auto-save functionality
  useEffect(() => {
    if (autoSave && currentProject) {
      const timer = setTimeout(() => {
        saveProject()
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [files, autoSave, currentProject])

  const createNewFile = (filename: string) => {
    const newFiles = { ...files }
    newFiles[filename] = { code: '' }
    setFiles(newFiles)
    setActiveFile(filename)
  }

  const deleteFile = (filename: string) => {
    if (Object.keys(files).length <= 1) {
      alert('Cannot delete the last file')
      return
    }
    const newFiles = { ...files }
    delete newFiles[filename]
    setFiles(newFiles)
    if (activeFile === filename) {
      setActiveFile(Object.keys(newFiles)[0])
    }
  }

  const renameFile = (oldName: string, newName: string) => {
    if (files[newName]) {
      alert('File already exists')
      return
    }
    const newFiles: FileStructure = {}
    Object.keys(files).forEach(key => {
      if (key === oldName) {
        newFiles[newName] = files[oldName]
      } else {
        newFiles[key] = files[key]
      }
    })
    setFiles(newFiles)
    if (activeFile === oldName) {
      setActiveFile(newName)
    }
  }

  const updateFileContent = (filename: string, code: string) => {
    setFiles(prev => ({
      ...prev,
      [filename]: { code }
    }))
  }

  const saveProject = () => {
    const projectId = currentProject?.id || generateId()
    const project: Project = {
      id: projectId,
      name: currentProject?.name || `Project ${projectId.slice(0, 8)}`,
      files,
      createdAt: currentProject?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    localStorage.setItem(`project_${projectId}`, JSON.stringify(project))
    localStorage.setItem('lastProjectId', projectId)
    setCurrentProject(project)

    // Also save to projects list
    const projectsList = JSON.parse(localStorage.getItem('projects') || '[]')
    const existingIndex = projectsList.findIndex((p: Project) => p.id === projectId)
    if (existingIndex >= 0) {
      projectsList[existingIndex] = project
    } else {
      projectsList.push(project)
    }
    localStorage.setItem('projects', JSON.stringify(projectsList))

    alert('Project saved successfully!')
  }

  const loadProject = (projectId: string) => {
    const savedProject = localStorage.getItem(`project_${projectId}`)
    if (savedProject) {
      const project: Project = JSON.parse(savedProject)
      setFiles(project.files)
      setCurrentProject(project)
      setActiveFile(Object.keys(project.files)[0])
      localStorage.setItem('lastProjectId', projectId)
    }
  }

  const createNewProject = () => {
    setFiles(defaultFiles)
    setActiveFile('/App.js')
    setCurrentProject(null)
    localStorage.removeItem('lastProjectId')
  }

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }

  const toggleAutoSave = () => {
    setAutoSave(prev => !prev)
  }

  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <div className="h-screen flex flex-col bg-white dark:bg-dark-bg">
        <Header
          theme={theme}
          toggleTheme={toggleTheme}
          saveProject={saveProject}
          loadProject={loadProject}
          createNewProject={createNewProject}
          currentProject={currentProject}
          autoSave={autoSave}
          toggleAutoSave={toggleAutoSave}
        />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar
            files={files}
            activeFile={activeFile}
            setActiveFile={setActiveFile}
            createNewFile={createNewFile}
            deleteFile={deleteFile}
            renameFile={renameFile}
            theme={theme}
          />
          <Editor
            files={files}
            activeFile={activeFile}
            updateFileContent={updateFileContent}
            theme={theme}
          />
        </div>
      </div>
    </div>
  )
}
