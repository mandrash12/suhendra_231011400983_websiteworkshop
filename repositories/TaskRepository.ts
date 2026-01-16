
import { Task } from '../types';

/**
 * Requirement 2: Repository Layer
 * Manages the storage and retrieval of task data.
 */
export class TaskRepository {
  private tasks: Task[] = [];
  private storageKey = 'tms_tasks_v1';

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    const saved = localStorage.getItem(this.storageKey);
    if (saved) {
      try {
        this.tasks = JSON.parse(saved);
      } catch (e) {
        this.tasks = [];
      }
    }
  }

  private saveToStorage() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.tasks));
  }

  getAll(): Task[] {
    return [...this.tasks].sort((a, b) => b.createdAt - a.createdAt);
  }

  add(task: Task): void {
    this.tasks.push(task);
    this.saveToStorage();
  }

  update(updatedTask: Task): void {
    this.tasks = this.tasks.map(t => t.id === updatedTask.id ? updatedTask : t);
    this.saveToStorage();
  }

  delete(id: string): void {
    this.tasks = this.tasks.filter(t => t.id !== id);
    this.saveToStorage();
  }
}

export const taskRepository = new TaskRepository();
