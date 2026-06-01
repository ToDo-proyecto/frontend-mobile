import type { Meta, StoryObj } from "@storybook/react-native";
import { View } from "react-native";
import { fn } from "storybook/test";

import Tag from "./Tag";

const meta = {
  title: "Components/Tag",
  component: Tag,
  tags: ["autodocs"],
  args: {
    label: "school",
    onPress: fn(),
  },
  argTypes: {
    variant: {
      control: "radio",
      options: ["filled", "unfilled"],
    },
    color: {
      control: "select",
      options: ["gray", "blue", "green", "red", "yellow", "purple"],
    },
    size: {
      control: "radio",
      options: ["sm", "md"],
    },
  },
  decorators: [
    (Story) => (
      <View style={{ flex: 1, padding: 16, backgroundColor: "#111" }}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof Tag>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Filled: Story = {
  args: { variant: "filled", color: "green" },
};

export const Unfilled: Story = {
  args: { variant: "unfilled", color: "red" },
};

export const Removable: Story = {
  args: {
    variant: "filled",
    color: "red",
    label: "important",
    onRemove: fn(),
  },
};
