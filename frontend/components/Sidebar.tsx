'use client'

import { useState } from 'react'
import { FileStructure } from '@/types'
import { FilePlus, Trash2, Edit2, Check, X } from 'lucide-react'
import { getFileIcon } from '@/utils/helpers'

interface SidebarProps {
  files: FileStructure
  activeFile: string
  setActiveFile: (filename: string) => void
  createNewFile: (filename: string) => void
  deleteFile: (filename: string) => void
  renameFile: (oldName: string, newName: string) => void
  theme: 'light' | 'dark'
}

export default function Sidebar({
  files,
  activeFile,
  setActiveFile,
  createNewFile,
  deleteFile,
  renameFile,
  theme
}: SidebarProps) {
  const [newFileName, setNewFileName] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [editingFile, setEditingFile] = useState<string | null>(null)
  const [editFileName, setEditFileName] = useState('')

  const handleCreateFile = () => {
    if (newFileName.trim()) {
      const filename = newFileName.startsWith('/') ? newFileName : `/${newFileName}`
      createNewFile(filename)
      setNewFileName('')
      setIsCreating(false)
    }
  }

  const handleRenameFile = (oldName: string) => {
    if (editFileName.trim() && editFileName !== oldName) {
      const newName = editFileName.startsWith('/') ? editFileName : `/${editFileName}`
      renameFile(oldName, newName)
    }
    setEditingFile(null)
    setEditFileName('')
  }

  const startRename = (filename: string) => {
    setEditingFile(filename)
    setEditFileName(filename.startsWith('/') ? filename.slice(1) : filename)
  }

  return (
    <div className="w-64 bg-gray-50 dark:bg-dark-sidebar border-r border-gray-300 dark:border-dark-border flex flex-col">
      <div className="p-4 border-b border-gray-300 dark:border-dark-border">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-700 dark:text-dark-text uppercase">
            Files
          </h2>
          <button
            onClick={() => setIsCreating(true)}
            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
            title="New File"
          >
            <FilePlus size={16} className="text-gray-700 dark:text-dark-text" />
          </button>
        </div>

        {isCreating && (
          <div className="flex items-center gap-2 mb-2">
            <input
              type="text"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCreateFile()
                if (e.key === 'Escape') {
                  setIsCreating(false)
                  setNewFileName('')
                }
              }}
              placeholder="filename.js"
              className="flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-indigo-500"
              autoFocus
            />
            <button
              onClick={handleCreateFile}
              className="p-1 hover:bg-green-100 dark:hover:bg-green-900 rounded"
            >
              <Check size={14} className="text-green-600" />
            </button>
            <button
              onClick={() => {
                setIsCreating(false)
                setNewFileName('')
              }}
              className="p-1 hover:bg-red-100 dark:hover:bg-red-900 rounded"
            >
              <X size={14} className="text-red-600" />
            </button>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        {Object.keys(files).map((filename) => (
          <div
            key={filename}
            className={`group flex items-center justify-between px-4 py-2 cursor-pointer transition-colors ${
              activeFile === filename
                ? 'bg-indigo-100 dark:bg-indigo-900/30 border-l-4 border-indigo-500'
                : 'hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {editingFile === filename ? (
              <div className="flex items-center gap-2 flex-1">
                <input
                  type="text"
                  value={editFileName}
                  onChange={(e) => setEditFileName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleRenameFile(filename)
                    if (e.key === 'Escape') {
                      setEditingFile(null)
                      setEditFileName('')
                    }
                  }}
                  className="flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  autoFocus
                />
                <button
                  onClick={() => handleRenameFile(filename)}
                  className="p-1 hover:bg-green-100 dark:hover:bg-green-900 rounded"
                >
                  <Check size={14} className="text-green-600" />
                </button>
                <button
                  onClick={() => {
                    setEditingFile(null)
                    setEditFileName('')
                  }}
                  className="p-1 hover:bg-red-100 dark:hover:bg-red-900 rounded"
                >
                  <X size={14} className="text-red-600" />
                </button>
              </div>
            ) : (
              <>
                <div
                  onClick={() => setActiveFile(filename)}
                  className="flex items-center gap-2 flex-1"
                >
                  <span>{getFileIcon(filename)}</span>
                  <span className="text-sm text-gray-800 dark:text-dark-text truncate">
                    {filename}
                  </span>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      startRename(filename)
                    }}
                    className="p-1 hover:bg-blue-100 dark:hover:bg-blue-900 rounded"
                    title="Rename"
                  >
                    <Edit2 size={14} className="text-blue-600" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      if (confirm(`Delete ${filename}?`)) {
                        deleteFile(filename)
                      }
                    }}
                    className="p-1 hover:bg-red-100 dark:hover:bg-red-900 rounded"
                    title="Delete"
                  >
                    <Trash2 size={14} className="text-red-600" />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
