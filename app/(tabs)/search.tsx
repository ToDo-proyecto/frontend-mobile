import { useState, useEffect, useCallback } from 'react';
import { FlatList, Pressable, TextInput, View, Text as RNText } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

import TaskListCard from '@/components/TaskListCard/TaskListCard';
import EmptyState from '@/components/EmptyState/EmptyState';
import { Spinner } from '@/components/ui/spinner';
import { Text } from '@/components/ui/text';
import { TaskList } from '@/types/TaskList';
import { getTaskLists } from '@/services/tasks/taskLists';

export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const [allLists, setAllLists] = useState<TaskList[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const data = await getTaskLists();
      setAllLists(data);
    } catch {
      // silently fail — user sees empty results
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const q = query.trim().toLowerCase();
  const results = q
    ? allLists.filter(l =>
        l.title.toLowerCase().includes(q) ||
        l.subtitle?.toLowerCase().includes(q) ||
        l.tags.some(t => t.toLowerCase().includes(q))
      )
    : [];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#151718' }} edges={['top']}>
      <View style={{ flex: 1, paddingHorizontal: 20 }}>
        {/* Header */}
        <View style={{ paddingTop: 8, marginBottom: 20 }}>
          <RNText style={{ fontSize: 26, fontWeight: '800', color: '#ECEDEE', marginBottom: 16, lineHeight: 34, paddingTop: 4 }}>Search</RNText>

          {/* Search input */}
          <View style={{
            flexDirection: 'row', alignItems: 'center', gap: 10,
            backgroundColor: '#1E2122',
            borderWidth: 1, borderColor: '#2D3235',
            borderRadius: 16, paddingHorizontal: 14, paddingVertical: 12,
          }}>
            <MaterialIcons name="search" size={20} color="#9BA1A6" />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search lists by title or tag…"
              placeholderTextColor="#4A5258"
              style={{ flex: 1, color: '#ECEDEE', fontSize: 15 }}
              autoCapitalize="none"
              autoCorrect={false}
              clearButtonMode="while-editing"
            />
            {query.length > 0 && (
              <Pressable onPress={() => setQuery('')} hitSlop={8}>
                <MaterialIcons name="close" size={18} color="#9BA1A6" />
              </Pressable>
            )}
          </View>
        </View>

        {loading ? (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Spinner size="large" color="#0a7ea4" />
          </View>
        ) : q.length === 0 ? (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: -60 }}>
            <MaterialIcons name="search" size={52} color="#2D3235" />
            <Text style={{ color: '#4A5258', marginTop: 12, fontSize: 15 }}>Type to search your lists</Text>
          </View>
        ) : (
          <FlatList
            data={results}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <TaskListCard
                item={item}
                onPress={() => router.push({ pathname: '/lists/[id]' as any, params: { id: item.id } })}
              />
            )}
            ListHeaderComponent={
              <Text style={{ fontSize: 13, color: '#9BA1A6', marginBottom: 12 }}>
                {results.length} result{results.length !== 1 ? 's' : ''} for "{query}"
              </Text>
            }
            ListEmptyComponent={
              <EmptyState
                icon="search-off"
                title="No results"
                subtitle={`No lists match "${query}"`}
              />
            }
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
