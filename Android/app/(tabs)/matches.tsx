import { useMemo, useState } from "react";
import { View, Text, StyleSheet, FlatList, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery, useQueryClient, useMutation, useQueryClient, QueryCache } from "@tanstack/react-query";
import { MatchCard } from "@/components/MatchCard";
import { LoadingState, ErrorState, EmptyState } from "@/components/States";
import { MatchService, GuessService } from "@/utils/services";
import { COLORS, FONTS, FONT_SIZE, SPACING, RADIUS, PHASE_LABEL } from "@/constants/theme";
import type { Fase, Partida } from "@/types";

const FASES: { key: Fase | "TODAS"; label: string }[] = [
    { key: "TODAS", label: "Todas" },
    { key: "GRUPOS", label: PHASE_LABEL.GRUPOS },
    { key: "OITAVAS", label: PHASE_LABEL.OITAVAS },
    { key: "QUARTAS", label: PHASE_LABEL.QUARTAS },
    { key: "SEMI", label: PHASE_LABEL.SEMI },
    { key: "FINAL", label: PHASE_LABEL.FINAL },
];

export default function Matches() {
    const [faseAtiva, setFaseAtiva] = useState<Fase | "TODAS">("TODAS");
    const queryClient = useQueryClient();

    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ["matches"],
        queryFn: () => MatchService.listar(),
    });

    const guessMutation = useMutation({
        mutationFn: ({ partidaId, gm, gv }: { partidaId: number; gm: number; gv: number })
    GuessService.registrar(partidaId, gm, gv),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["matches"] });
            queryClient.invalidateQueries({ queryKey: ["dashboard"] });
        }
});

const filtradas = useMemo(() => {
    if (!data) return [];
    if (faseAtiva === "TODAS") return data;
    return data.filter((m) => m.fase === faseAtiva);
}, [data, faseAtiva]);

const agrupadas = useMemo(() => groupByDate(filtradas), [filtradas]);

return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
        <View style={styles.header}>
            <Text style={styles.title}>Partidas</Text>
            <Text style={styles.subtitle}>Acompanhe e registre seus palpites</Text>
        </View>

        <View style={styles.filterBar}>
            <FlatList
                data={FASES}
                horizontal
                keyExtractor={(item) => item.key}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: SPACING.xl, gap: SPACING.sm }}
                renderItem={({ item }) => (
                    <Pressable
                        onPress={() => setFaseAtiva(item.key)}
                        style={[styles.chip, faseAtiva === item.key && styles.chipActive]}
                    >
                        <Text style={[styles.chipText, faseAtiva === item.key && styles.chipTextActive]}>
                            {item.label}
                        </Text>
                    </Pressable>
                )}
            />
        </View>
        {isLoading ? (
            <LoadingState label="Carregando partidas..." />
        ) : isError ? (
            <ErrorState subtitle="Não conseguimos carregar as partidas." onRetry={refetch} />
        ) : filtradas.length === 0 ? (
            <EmptyState
                icon="football-outline"
                title="Nenhuma partida nesta fase"
                subtitle="Tente selecionar outro filtro."
            />
        ) : (
            <FlatList
                data={agrupadas}
                keyExtractor={(item) => item.date}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                    <View>
                        <Text style={styles.dateGroupLabel}>{item.label}</Text>
                        {item.matches.map((match) => (
                            <MatchCard
                                key={match.id}
                                match={match}
                                onSubmitGuess={(gm, gv) =>
                                    guessMutation.mutateAsync({ partidaId: match.id, gm, gv })
                                }
                            />
                        ))}
                    </View>
                )}
            />
        )}
    </SafeAreaView>
);
}

function groupByDate(matches: Partida[]) {
    const groups = new Map<string, Partida[]>();
    const sorted = [...matches].sort(
        (a, b) => new Date(a.dataHora).getTime() - new Date(b.dataHora).getTime()
    );

    for (const match of sorted) {
        const key = new Date(match.dataHora).toDateString();
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key)!.push(match);
    }

    return Array.from(groups.entries()).map(([date, matches]) => ({
        date,
        label: new Date(date).toLocaleDateString("pt-BR", {
            weekday: "long",
            day: "2-digit",
            month: "long",
        }),
        matches,
    }));
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        paddingHorizontal: SPACING.xl,
        paddingTop: SPACING.lg,
        marginBottom: SPACING.md,
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
    filterBar: {
        marginBottom: SPACING.md,
    },
    chip: {
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.sm,
        borderRadius: RADIUS.pill,
        backgroundColor: COLORS.surface,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    chipActive: {
        backgroundColor: COLORS.navy,
        borderColor: COLORS.navy,
    },
    chipText: {
        fontFamily: FONTS.semiBold,
        fontSize: FONT_SIZE.sm,
        color: COLORS.textSecondary,
    },
    chipTextActive: {
        color: COLORS.white,
    },
    listContent: {
        paddingHorizontal: SPACING.xl,
        paddingBottom: SPACING.xxl,
    },
    dateGroupLabel: {
        fontFamily: FONTS.semiBold,
        fontSize: FONT_SIZE.sm,
        color: COLORS.textMuted,
        textTransform: "capitalize",
        marginBottom: SPACING.sm,
        marginTop: SPACING.sm,
    },
});
