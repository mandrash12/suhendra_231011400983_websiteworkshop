
import { Task, TaskCreateInput, TaskStatus } from '../types';
import { taskRepository, TaskRepository } from '../repositories/TaskRepository';
import { TaskModel } from '../models/Task';

/**
 * Requirement 3: Service Layer (Business Logic)
 * Requirement 5: Error Handling
 */
export class TaskService {
  private repo: TaskRepository;

  constructor(repo: TaskRepository) {
    this.repo = repo;
  }

  createTask(input: TaskCreateInput): Task {
    // Rule: Title cannot be empty
    if (!input.title || input.title.trim() === '') {
      throw new Error('Validation Error: Task title cannot be empty.');
    }

    // Rule: Due date cannot be in the past
    if (input.dueDate) {
      const selectedDate = new Date(input.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        throw new Error('Validation Error: Due date cannot be in the past.');
      }
    }

    const newTask = TaskModel.create(input);
    this.repo.add(newTask);
    return newTask;
  }

  getTasks(): Task[] {
    return this.repo.getAll();
  }

  toggleStatus(id: string): void {
    const tasks = this.repo.getAll();
    const task = tasks.find(t => t.id === id);
    if (task) {
      task.status = task.status === TaskStatus.PENDING ? TaskStatus.COMPLETED : TaskStatus.PENDING;
      this.repo.update(task);
    }
  }

  deleteTask(id: string): void {
    this.repo.delete(id);
  }
}

export const taskService = new TaskService(taskRepository);
