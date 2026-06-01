import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Pressable } from "../ui/pressable";
import { Text } from "../ui/text";

export type TagVariant = "filled" | "unfilled";
export type TagColor = "green" | "red";
export type TagSize = "sm" | "md";

export type TagProps = {
  /** Texto a mostrar en el tag. */
  label: string;
  /**
   * Estilo visual.
   * - `filled`: fondo sólido, texto claro.
   * - `unfilled`: solo borde, fondo transparente.
   * @default "filled"
   */
  variant?: TagVariant;
  /** Color semántico del tag. @default "gray" */
  color?: TagColor;
  /** Tamaño. @default "md" */
  size?: TagSize;
  /** Callback al presionar el tag. */
  onPress?: () => void;
  /** Si se pasa, muestra un botón "×" y llama este callback al tocarlo. */
  onRemove?: () => void;
};

const FILLED_BG: Record<TagColor, string> = {
  green: "bg-green-600",
  red: "bg-red-600",
};

const UNFILLED_BORDER: Record<TagColor, string> = {
  green: "border border-green-400",
  red: "border border-red-400",
};

const FILLED_TEXT: Record<TagColor, string> = {
  green: "text-white",
  red: "text-white",
};

const UNFILLED_TEXT: Record<TagColor, string> = {
  green: "text-green-300",
  red: "text-red-300",
};

const SIZE_CONTAINER: Record<TagSize, string> = {
  sm: "px-2 py-0.5 rounded-md",
  md: "px-3 py-1 rounded-lg",
};

const SIZE_TEXT: Record<TagSize, string> = {
  sm: "text-xs",
  md: "text-sm",
};

const SIZE_ICON: Record<TagSize, number> = {
  sm: 12,
  md: 14,
};

const Tag: React.FC<TagProps> = ({
  label,
  variant = "filled",
  color = "green",
  size = "md",
  onPress,
  onRemove,
}) => {
  const isFilled = variant === "filled";
  const containerClass = `flex-row items-center self-start ${SIZE_CONTAINER[size]} ${isFilled ? FILLED_BG[color] : UNFILLED_BORDER[color]
    }`;
  const textClass = `font-medium ${SIZE_TEXT[size]} ${isFilled ? FILLED_TEXT[color] : UNFILLED_TEXT[color]
    }`;

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      className={containerClass}
    >
      <Text className={textClass}>{label}</Text>

      {onRemove && (
        <Pressable
          onPress={onRemove}
          hitSlop={8}
          className="ml-1.5"
          accessibilityLabel={`Remove ${label}`}
        >
          <MaterialIcons
            name="close"
            size={SIZE_ICON[size]}
            color={isFilled ? "#fff" : "#9ca3af"}
          />
        </Pressable>
      )}
    </Pressable>
  );
};

export default Tag;
