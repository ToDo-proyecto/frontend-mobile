import api from '../api';
import { TaskList } from '@/types/TaskList';

export const getTaskLists = async (): Promise<TaskList[]> => {
  const res = await api.get<TaskList[]>('/api/task-lists');
  return res.data;
};

export const getTaskListById = async (id: string): Promise<TaskList> => {
  const res = await api.get<TaskList>(`/api/task-lists/${id}`);
  return res.data;
};

export const createTaskList = async (
  data: Pick<TaskList, 'title' | 'subtitle' | 'tags' | 'idColor' | 'idIcon'>
): Promise<TaskList> => {
  const res = await api.post<TaskList>('/api/task-lists', {
    title: data.title,
    subtitle: data.subtitle,
    tags: data.tags,
    color: data.idColor,
    icon: data.idIcon,
  });
  return res.data;
};

export const updateTaskList = async (id: string, data: Partial<TaskList>): Promise<TaskList> => {
  const res = await api.put<TaskList>(`/api/task-lists/${id}`, {
    title: data.title,
    subtitle: data.subtitle,
    tags: data.tags,
    color: data.idColor,
    icon: data.idIcon,
  });
  return res.data;
};

export const deleteTaskList = async (id: string): Promise<void> => {
  await api.delete(`/api/task-lists/${id}`);
};
