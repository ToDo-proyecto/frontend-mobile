import React from 'react';
import { View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';

type Props = {
  icon: keyof typeof MaterialIcons.glyphMap;
  title: string;
  subtitle: string;
};

export default function EmptyState({ icon, title, subtitle }: Props) {
  return (
    <Box className="flex-1 items-center justify-center py-16">
      <View className="w-20 h-20 rounded-full bg-[#1E2122] items-center justify-center mb-4">
        <MaterialIcons name={icon} size={36} color="#4A5258" />
      </View>
      <Text className="text-lg font-semibold text-[#9BA1A6]">{title}</Text>
      <Text className="text-sm text-[#4A5258] mt-1 text-center px-8">{subtitle}</Text>
    </Box>
  );
}
