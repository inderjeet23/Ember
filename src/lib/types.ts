export type ProjectType = 'writing' | 'video' | 'dev' | 'other'
export type ProjectState = 'fresh' | 'warm' | 'cooling' | 'cold'
export type WinType = 'taskComplete' | 'milestoneComplete' | 'sprintComplete' | 'ideaPromoted' | 'touchOnly'
export type IdeaStatus = 'cooling' | 'promoted' | 'archived'

export interface Task {
  id: string
  name: string
  isActive: boolean
  isComplete: boolean
  createdAt: number
  completedAt?: number
  milestoneIndex?: number | null
}

export interface Win {
  id: string
  projectId: string
  type: WinType
  value: number
  createdAt: number
}

export interface Project {
  id: string
  name: string
  type: ProjectType
  momentumScore: number
  state: ProjectState
  createdAt: number
  updatedAt: number
  lastTouchedAt?: number
  lastDailyRecompute?: number
  tasks: Task[]
  wins: Win[]
}

export interface Idea {
  id: string
  text: string
  createdAt: number
  coolingUntil: number
  status: IdeaStatus
  promotedProjectId?: string
}

export interface DB {
  projects: Project[]
  ideas: Idea[]
}
