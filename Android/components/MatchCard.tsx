import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View,} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, FONT_SIZE, PHASE_LABEL, RADIUS, SHADOW, SPACING, STATUS_LABEL,} from '@/constants/theme';
import type { Partida } from '@/types';

interface MatchCardProps {
  match: Partida;
  compact?: boolean;
  onSubmitGuess?: (golsA: number, golsB: number) => void | Promise<void>;
}

export function MatchCard({
  match,
  compact = false,
  onSubmitGuess,
}: MatchCardProps) {
  const [golsA, setGolsA] = useState(
    match.meuPalpite != null ? String(match.meuPalpite.golsCasa ?? 0) : '',
  );
  const [golsB, setGolsB] = useState(
    match.meuPalpite != null ? String(match.meuPalpite.golsFora ?? 0) : '',
  );
  const [submitting, setSubmitting] = useState(false);

  const podePalpitar = match.status === 'AGENDADA' && !!onSubmitGuess;
  const dataHora = new Date(match.dataHora);

  async function handleSubmit() {
    const a = parseInt(golsA, 10);
    const b = parseInt(golsB, 10);
    if (isNaN(a) || isNaN(b) || a < 0 || b < 0) {
      Alert.alert('Palpite inválido', 'Informe os gols de cada time (ex: 1 × 0).');
      return;
    }
    setSubmitting(true);
    try {
      await onSubmitGuess?.(a, b);
    } finally {
      setSubmitting(false);
    }
  }

  const statusColor =
    match.status === 'EM_ANDAMENTO'
      ? COLORS.green
      : match.status === 'FINALIZADA'
        ? COLORS.textMuted
        : COLORS.info;

  return (
    <View style={[styles.card, SHADOW.sm]}>
      {!compact && (
        <View style={styles.meta}>
          <Text style={styles.metaText}>{PHASE_LABEL[match.fase] ?? match.fase}</Text>
          <View style={[styles.statusBadge, { backgroundColor: statusColor + '22' }]}>
            <Text style={[styles.statusText, { color: statusColor }]}>
              {STATUS_LABEL[match.status] ?? match.status}
            </Text>
          </View>
        </View>
      )}

      <View style={styles.teamsRow}>
        <TeamBlock
          nome={match.selecaoCasa.nome}
          bandeira={match.selecaoCasa.bandeiraUrl}
          align="left"
        />
        <View style={styles.scoreBlock}>
          {match.status === 'AGENDADA' ? (
            <Text style={styles.vsText}>VS</Text>
          ) : (
            <Text style={styles.scoreText}>
              {match.golsCasa ?? '–'} × {match.golsFora ?? '–'}
            </Text>
          )}
          <Text style={styles.dateText}>
            {dataHora.toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: '2-digit',
            })}
            {'  '}
            {dataHora.toLocaleTimeString('pt-BR', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </View>
        <TeamBlock
          nome={match.selecaoFora.nome}
          bandeira={match.selecaoFora.bandeiraUrl}
          align="right"
        />
      </View>

      {match.meuPalpite && match.status === 'FINALIZADA' && (
        <View style={styles.guessResult}>
          <Text style={styles.guessLabel}>Seu palpite: </Text>
          <Text style={styles.guessScore}>
            {match.meuPalpite.golsCasa} × {match.meuPalpite.golsFora}
          </Text>
          <PontuacaoBadge pontos={match.meuPalpite.pontuacao ?? undefined} />
        </View>
      )}

      {podePalpitar && (
        <View style={styles.guessInput}>
          <Text style={styles.guessInputLabel}>
            {match.meuPalpite ? 'Alterar palpite' : 'Registrar palpite'}
          </Text>
          <View style={styles.inputRow}>
            <GoalInput value={golsA} onChange={setGolsA} />
            <Text style={styles.inputVs}>×</Text>
            <GoalInput value={golsB} onChange={setGolsB} />
            <Pressable
              style={[styles.submitBtn, submitting && styles.submitBtnDisabled]}
              onPress={handleSubmit}
              disabled={submitting}
            >
              <Ionicons name="checkmark" size={18} color={COLORS.white} />
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}

function TeamBlock({
  nome,
  bandeira,
  align,
}: {
  nome: string;
  bandeira?: string;
  align: 'left' | 'right';
}) {
  return (
    <View style={[styles.team, align === 'right' && styles.teamRight]}>
      {bandeira ? (
        <Image source={{ uri: bandeira }} style={styles.flag} contentFit="cover" />
      ) : (
        <View style={[styles.flag, styles.flagPlaceholder]}>
          <Ionicons name="shield-outline" size={20} color={COLORS.textMuted} />
        </View>
      )}
      <Text
        style={[styles.teamName, align === 'right' && styles.teamNameRight]}
        numberOfLines={2}
      >
        {nome}
      </Text>
    </View>
  );
}

function GoalInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <TextInput
      style={styles.goalInput}
      value={value}
      onChangeText={(v) => onChange(v.replace(/\D/g, ''))}
      keyboardType="number-pad"
      maxLength={2}
      placeholder="0"
      placeholderTextColor={COLORS.textMuted}
    />
  );
}

function PontuacaoBadge({ pontos }: { pontos?: number }) {
  const color =
    pontos === 10
      ? COLORS.green
      : pontos === 5
        ? COLORS.warning
        : COLORS.textMuted;
  const label =
    pontos === 10
      ? '⭐ Placar exato!'
      : pontos === 5
        ? '✓ Vencedor'
        : '✗ Errou';
  return (
    <View style={[styles.badge, { backgroundColor: color + '22' }]}>
      <Text style={[styles.badgeText, { color }]}>
        {label} {pontos ?? 0}pts
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  meta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  metaText: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZE.xs,
    color: COLORS.textMuted,
  },
  statusBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: RADIUS.pill,
  },
  statusText: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZE.xs,
  },
  teamsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  team: {
    flex: 1,
    alignItems: 'flex-start',
    gap: SPACING.xs,
  },
  teamRight: { alignItems: 'flex-end' },
  flag: {
    width: 42,
    height: 30,
    borderRadius: 4,
  },
  flagPlaceholder: {
    backgroundColor: COLORS.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  teamName: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZE.sm,
    color: COLORS.textPrimary,
    maxWidth: 90,
  },
  teamNameRight: { textAlign: 'right' },
  scoreBlock: {
    alignItems: 'center',
    paddingHorizontal: SPACING.sm,
    gap: 2,
  },
  vsText: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.lg,
    color: COLORS.textMuted,
  },
  scoreText: {
    fontFamily: FONTS.extraBold,
    fontSize: FONT_SIZE.xl,
    color: COLORS.navy,
  },
  dateText: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZE.xs,
    color: COLORS.textMuted,
  },
  guessResult: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: SPACING.xs,
    marginTop: SPACING.sm,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  guessLabel: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZE.sm,
    color: COLORS.textMuted,
  },
  guessScore: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.sm,
    color: COLORS.textPrimary,
  },
  badge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: RADIUS.pill,
  },
  badgeText: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZE.xs,
  },
  guessInput: {
    marginTop: SPACING.sm,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  guessInputLabel: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZE.xs,
    color: COLORS.textMuted,
    marginBottom: SPACING.xs,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  goalInput: {
    flex: 1,
    height: 42,
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: RADIUS.sm,
    textAlign: 'center',
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.lg,
    color: COLORS.textPrimary,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  inputVs: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.lg,
    color: COLORS.textMuted,
  },
  submitBtn: {
    width: 42,
    height: 42,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitBtnDisabled: { opacity: 0.5 },
});
