
import { Task, TaskCategory, TaskStatus, TaskCreateInput } from '../types';

export class TaskModel {
  /**
   * Domain Model Creator
   * Requirement 1: Supports Category and Due Date
   */
  static create(input: TaskCreateInput): Task {
    return {
      id: crypto.randomUUID?.() || Math.random().toString(36).substr(2, 9),
      title: input.title.trim(),
      description: input.description?.trim() || '',
      category: input.category,
      dueDate: input.dueDate,
      status: TaskStatus.PENDING,
      createdAt: Date.now()
    };
  }
}
