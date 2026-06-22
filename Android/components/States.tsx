import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppButton } from './AppButton';
import { COLORS, FONTS, FONT_SIZE, SPACING } from '@/constants/theme';

export function LoadingState({ label = 'Carregando...' }: { label?: string }) {
  return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color={COLORS.navy} />
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

export function ErrorState({
  title = 'Algo deu errado',
  subtitle,
  onRetry,
}: {
  title?: string;
  subtitle?: string;
  onRetry?: () => void;
}) {
  return (
    <View style={styles.center}>
      <Ionicons name="alert-circle-outline" size={48} color={COLORS.danger} />
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      {onRetry && (
        <View style={{ marginTop: SPACING.lg, width: 180 }}>
          <AppButton title="Tentar novamente" variant="outline" onPress={onRetry} />
        </View>
      )}
    </View>
  );
}

export function EmptyState({
  icon = 'search-outline',
  title,
  subtitle,
}: {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
}) {
  return (
    <View style={styles.center}>
      <Ionicons name={icon} size={48} color={COLORS.textMuted} />
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xxl,
    gap: SPACING.sm,
  },
  label: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZE.md,
    color: COLORS.textMuted,
    marginTop: SPACING.sm,
  },
  title: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZE.md,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginTop: SPACING.xs,
  },
  subtitle: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZE.sm,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
});
