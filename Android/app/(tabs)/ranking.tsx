import { useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { RankingRow } from "@/components/RankingRow";
import { LoadingState, ErrorState, EmptyState } from "@/components/States";
import { RankingService } from "@/utils/services";
import { useAuth } from "@/contexts/AuthContext";
import {
  COLORS,
  FONTS,
  FONT_SIZE,
  SPACING,
  RADIUS,
  GRADIENTS,
  SHADOW,
} from "@/constants/theme";

const PAGE_SIZE = 50;

export default function Ranking() {
  const { user } = useAuth();
  const [page, setPage] = useState(0);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["ranking", page],
    queryFn: () => RankingService.geral(page, PAGE_SIZE),
  });

  const { data: minhaPosicao } = useQuery({
    queryKey: ["ranking-me"],
    queryFn: RankingService.minhaPosicao,
  });

  const itensComDestaque =
    data?.content.map((item) => ({
      ...item,
      souEu: item.usuarioId === user?.id,
    })) ?? [];

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Ranking geral</Text>
        <Text style={styles.subtitle}>Quem está na ponta da tabela?</Text>
      </View>

      {minhaPosicao && (
        <LinearGradient
          colors={GRADIENTS.hero}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.myCard, SHADOW.md]}
        >
          <View style={styles.myCardLeft}>
            <View style={styles.myPositionCircle}>
              <Text style={styles.myPositionText}>{minhaPosicao.posicao}º</Text>
            </View>
            <View>
              <Text style={styles.myLabel}>Sua posição</Text>
              <Text style={styles.myName}>{minhaPosicao.nome}</Text>
            </View>
          </View>
          <View style={styles.myPointsRow}>
            <Ionicons name="trophy" size={14} color={COLORS.gold} />
            <Text style={styles.myPoints}>
              {minhaPosicao.pontuacaoTotal} pts
            </Text>
          </View>
        </LinearGradient>
      )}

      {isLoading ? (
        <LoadingState label="Carregando ranking..." />
      ) : isError ? (
        <ErrorState
          subtitle="Não conseguimos carregar o ranking."
          onRetry={refetch}
        />
      ) : itensComDestaque.length === 0 ? (
        <EmptyState
          icon="trophy-outline"
          title="Ranking ainda vazio"
          subtitle="Os pontos aparecem aqui assim que as partidas forem encerradas."
        />
      ) : (
        <FlatList
          data={itensComDestaque}
          keyExtractor={(item) => String(item.usuarioId)}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => <RankingRow item={item} />}
          ListFooterComponent={
            data && data.totalPages > 1 ? (
              <View style={styles.pagination}>
                <Text
                  style={[
                    styles.pageBtn,
                    page === 0 && styles.pageBtnDisabled,
                  ]}
                  onPress={() => page > 0 && setPage(page - 1)}
                >
                  ← Anterior
                </Text>
                <Text style={styles.pageInfo}>
                  Página {page + 1} de {data.totalPages}
                </Text>
                <Text
                  style={[
                    styles.pageBtn,
                    page >= data.totalPages - 1 && styles.pageBtnDisabled,
                  ]}
                  onPress={() =>
                    page < data.totalPages - 1 && setPage(page + 1)
                  }
                >
                  Próxima →
                </Text>
              </View>
            ) : null
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.backgroud,
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
  myCard: {
    marginHorizontal: SPACING.xl,
    marginBottom: SPACING.lg,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  myCardLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.md,
    flex: 1,
  },
  myPositionCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  myPositionText: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.md,
    color: COLORS.white,
  },
  myLabel: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZE.xs,
    color: COLORS.textonDarkMuted,
  },
  myName: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZE.md,
    color: COLORS.white,
  },
  myPointsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  myPoints: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.md,
    color: COLORS.white,
  },
  listContent: {
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.xxl,
  },
  pagination: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: SPACING.lg,
  },
  pageBtn: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZE.sm,
    color: COLORS.green,
  },
  pageBtnDisabled: {
    color: COLORS.textMuted,
  },
  pageInfo: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZE.xs,
    color: COLORS.textMuted,
  },
});
