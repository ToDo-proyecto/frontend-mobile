import React from 'react';
import { Pressable, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { Task, TaskPriority } from '@/types/Task';

const PRIORITY_COLOR: Record<TaskPriority, string> = {
  low: '#6B7280',
  medium: '#F59E0B',
  high: '#EF4444',
};

const PRIORITY_LABEL: Record<TaskPriority, string> = {
  low: 'Low',
  medium: 'Med',
  high: 'High',
};

type Props = {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit?: (task: Task) => void;
};

export default function TaskItem({ task, onToggle, onDelete, onEdit }: Props) {
  const color = PRIORITY_COLOR[task.priority];

  return (
    <Box className="flex-row items-center py-3 border-b border-[#2D3235]">
      <Pressable
        onPress={() => onToggle(task.id)}
        style={{
          width: 24,
          height: 24,
          borderRadius: 12,
          borderWidth: 2,
          borderColor: task.completed ? '#0a7ea4' : '#4A5258',
          backgroundColor: task.completed ? '#0a7ea4' : 'transparent',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 12,
        }}
      >
        {task.completed && <MaterialIcons name="check" size={14} color="white" />}
      </Pressable>

      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: 15,
            color: task.completed ? '#4A5258' : '#ECEDEE',
            textDecorationLine: task.completed ? 'line-through' : 'none',
          }}
        >
          {task.title}
        </Text>
        {!!task.description && (
          <Text className="text-xs text-[#9BA1A6] mt-0.5" numberOfLines={1}>
            {task.description}
          </Text>
        )}
        {!!task.dueDate && (
          <Text className="text-xs text-[#9BA1A6] mt-0.5">
            Due {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </Text>
        )}
      </View>

      <View
        style={{
          paddingHorizontal: 8,
          paddingVertical: 2,
          borderRadius: 99,
          backgroundColor: color + '28',
          marginRight: 8,
        }}
      >
        <Text style={{ fontSize: 11, fontWeight: '600', color }}>{PRIORITY_LABEL[task.priority]}</Text>
      </View>

      {onEdit && (
        <Pressable onPress={() => onEdit(task)} hitSlop={8} style={{ marginRight: 8 }}>
          <MaterialIcons name="edit" size={18} color="#4A5258" />
        </Pressable>
      )}
      <Pressable onPress={() => onDelete(task.id)} hitSlop={8}>
        <MaterialIcons name="delete-outline" size={18} color="#4A5258" />
      </Pressable>
    </Box>
  );
}
