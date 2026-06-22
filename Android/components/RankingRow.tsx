import { StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, FONT_SIZE, RADIUS, SPACING } from '@/constants/theme';
import type { RankingItem } from '@/types';

interface RankingRowProps {
  item: RankingItem & { souEu?: boolean };
}

export function RankingRow({ item }: RankingRowProps) {
  const isTop3 = item.posicao <= 3;
  const medalColor =
    item.posicao === 1
      ? COLORS.rankGold
      : item.posicao === 2
        ? COLORS.rankSilver
        : COLORS.rankBronze;

  return (
    <View style={[styles.row, item.souEu && styles.rowMe]}>
      <View style={styles.posicaoBlock}>
        {isTop3 ? (
          <Ionicons name="trophy" size={16} color={medalColor} />
        ) : (
          <Text style={styles.posicao}>{item.posicao}</Text>
        )}
      </View>

      {item.fotoPerfil ? (
        <Image
          source={{ uri: item.fotoPerfil }}
          style={styles.avatar}
          contentFit="cover"
        />
      ) : (
        <View style={[styles.avatar, styles.avatarFallback]}>
          <Text style={styles.avatarInitial}>
            {(item.nome ?? '?').charAt(0).toUpperCase()}
          </Text>
        </View>
      )}

      <Text style={styles.nome} numberOfLines={1}>
        {item.nome}
      </Text>

      <View style={styles.pts}>
        <Text style={styles.ptsValue}>{item.pontuacaoTotal}</Text>
        <Text style={styles.ptsLabel}>pts</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.sm,
    borderRadius: RADIUS.md,
    marginBottom: 4,
  },
  rowMe: {
    backgroundColor: COLORS.navy + '11',
    borderWidth: 1,
    borderColor: COLORS.navy + '33',
  },
  posicaoBlock: { width: 24, alignItems: 'center' },
  posicao: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.sm,
    color: COLORS.textMuted,
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
  },
  avatarFallback: {
    backgroundColor: COLORS.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.sm,
    color: COLORS.navy,
  },
  nome: {
    flex: 1,
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZE.md,
    color: COLORS.textPrimary,
  },
  pts: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 2,
  },
  ptsValue: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.lg,
    color: COLORS.navy,
  },
  ptsLabel: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZE.xs,
    color: COLORS.textMuted,
  },
});
