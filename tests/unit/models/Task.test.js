
/**
 * Requirement 4: Writing Your First Test
 * Pattern: AAA (Arrange, Act, Assert)
 */
import { TaskModel } from '../../../models/Task';
import { TaskCategory, TaskStatus } from '../../../types';

describe('TaskModel Unit Tests', () => {
  it('should successfully create a Task instance with correct properties', () => {
    // 1. Arrange
    const input = {
      title: 'Finish Clean Architecture Tutorial',
      description: 'Implement Repository and Service layers',
      category: TaskCategory.WORK,
      dueDate: '2025-12-31'
    };

    // 2. Act
    const result = TaskModel.create(input);

    // 3. Assert
    expect(result.title).toBe(input.title);
    expect(result.category).toBe(TaskCategory.WORK);
    expect(result.status).toBe(TaskStatus.PENDING);
    expect(result.id).toBeDefined();
    expect(typeof result.createdAt).toBe('number');
  });
});
