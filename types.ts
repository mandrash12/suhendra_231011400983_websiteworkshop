
export enum TaskCategory {
  WORK = 'Work',
  PERSONAL = 'Personal',
  STUDY = 'Study',
  URGENT = 'Urgent'
}

export enum TaskStatus {
  PENDING = 'Pending',
  COMPLETED = 'Completed'
}

export interface Task {
  id: string;
  title: string;
  description: string;
  category: TaskCategory;
  dueDate: string;
  status: TaskStatus;
  createdAt: number;
}

export interface TaskCreateInput {
  title: string;
  description: string;
  category: TaskCategory;
  dueDate: string;
}
