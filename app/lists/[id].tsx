import { useEffect, useState, useCallback } from 'react';
import { FlatList, Pressable, RefreshControl, View, Alert, Text as RNText, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

import TaskItem from '@/components/TaskItem/TaskItem';
import EmptyState from '@/components/EmptyState/EmptyState';
import CreateTaskSheet from '@/components/CreateTaskSheet/CreateTaskSheet';
import EditTaskSheet from '@/components/EditTaskSheet/EditTaskSheet';
import { Spinner } from '@/components/ui/spinner';
import { Text } from '@/components/ui/text';
import { Task } from '@/types/Task';
import { TaskList } from '@/types/TaskList';
import { getTaskListById } from '@/services/tasks/taskLists';
import { getTaskItems, toggleTaskItem, deleteTaskItem } from '@/services/tasks/taskItems';

export default function ListDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const [list, setList] = useState<TaskList | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showCompleted, setShowCompleted] = useState(false);

  const color = list?.idColor ?? '#0a7ea4';

  const load = useCallback(async () => {
    try {
      const [listData, itemsData] = await Promise.all([
        getTaskListById(id),
        getTaskItems(id),
      ]);
      setList(listData);
      setTasks(itemsData);
    } catch {
      Alert.alert('Error', 'Could not load tasks');
    }
  }, [id]);

  useEffect(() => {
    load().finally(() => setLoading(false));
  }, [load]);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const handleToggle = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t));
    try {
      await toggleTaskItem(id, taskId, !task.completed);
    } catch {
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, completed: task.completed } : t));
    }
  };

  const handleDelete = (taskId: string) => {
    Alert.alert('Delete task', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive',
        onPress: async () => {
          setTasks(prev => prev.filter(t => t.id !== taskId));
          try {
            await deleteTaskItem(id, taskId);
          } catch {
            await load();
          }
        },
      },
    ]);
  };

  const activeTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);
  const total = tasks.length;
  const done = completedTasks.length;
  const percentage = total === 0 ? 0 : Math.round((done / total) * 100);

  const ListHeader = (
    <View style={{ paddingTop: 8, marginBottom: 8 }}>
      {/* Progress card */}
      <View style={{
        backgroundColor: '#1E2122', borderRadius: 20,
        borderWidth: 1, borderColor: '#2D3235',
        padding: 20, marginBottom: 24,
        shadowColor: '#000', shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.15, shadowRadius: 10,
      }}>
        {/* Percentage + label row */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <View style={{ flex: 1, minWidth: 0, paddingRight: 12 }}>
            {!!list?.subtitle && (
              <Text style={{ color: '#9BA1A6', fontSize: 13, marginBottom: 2 }} numberOfLines={1}>
                {list.subtitle}
              </Text>
            )}
            <Text style={{ color: '#ECEDEE', fontSize: 13 }}>
              {done} of {total} task{total !== 1 ? 's' : ''} completed
            </Text>
          </View>
          <View style={{
            backgroundColor: color + '22', borderRadius: 14,
            paddingHorizontal: 14, paddingVertical: 8, flexShrink: 0,
          }}>
            <Text style={{ fontSize: 28, fontWeight: '800', color, lineHeight: 34 }}>
              {percentage}%
            </Text>
          </View>
        </View>
        {/* Progress bar */}
        <View style={{ height: 8, backgroundColor: '#2D3235', borderRadius: 99, overflow: 'hidden' }}>
          <View style={{
            height: '100%', width: `${percentage}%`,
            backgroundColor: color, borderRadius: 99,
          }} />
        </View>
      </View>

      {/* Section header */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
        <Text style={{ fontSize: 17, fontWeight: '700', color: '#ECEDEE' }}>Tasks</Text>
        <TouchableOpacity
          onPress={() => setShowCreate(true)}
          activeOpacity={0.75}
          style={{
            flexDirection: 'row', alignItems: 'center', gap: 6,
            backgroundColor: color,
            paddingHorizontal: 16, paddingVertical: 10,
            borderRadius: 10,
          }}
        >
          <MaterialIcons name="add" size={16} color="white" />
          <RNText style={{ fontSize: 13, color: 'white', fontWeight: '700' }}>Add Task</RNText>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <>
        <Stack.Screen options={{
          title: 'Loading…',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <MaterialIcons name="arrow-back-ios" size={22} color="#0a7ea4" />
            </TouchableOpacity>
          ),
        }} />
        <View style={{ flex: 1, backgroundColor: '#151718', alignItems: 'center', justifyContent: 'center' }}>
          <Spinner size="large" color="#0a7ea4" />
        </View>
      </>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#151718' }}>
      <Stack.Screen options={{
        title: list?.title ?? 'Tasks',
        headerTintColor: color,
        headerStyle: { backgroundColor: '#151718' },
        headerShadowVisible: false,
        gestureEnabled: true,
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => router.back()}
            style={{
              width: 36, height: 36, borderRadius: 18,
              backgroundColor: '#2D3235',
              alignItems: 'center', justifyContent: 'center',
            }}
          >
            <MaterialIcons name="arrow-back" size={20} color={color} />
          </TouchableOpacity>
        ),
      }} />

      <View style={{ flex: 1, paddingHorizontal: 20 }}>
        <FlatList
          data={activeTasks}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TaskItem task={item} onToggle={handleToggle} onDelete={handleDelete} onEdit={setEditingTask} />
          )}
          ListHeaderComponent={ListHeader}
          ListEmptyComponent={
            activeTasks.length === 0 && completedTasks.length === 0 ? (
              <EmptyState
                icon="check-circle-outline"
                title="No tasks yet"
                subtitle="Add your first task to get started"
              />
            ) : null
          }
          ListFooterComponent={
            completedTasks.length > 0 ? (
              <View style={{ marginTop: 8 }}>
                <Pressable
                  onPress={() => setShowCompleted(v => !v)}
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 12 }}
                >
                  <MaterialIcons
                    name={showCompleted ? 'expand-less' : 'expand-more'}
                    size={20} color="#9BA1A6"
                  />
                  <Text style={{ color: '#9BA1A6', fontSize: 14, fontWeight: '600' }}>
                    Completed ({completedTasks.length})
                  </Text>
                </Pressable>
                {showCompleted && completedTasks.map(item => (
                  <TaskItem
                    key={item.id}
                    task={item}
                    onToggle={handleToggle}
                    onDelete={handleDelete}
                    onEdit={setEditingTask}
                  />
                ))}
              </View>
            ) : null
          }
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={color} />
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
        />
      </View>

      <CreateTaskSheet
        visible={showCreate}
        listId={id}
        onClose={() => setShowCreate(false)}
        onCreated={task => {
          setTasks(prev => [task, ...prev]);
          setShowCreate(false);
        }}
      />
      <EditTaskSheet
        visible={!!editingTask}
        task={editingTask}
        listId={id}
        onClose={() => setEditingTask(null)}
        onUpdated={updated => {
          setTasks(prev => prev.map(t => t.id === updated.id ? updated : t));
          setEditingTask(null);
        }}
      />
    </View>
  );
}
