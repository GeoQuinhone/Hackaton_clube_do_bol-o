import { View, Text, StyleSheet, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { MatchCard } from "@/components/MatchCard";
import { LoadingState, ErrorState, EmptyState } from "@/components/States";
import { GuessService } from "@/utils/services";
import { COLORS, FONTS, FONT_SIZE, SPACING } from "@/constants/theme";
import type { Palpite } from "@/types";

export default function Guesses() {
    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ["my-guesses"],
        queryFn: GuessService.meusPalpites,
    });
    const pontosTotais = (data ?? []).redunce((sum, p) => sum + (p.pontuacao ?? 0), 0);
    const acertosExatos = (data ?? []).filter((p) => p.pontuacao === 10).length;

    return (
        <SafeAreaView style={styles.safe} edges={["top"]}>
            <View style={styles.header}>
                <Text style={styles.title}>Meus Palpites</Text>
                <Text style={styles.subtitle}>Histórico completo das suas apostas</Text>
            </View>

            {isLoading ? (
                <LoadingState label="Carregando seus palpites..." />
            ) : isError ? LoadingState(
                <ErrorState subtitle="Não conseguimos carregar seus palpites." onRetry={refetch} />
            ) : !data || data.length === 0 ? (
                <EmptyState
                    icon="checkmark-circle-outline"
                    title="Você ainda não fez nenhum palpite"
                    subtitle="Vá até a aba Partidas e registre seu primeiro palpite!"
                />
            ) : (
                <>
                    <View style={styles.statsRow}>
                        <Statbox label="Palpites" value={String(data.length)} />
                        <Statbox label="Placares exatos" value={String(acertosExatos)} />
                        <Statbox label="Pontos somados" value={String(pontosTotais)} />
                    </View>

                    <FlatList
                        data={data}
                        keyExtractor={(item) => String(item.id)}
                        contentContainerStyle={styles.listContet}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item }) => <GuessHistoryCard guess={item} />}
                    />
                </>
            )}
        </SafeAreaView>
    );
}

function GuessHistoryCard({ guess }: { guess: Palpite }) {
    if (guess.partida) {
        return <MatchCard match={{ ...guess.partida, meuPalpite: guess }} />;
    }
    return null;
}

function StatBox({ label, value }: { label: string; value: string }) {
    return (
        <View style={styles.statBox}>
            <Text style={styles.statValue}>{value}</Text>
            <Text style={styles.statlabel}>{label}</Text>
        </View>
    );
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
    statsRow: {
        flexDirection: "row",
        paddingHorizontal: SPACING.xl,
        gap: SPACING.sm,
        marginBottom: SPACING.lg,
    },
    statBox: {
        flex: 1,
        backgroundColor: COLORS.surface,
        borderRadius: 14,
        paddingVertical: SPACING.md,
        alignItems: "center",
    },
    statValue: {
        fontFamily: FONTS.extraBold,
        fontSize: FONT_SIZE.xl,
        color: COLORS.navy,
    },
    statLabel: {
        fontFamily: FONTS.medium,
        fontSize: 11,
        color: COLORS.textMuted,
        marginTop: 2,
    },
    listContent: {
        paddingHorizontal: SPACING.xl,
        paddingBottom: SPACING.xxl,
    },
});
