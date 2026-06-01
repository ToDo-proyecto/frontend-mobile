import React from 'react';
import { Pressable, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Text } from '@/components/ui/text';
import { TaskList } from '@/types/TaskList';

type Props = {
  item: TaskList;
  onPress?: () => void;
  onLongPress?: () => void;
};

const TaskListCard: React.FC<Props> = ({ item, onPress, onLongPress }) => {
  const color = item.idColor ?? '#3B82F6';
  const icon = (item.idIcon ?? 'list') as keyof typeof MaterialIcons.glyphMap;

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      style={({ pressed }) => ({
        marginBottom: 12, borderRadius: 20,
        backgroundColor: '#1E2122',
        borderWidth: 1, borderColor: '#2D3235',
        overflow: 'hidden', opacity: pressed ? 0.85 : 1,
        shadowColor: '#000', shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.18, shadowRadius: 10, elevation: 4,
      })}
    >
      {/* Color strip */}
      <View style={{ height: 4, backgroundColor: color }} />

      <View style={{ padding: 16 }}>
        {/* Header row */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 14 }}>
          <View style={{
            width: 44, height: 44, borderRadius: 13,
            backgroundColor: color + '28',
            alignItems: 'center', justifyContent: 'center', marginRight: 12,
          }}>
            <MaterialIcons name={icon} size={22} color={color} />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 16, fontWeight: '700', color: '#ECEDEE', marginBottom: 2 }}>
              {item.title}
            </Text>
            {!!item.subtitle && (
              <Text style={{ fontSize: 12, color: '#9BA1A6' }} numberOfLines={1}>
                {item.subtitle}
              </Text>
            )}
          </View>

          <View style={{ alignItems: 'flex-end', gap: 2 }}>
            <Text style={{ fontSize: 18, fontWeight: '800', color }}>
              {item.percentage}%
            </Text>
            <Text style={{ fontSize: 11, color: '#9BA1A6' }}>done</Text>
          </View>
        </View>

        {/* Progress bar */}
        <View style={{ height: 6, backgroundColor: '#2D3235', borderRadius: 99, overflow: 'hidden', marginBottom: 12 }}>
          <View style={{
            height: '100%',
            width: `${item.percentage}%`,
            backgroundColor: color,
            borderRadius: 99,
          }} />
        </View>

        {/* Tags */}
        {item.tags.length > 0 && (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
            {item.tags.slice(0, 4).map(tag => (
              <View key={tag} style={{
                paddingHorizontal: 9, paddingVertical: 3,
                borderRadius: 99, backgroundColor: color + '1A',
                borderWidth: 1, borderColor: color + '33',
              }}>
                <Text style={{ fontSize: 11, color, fontWeight: '600' }}>{tag}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </Pressable>
  );
};

export default TaskListCard;
