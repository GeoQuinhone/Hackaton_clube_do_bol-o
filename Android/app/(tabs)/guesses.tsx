import { View, Text, StyleSheet, ScrollView, RefreshControl, Alert } from "react-native";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { MatchCard } from "@/components/MatchCard";
import { LoadingState, ErrorState, EmptyState } from "@/components/States";
import { GuessService } from "@/utils/services";
import { COLORS, FONTS, FONT_SIZE, SPACING } from "@/constants/theme";

export default function Guesses() {
  const queryClient = useQueryClient();

  const { data: palpites, isLoading, isError, refetch, isRefetching } = useQuery({
    queryKey: ["meusPalpites"],
    queryFn: GuessService.meusPalpites,
  });

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  const editMutation = useMutation({
    mutationFn: ({ palpiteId, gm, gv }: { palpiteId: number; gm: number; gv: number }) =>
      GuessService.editar(palpiteId, gm, gv),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meusPalpites"] });
      Alert.alert("✅ Palpite atualizado!", "Seu palpite foi alterado com sucesso.");
    },
    onError: () => {
      Alert.alert("Erro", "Não foi possível atualizar seu palpite.");
    },
  });

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={COLORS.navy} />
        }
      >
        <Text style={styles.title}>Meus Palpites</Text>
        <Text style={styles.subtitle}>Acompanhe seus palpites e pontuações</Text>

        {isLoading ? (
          <LoadingState label="Carregando seus palpites..." />
        ) : isError ? (
          <ErrorState subtitle="Não conseguimos carregar seus palpites." onRetry={refetch} />
        ) : !palpites?.length ? (
          <EmptyState
            icon="checkmark-circle-outline"
            title="Nenhum palpite ainda"
            subtitle="Acesse a aba Partidas e registre seus palpites!"
          />
        ) : (
          palpites.map((palpite) =>
            palpite.partida ? (
              <MatchCard
                key={palpite.id}
                match={{
                  ...palpite.partida,
                  meuPalpite: {
                    id: palpite.id,
                    usuarioId: palpite.usuarioId,
                    partidaId: palpite.partidaId,
                    golsCasa: palpite.golsCasa,
                    golsFora: palpite.golsFora,
                    pontuacao: palpite.pontuacao,
                  },
                }}
                onSubmitGuess={
                  palpite.partida.status === "AGENDADA"
                    ? (gm, gv) => editMutation.mutate({ palpiteId: palpite.id, gm, gv })
                    : undefined
                }
              />
            ) : null
          )
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
    paddingBottom: 100,
  },
  title: {
    fontFamily: FONTS.extraBold,
    fontSize: FONT_SIZE.xxl,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg,
  },
});
