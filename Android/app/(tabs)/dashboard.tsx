import { View, StyleSheet, ScrollView, RefreshControl, Alert } from "react-native";
import { router } from "expo-router";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "expo-router";
import { useCallback } from "react";

import { ScreenHeader } from "@/components/ScreenHeader";
import { SectionTitle } from "@/components/Card";
import { MatchCard } from "@/components/MatchCard";
import { RankingRow } from "@/components/RankingRow";
import { LoadingState, ErrorState, EmptyState } from "@/components/States";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardService, GuessService } from "@/utils/services";
import { COLORS, FONTS, FONT_SIZE, SPACING, RADIUS } from "@/constants/theme";

// ⚠️ se você usa PointsHero, mantenha o import correto
import { PointsHero } from "@/components/PointsHero";

export default function Dashboard() {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const { data, isLoading, isError, refetch, isRefetching } = useQuery({
        queryKey: ["dashboard"],
        queryFn: DashboardService.resumo,
    });

    const guessMutation = useMutation({
        mutationFn: ({
            partidaId,
            gm,
            gv,
        }: {
            partidaId: number;
            gm: number;
            gv: number;
        }) => GuessService.registrar(partidaId, gm, gv),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["dashboard"] });
            queryClient.invalidateQueries({ queryKey: ["meusPalpites"] });
            Alert.alert("🎉 Palpite confirmado!", "Seu palpite foi registrado com sucesso. Boa sorte!");
        },
        onError: () => {
            Alert.alert("Erro", "Não foi possível registrar seu palpite. Tente novamente.");
        },
    });

    const firstName = user?.name?.split(" ")[0] ?? "";

    useFocusEffect(
        useCallback(() => {
            refetch();
        }, [refetch])
    );

    return (
        <SafeAreaView style={styles.safe} edges={["top"]}>
            <ScrollView
                contentContainerStyle={styles.container}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefetching}
                        onRefresh={refetch}
                        tintColor={COLORS.navy}
                    />
                }
            >
                <ScreenHeader
                    title={`Olá, ${firstName}`}
                    subtitle="Vamos palpitar?"
                    user={user}
                />

                {isLoading ? (
                    <LoadingState label="Carregando seu painel..." />
                ) : isError ? (
                    <ErrorState
                        subtitle="Não conseguimos carregar seus dados."
                        onRetry={refetch}
                    />
                ) : (
                    <>
                        <PointsHero
                            pontos={data?.meusPontos ?? 0}
                            posicao={data?.minhaPosicao ?? 0}
                            totalPalpites={data?.totalPalpites ?? 0}
                        />

                        {/* Próximas partidas */}
                        <View style={styles.section}>
                            <SectionTitle
                                title="Próximas partidas"
                                action={{
                                    label: "Ver todas",
                                    onPress: () => router.push("/(tabs)/matches"),
                                }}
                            />

                            {data?.proximasPartidas?.length ? (
                                data.proximasPartidas.slice(0, 3).map((match) => (
                                    <MatchCard
                                        key={match.id}
                                        match={match}
                                        compact
                                        onSubmitGuess={(gm, gv) =>
                                            guessMutation.mutate({
                                                partidaId: match.id,
                                                gm,
                                                gv,
                                            })
                                        }
                                    />
                                ))
                            ) : (
                                <EmptyState
                                    icon="calendar-outline"
                                    title="Nenhuma partida agendada"
                                    subtitle="Assim que o admin cadastrar novos jogos, eles aparecem aqui."
                                />
                            )}
                        </View>

                        {/* Ranking */}
                        <View style={styles.section}>
                            <SectionTitle
                                title="Top do ranking"
                                action={{
                                    label: "Ver ranking",
                                    onPress: () => router.push("/(tabs)/ranking"),
                                }}
                            />

                            {data?.topRanking?.length ? (
                                data.topRanking.slice(0, 5).map((item) => (
                                    <RankingRow
                                        key={item.usuarioId}
                                        item={item}
                                    />
                                ))
                            ) : (
                                <EmptyState
                                    icon="trophy-outline"
                                    title="Ranking ainda vazio"
                                    subtitle="Registre seu primeiro palpite para entrar na disputa."
                                />
                            )}
                        </View>
                    </>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: COLORS.backgroud,
    },
    container: {
        paddingHorizontal: SPACING.xl,
        paddingTop: SPACING.lg,
        paddingBottom: SPACING.xxl,
    },
    section: {
        marginBottom: SPACING.xl,
    },
});