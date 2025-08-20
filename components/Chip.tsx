// src/components/Chip.tsx
import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle } from 'react-native';

type ChipProps = {
  label: string;
  selected?: boolean;
  disabled?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
};

export default function Chip({ label, selected, disabled, onPress, style }: ChipProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        selected && styles.selected,
        disabled && styles.disabled,
        pressed && !disabled && { opacity: 0.85 },
        style,
      ]}
      android_ripple={{ color: '#e5e7eb' }}
    >
      <Text style={[styles.text, selected && styles.textSelected, disabled && styles.textDisabled]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#ffffff',
    marginRight: 8,
    marginBottom: 8,
  },
  selected: {
    backgroundColor: '#111827',
    borderColor: '#111827',
  },
  disabled: {
    opacity: 0.4,
  },
  text: {
    fontSize: 13,
    color: '#111827',
    fontWeight: '600',
  },
  textSelected: {
    color: '#ffffff',
  },
  textDisabled: {
    color: '#6b7280',
  },
});
