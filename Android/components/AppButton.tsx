import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import { COLORS, FONTS, FONT_SIZE, RADIUS, SPACING } from '@/constants/theme';

type Variant = 'primary' | 'outline' | 'ghost' | 'danger';

interface AppButtonProps {
  title: string;
  onPress: () => void;
  variant?: Variant;
  loading?: boolean;
  disabled?: boolean;
}

export function AppButton({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
}: AppButtonProps) {
  const spinnerColor =
    variant === 'primary' || variant === 'danger' ? COLORS.white : COLORS.navy;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.btn,
        styles[variant],
        (disabled || loading) && styles.disabled,
        pressed && styles.pressed,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={spinnerColor} size="small" />
      ) : (
        <Text style={[styles.text, styles[`text_${variant}` as keyof typeof styles]]}>
          {title}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  primary: { backgroundColor: COLORS.navy },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: COLORS.navy,
  },
  ghost: { backgroundColor: 'transparent' },
  danger: { backgroundColor: COLORS.danger },
  disabled: { opacity: 0.5 },
  pressed: { opacity: 0.8 },
  text: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZE.md,
  },
  text_primary: { color: COLORS.white },
  text_outline: { color: COLORS.navy },
  text_ghost: { color: COLORS.textSecondary },
  text_danger: { color: COLORS.white },
});
