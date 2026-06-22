import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import {
  COLORS,
  FONTS,
  FONT_SIZE,
  GRADIENTS,
  RADIUS,
  SHADOW,
  SPACING,
} from '@/constants/theme';

interface PointsHeroProps {
  pontos: number;
  posicao: number;
  totalPalpites: number;
}

export function PointsHero({ pontos, posicao, totalPalpites }: PointsHeroProps) {
  return (
    <LinearGradient
      colors={GRADIENTS.hero}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.card, SHADOW.lg]}
    >
      <View style={styles.mainRow}>
        <View style={styles.pointsBlock}>
          <Text style={styles.pointsLabel}>Seus pontos</Text>
          <Text style={styles.pointsValue}>{pontos}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.statsBlock}>
          <Stat icon="trophy" value={`${posicao}º`} label="Posição" />
          <Stat icon="checkmark-circle" value={String(totalPalpites)} label="Palpites" />
        </View>
      </View>
    </LinearGradient>
  );
}

function Stat({
  icon,
  value,
  label,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  value: string;
  label: string;
}) {
  return (
    <View style={styles.stat}>
      <Ionicons name={icon} size={14} color={COLORS.gold} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    marginBottom: SPACING.xl,
  },
  mainRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pointsBlock: { flex: 1 },
  pointsLabel: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZE.sm,
    color: COLORS.textonDarkMuted,
  },
  pointsValue: {
    fontFamily: FONTS.extraBold,
    fontSize: FONT_SIZE.display,
    color: COLORS.white,
    marginTop: 2,
  },
  divider: {
    width: 1,
    height: 50,
    backgroundColor: 'rgba(255,255,255,0.15)',
    marginHorizontal: SPACING.xl,
  },
  statsBlock: { gap: SPACING.md },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  statValue: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.md,
    color: COLORS.white,
  },
  statLabel: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZE.xs,
    color: COLORS.textonDarkMuted,
  },
});
