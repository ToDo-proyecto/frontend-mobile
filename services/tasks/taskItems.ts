import api from '../api';
import { Task } from '@/types/Task';

export const getTaskItems = async (listId: string): Promise<Task[]> => {
  const res = await api.get<Task[]>(`/api/task-lists/${listId}/items`);
  return res.data;
};

export const createTaskItem = async (
  data: Omit<Task, 'id' | 'createdAt'>
): Promise<Task> => {
  const res = await api.post<Task>(`/api/task-lists/${data.listId}/items`, {
    title: data.title,
    description: data.description,
    priority: data.priority,
    dueDate: data.dueDate,
  });
  return res.data;
};

export const toggleTaskItem = async (
  listId: string,
  itemId: string,
  completed: boolean
): Promise<Task> => {
  const res = await api.patch<Task>(
    `/api/task-lists/${listId}/items/${itemId}`,
    { completed }
  );
  return res.data;
};

export const updateTaskItem = async (
  listId: string,
  itemId: string,
  data: Partial<Pick<Task, 'title' | 'description' | 'priority' | 'dueDate'>>
): Promise<Task> => {
  const res = await api.patch<Task>(
    `/api/task-lists/${listId}/items/${itemId}`,
    data
  );
  return res.data;
};

export const deleteTaskItem = async (listId: string, itemId: string): Promise<void> => {
  await api.delete(`/api/task-lists/${listId}/items/${itemId}`);
};
