import React, { useState } from 'react';
import {
  Modal, View, TextInput, Pressable,
  KeyboardAvoidingView, Platform, TouchableWithoutFeedback, ActivityIndicator, TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Text } from '@/components/ui/text';
import { Text as RNText } from 'react-native';
import { createTaskItem } from '@/services/tasks/taskItems';
import { Task, TaskPriority } from '@/types/Task';

const PRIORITIES: { value: TaskPriority; label: string; icon: keyof typeof MaterialIcons.glyphMap; color: string }[] = [
  { value: 'low', label: 'Low', icon: 'arrow-downward', color: '#6B7280' },
  { value: 'medium', label: 'Medium', icon: 'remove', color: '#F59E0B' },
  { value: 'high', label: 'High', icon: 'arrow-upward', color: '#EF4444' },
];

type Props = {
  visible: boolean;
  listId: string;
  onClose: () => void;
  onCreated: (task: Task) => void;
};

export default function CreateTaskSheet({ visible, listId, onClose, onCreated }: Props) {
  const insets = useSafeAreaInsets();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const reset = () => { setTitle(''); setDescription(''); setPriority('medium'); setError(''); };

  const handleClose = () => { reset(); onClose(); };

  const handleCreate = async () => {
    if (!title.trim()) { setError('Title is required'); return; }
    setError('');
    setLoading(true);
    try {
      const task = await createTaskItem({
        listId, title: title.trim(),
        description: description.trim() || undefined,
        priority, completed: false,
      });
      onCreated(task);
      reset();
    } catch {
      setError('Could not create task. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <TouchableWithoutFeedback onPress={handleClose}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.65)', justifyContent: 'flex-end' }}>
          <TouchableWithoutFeedback>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
              <View style={{
                backgroundColor: '#1A1C1E',
                borderTopLeftRadius: 28, borderTopRightRadius: 28,
                paddingTop: 12, paddingHorizontal: 24,
                paddingBottom: Math.max(insets.bottom, 16) + 16,
              }}>
                {/* Handle */}
                <View style={{ width: 36, height: 4, backgroundColor: '#3A3D40', borderRadius: 99, alignSelf: 'center', marginBottom: 24 }} />

                {/* Header */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                  <Text style={{ fontSize: 20, fontWeight: '700', color: '#ECEDEE' }}>New Task</Text>
                  <Pressable onPress={handleClose} hitSlop={8}>
                    <MaterialIcons name="close" size={22} color="#9BA1A6" />
                  </Pressable>
                </View>

                {/* Title */}
                <Text style={{ fontSize: 13, color: '#9BA1A6', fontWeight: '600', marginBottom: 8 }}>Title *</Text>
                <View style={{
                  backgroundColor: '#252729', borderWidth: 1, borderColor: '#2D3235',
                  borderRadius: 14, paddingHorizontal: 16, paddingVertical: 13, marginBottom: 16,
                }}>
                  <TextInput
                    value={title}
                    onChangeText={setTitle}
                    placeholder="What needs to be done?"
                    placeholderTextColor="#4A5258"
                    style={{ color: '#ECEDEE', fontSize: 15 }}
                    returnKeyType="next"
                    autoFocus
                  />
                </View>

                {/* Notes */}
                <Text style={{ fontSize: 13, color: '#9BA1A6', fontWeight: '600', marginBottom: 8 }}>Notes</Text>
                <View style={{
                  backgroundColor: '#252729', borderWidth: 1, borderColor: '#2D3235',
                  borderRadius: 14, paddingHorizontal: 16, paddingVertical: 13, marginBottom: 24,
                }}>
                  <TextInput
                    value={description}
                    onChangeText={setDescription}
                    placeholder="Add details (optional)"
                    placeholderTextColor="#4A5258"
                    style={{ color: '#ECEDEE', fontSize: 15 }}
                    multiline
                    numberOfLines={2}
                  />
                </View>

                {/* Priority */}
                <Text style={{ fontSize: 13, color: '#9BA1A6', fontWeight: '600', marginBottom: 12 }}>Priority</Text>
                <View style={{ flexDirection: 'row', gap: 10, marginBottom: 24 }}>
                  {PRIORITIES.map(p => (
                    <Pressable
                      key={p.value}
                      onPress={() => setPriority(p.value)}
                      style={({ pressed }) => ({
                        flex: 1, paddingVertical: 12,
                        borderRadius: 14, alignItems: 'center',
                        backgroundColor: priority === p.value ? p.color + '22' : '#252729',
                        borderWidth: 1.5,
                        borderColor: priority === p.value ? p.color : '#2D3235',
                        gap: 4, opacity: pressed ? 0.8 : 1,
                      })}
                    >
                      <MaterialIcons name={p.icon} size={18} color={priority === p.value ? p.color : '#9BA1A6'} />
                      <Text style={{ fontSize: 12, fontWeight: '700', color: priority === p.value ? p.color : '#9BA1A6' }}>
                        {p.label}
                      </Text>
                    </Pressable>
                  ))}
                </View>

                {!!error && (
                  <View style={{
                    backgroundColor: '#EF444420', borderRadius: 10, borderWidth: 1,
                    borderColor: '#EF4444', paddingHorizontal: 14, paddingVertical: 10, marginBottom: 16,
                  }}>
                    <Text style={{ color: '#EF4444', fontSize: 13 }}>{error}</Text>
                  </View>
                )}

                <TouchableOpacity
                  onPress={handleCreate}
                  disabled={loading}
                  activeOpacity={0.75}
                  style={{
                    backgroundColor: '#0a7ea4', borderRadius: 22,
                    paddingVertical: 17,
                    alignItems: 'center', justifyContent: 'center',
                    opacity: loading ? 0.6 : 1,
                  }}
                >
                  {loading
                    ? <ActivityIndicator color="white" size="small" />
                    : <RNText style={{ color: 'white', fontSize: 16, fontWeight: '700' }}>Add Task</RNText>
                  }
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
