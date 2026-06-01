import { useEffect, useState, useCallback, useRef } from 'react';
import { FlatList, Pressable, RefreshControl, View, Alert, useWindowDimensions, Text as RNText, TouchableOpacity } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

import TaskListCard from '@/components/TaskListCard/TaskListCard';
import EmptyState from '@/components/EmptyState/EmptyState';
import CreateListSheet from '@/components/CreateListSheet/CreateListSheet';
import { Spinner } from '@/components/ui/spinner';
import { Text } from '@/components/ui/text';
import { TaskList } from '@/types/TaskList';
import { getTaskLists, deleteTaskList } from '@/services/tasks/taskLists';
import { useAuth } from '@/contexts/AuthContext';

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function HomeScreen() {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const [lists, setLists] = useState<TaskList[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [editingList, setEditingList] = useState<TaskList | null>(null);
  const [showCompleted, setShowCompleted] = useState(false);

  const firstName = user?.displayName?.split(' ')[0] ?? user?.email?.split('@')[0] ?? 'there';
  const date = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  const isFirstFocus = useRef(true);

  const loadLists = useCallback(async () => {
    try {
      setError(null);
      const data = await getTaskLists();
      setLists(data);
    } catch {
      setError('Could not load lists.\nIs the backend running?');
    }
  }, []);

  // Carga inicial con spinner
  useEffect(() => {
    loadLists().finally(() => setLoading(false));
  }, [loadLists]);

  // Recarga silenciosa cada vez que el home vuelve a tener foco
  useFocusEffect(
    useCallback(() => {
      if (isFirstFocus.current) {
        isFirstFocus.current = false;
        return;
      }
      loadLists();
    }, [loadLists])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadLists();
    setRefreshing(false);
  };

  const handleLongPress = (item: TaskList) => {
    Alert.alert(item.title, 'What would you like to do?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Edit', onPress: () => setEditingList(item) },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteTaskList(item.id);
            setLists(prev => prev.filter(l => l.id !== item.id));
          } catch {
            Alert.alert('Error', 'Could not delete the list');
          }
        },
      },
    ]);
  };

  const activeLists = lists.filter(l => l.percentage < 100);
  const completedLists = lists.filter(l => l.percentage === 100);
  const avg = lists.length ? Math.round(lists.reduce((s, l) => s + l.percentage, 0) / lists.length) : 0;
  const statW = (width - 48 - 16) / 3;

  const ListHeader = (
    <View style={{ paddingTop: 8 }}>
      {/* Greeting */}
      <View style={{ marginBottom: 20, paddingTop: 4 }}>
        <RNText style={{ fontSize: 24, fontWeight: '800', color: '#ECEDEE', lineHeight: 32 }} numberOfLines={1} adjustsFontSizeToFit>
          {getGreeting()}, {firstName}!
        </RNText>
        <RNText style={{ fontSize: 13, color: '#9BA1A6', marginTop: 4 }}>{date}</RNText>
      </View>

      {/* Stats */}
      <View style={{ flexDirection: 'row', gap: 10, marginBottom: 28 }}>
        {[
          { label: 'Total Lists',   value: String(lists.length),           color: '#0a7ea4' },
          { label: 'Avg. Progress', value: `${avg}%`,                      color: '#8B5CF6' },
          { label: 'Completed',     value: String(completedLists.length),  color: '#10B981' },
        ].map(s => (
          <View key={s.label} style={{
            flex: 1,
            backgroundColor: '#1E2122',
            borderWidth: 1, borderColor: '#2D3235',
            borderRadius: 18, paddingVertical: 16, paddingHorizontal: 10,
            alignItems: 'center',
            shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.15, shadowRadius: 6,
          }}>
            <RNText style={{ fontSize: 24, fontWeight: '800', color: s.color, lineHeight: 30 }}>{s.value}</RNText>
            <RNText style={{ fontSize: 10, color: '#9BA1A6', marginTop: 4, textAlign: 'center', fontWeight: '600' }}>{s.label}</RNText>
          </View>
        ))}
      </View>

      {/* Section header */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <RNText style={{ fontSize: 18, fontWeight: '700', color: '#ECEDEE' }}>My Lists</RNText>
        <TouchableOpacity
          onPress={() => setShowCreate(true)}
          activeOpacity={0.75}
          style={{
            flexDirection: 'row', alignItems: 'center', gap: 6,
            backgroundColor: '#0a7ea4',
            paddingHorizontal: 16, paddingVertical: 10,
            borderRadius: 10,
          }}
        >
          <MaterialIcons name="add" size={16} color="white" />
          <RNText style={{ fontSize: 13, color: 'white', fontWeight: '700' }}>New List</RNText>
        </TouchableOpacity>
      </View>
    </View>
  );

  const CompletedSection = completedLists.length > 0 ? (
    <View style={{ marginTop: 8, marginBottom: 8 }}>
      <Pressable
        onPress={() => setShowCompleted(v => !v)}
        style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 14 }}
      >
        <MaterialIcons
          name={showCompleted ? 'expand-less' : 'expand-more'}
          size={20} color="#9BA1A6"
        />
        <Text style={{ color: '#9BA1A6', fontSize: 14, fontWeight: '600' }}>
          Completed Lists ({completedLists.length})
        </Text>
      </Pressable>
      {showCompleted && completedLists.map(item => (
        <TaskListCard
          key={item.id}
          item={item}
          onPress={() => router.push({ pathname: '/lists/[id]' as any, params: { id: item.id } })}
          onLongPress={() => handleLongPress(item)}
        />
      ))}
    </View>
  ) : null;

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#151718' }} edges={['top']}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Spinner size="large" color="#0a7ea4" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#151718' }} edges={['top']}>
      <View style={{ flex: 1, paddingHorizontal: 20 }}>
        {error ? (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <MaterialIcons name="wifi-off" size={52} color="#4A5258" />
            <Text style={{ color: '#9BA1A6', marginTop: 12, textAlign: 'center', lineHeight: 22 }}>{error}</Text>
            <Pressable
              onPress={loadLists}
              style={{ marginTop: 20, backgroundColor: '#0a7ea4', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 }}
            >
              <Text style={{ color: 'white', fontWeight: '700' }}>Retry</Text>
            </Pressable>
          </View>
        ) : (
          <FlatList
            data={activeLists}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <TaskListCard
                item={item}
                onPress={() => router.push({ pathname: '/lists/[id]' as any, params: { id: item.id } })}
                onLongPress={() => handleLongPress(item)}
              />
            )}
            ListHeaderComponent={ListHeader}
            ListEmptyComponent={
              lists.length === 0 ? (
                <EmptyState
                  icon="playlist-add"
                  title="No lists yet"
                  subtitle="Tap + New List to create your first one"
                />
              ) : null
            }
            ListFooterComponent={CompletedSection}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#0a7ea4" />
            }
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
          />
        )}

      </View>

      <CreateListSheet
        visible={showCreate}
        onClose={() => setShowCreate(false)}
        onCreated={newList => {
          setLists(prev => [newList, ...prev]);
          setShowCreate(false);
        }}
      />
      <CreateListSheet
        visible={!!editingList}
        initialList={editingList ?? undefined}
        onClose={() => setEditingList(null)}
        onCreated={() => {}}
        onUpdated={updated => {
          setLists(prev => prev.map(l => l.id === updated.id ? updated : l));
          setEditingList(null);
        }}
      />
    </SafeAreaView>
  );
}
