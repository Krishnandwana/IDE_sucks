'use client'

import { Sandpack } from '@codesandbox/sandpack-react'
import { FileStructure } from '@/types'

interface EditorProps {
  files: FileStructure
  activeFile: string
  updateFileContent: (filename: string, code: string) => void
  theme: 'light' | 'dark'
}

export default function Editor({ files, activeFile, updateFileContent, theme }: EditorProps) {
  return (
    <div className="flex-1 overflow-hidden">
      <Sandpack
        template="react"
        theme={theme === 'dark' ? 'dark' : 'light'}
        files={files}
        options={{
          showNavigator: false,
          showTabs: true,
          showLineNumbers: true,
          showInlineErrors: true,
          wrapContent: true,
          editorHeight: '100%',
          activeFile: activeFile,
          classes: {
            'sp-wrapper': 'h-full',
            'sp-layout': 'h-full',
          },
        }}
        customSetup={{
          dependencies: {
            react: '^18.2.0',
            'react-dom': '^18.2.0',
          },
        }}
      />
    </div>
  )
}
