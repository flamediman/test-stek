export interface User {
  id: number
  name: string
  avatar: string
  email: string
  registrationDate: string
  lastActivity: string
  loginCount: number
  postsCount: number
  commentsCount: number
  status: UserStatus
  role: UserRole
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  MODERATOR = 'moderator',
}

export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc',
}
