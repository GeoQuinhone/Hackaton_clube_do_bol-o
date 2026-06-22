import { StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { COLORS, FONTS, FONT_SIZE, SPACING } from '@/constants/theme';
import type { Usuario } from '@/types';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  user?: Usuario | null;
}

export function ScreenHeader({ title, subtitle, user }: ScreenHeaderProps) {
  return (
    <View style={styles.row}>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
      {user &&
        (user.fotoPerfil ? (
          <Image
            source={{ uri: user.fotoPerfil }}
            style={styles.avatar}
            contentFit="cover"
          />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <Text style={styles.avatarInitial}>
              {(user.nome ?? '?').charAt(0).toUpperCase()}
            </Text>
          </View>
        ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  title: {
    fontFamily: FONTS.extraBold,
    fontSize: FONT_SIZE.xxl,
    color: COLORS.textPrimary,
  },
  subtitle: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  avatarPlaceholder: {
    backgroundColor: COLORS.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.green,
  },
  avatarInitial: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.md,
    color: COLORS.navy,
  },
});
