export interface FileStructure {
  [key: string]: {
    code: string
  }
}

export interface Project {
  id: string
  name: string
  files: FileStructure
  createdAt: string
  updatedAt: string
}

export interface User {
  id: string
  email: string
  name: string
}
