import type { Meta, StoryObj } from "@storybook/react-native";
import { View } from "react-native";
import { fn } from "storybook/test";

import TaskListCard from "./TaskListCard";

const meta = {
  title: "Components/TaskListCard",
  component: TaskListCard,
  tags: ["autodocs"],
  args: { onPress: fn(), onLongPress: fn() },
  decorators: [
    (Story) => (
      <View style={{ flex: 1, padding: 16, backgroundColor: "#151718" }}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof TaskListCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const baseItem = {
  id: "1",
  title: "Computer Science",
  subtitle: "Algorithms and data structures",
  percentage: 60,
  tags: ["school", "important"],
  idColor: "#3B82F6",
  idIcon: "code",
};

export const Default: Story = {
  args: { item: baseItem },
};

export const HighProgress: Story = {
  args: { item: { ...baseItem, title: "Math", percentage: 90, idColor: "#8B5CF6", idIcon: "functions" } },
};

export const LowProgress: Story = {
  args: { item: { ...baseItem, title: "History", percentage: 20, idColor: "#10B981", idIcon: "menu-book", tags: ["reading"] } },
};

export const Completed: Story = {
  args: { item: { ...baseItem, title: "Personal", percentage: 100, idColor: "#F59E0B", tags: [] } },
};
