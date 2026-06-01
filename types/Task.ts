export type TaskPriority = 'low' | 'medium' | 'high';

export type Task = {
  id: string;
  listId: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: TaskPriority;
  dueDate?: string;
  createdAt: string;
};
