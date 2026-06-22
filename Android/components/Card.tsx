import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { COLORS, FONTS, FONT_SIZE, RADIUS, SHADOW, SPACING } from '@/constants/theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function Card({ children, style }: CardProps) {
  return <View style={[styles.card, SHADOW.sm, style]}>{children}</View>;
}

interface SectionTitleProps {
  title: string;
  action?: { label: string; onPress: () => void };
}

export function SectionTitle({ title, action }: SectionTitleProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.title}>{title}</Text>
      {action && (
        <Text style={styles.action} onPress={action.onPress}>
          {action.label}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.lg,
    color: COLORS.textPrimary,
  },
  action: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZE.sm,
    color: COLORS.green,
  },
});
