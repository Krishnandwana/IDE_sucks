export const generateId = (): string => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export const getFileExtension = (filename: string): string => {
  const parts = filename.split('.')
  return parts.length > 1 ? parts[parts.length - 1] : ''
}

export const getFileIcon = (filename: string): string => {
  const ext = getFileExtension(filename)
  const iconMap: { [key: string]: string } = {
    js: '📄',
    jsx: '⚛️',
    ts: '📘',
    tsx: '⚛️',
    css: '🎨',
    html: '🌐',
    json: '📋',
    md: '📝',
  }
  return iconMap[ext] || '📄'
}
