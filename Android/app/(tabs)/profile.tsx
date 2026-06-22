import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { AppButton } from "@/components/AppButton";
import { AppInput } from "@/components/AppInput";
import { Card } from "@/components/Card";
import { useAuth } from "@/contexts/AuthContext";
import { UserService } from "@/utils/services";
import {
  COLORS,
  FONTS,
  FONT_SIZE,
  SPACING,
  RADIUS,
  SHADOW,
} from "@/constants/theme";

export default function Profile() {
  const { user, logout } = useAuth();
  const [editando, setEditando] = useState(false);
  const [nome, setNome] = useState(user?.nome ?? "");
  const [salvando, setSalvando] = useState(false);

  async function handleSalvar() {
    if (!nome.trim()) return;
    setSalvando(true);
    try {
      await UserService.atualizarPerfil({ nome: nome.trim() });
      setEditando(false);
    } catch {
      Alert.alert("Erro", "Não foi possível atualizar seu perfil. Tente novamente!");
    } finally {
      setSalvando(false);
    }
  }

  function handleLogout() {
    Alert.alert(
      "Sair da conta",
      "Tem certeza que deseja encerrar sua sessão?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sair",
          style: "destructive",
          onPress: async () => {
            await logout();
            router.replace("/login");
          },
        },
      ],
    );
  }

  function handleExcluirConta() {
    Alert.alert(
      "Excluir conta",
      "Essa ação é permanente e remove todos os seus dados. Deseja continuar?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir conta",
          style: "destructive",
          onPress: async () => {
            try {
              await UserService.excluirConta();
              await logout();
              router.replace("/login");
            } catch {
              Alert.alert("Erro", "Não foi possível excluir sua conta agora.");
            }
          },
        },
      ],
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Meu Perfil</Text>

        <View style={styles.avatarSection}>
          {user?.fotoPerfil ? (
            <Image
              source={{ uri: user.fotoPerfil }}
              style={styles.avatar}
              contentFit="cover"
            />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder, SHADOW.md]}>
              <Text style={styles.avatarInitial}>
                {(user?.nome ?? "?").charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
          <Pressable style={styles.editAvatarBtn}>
            <Ionicons name="camera-outline" size={14} color={COLORS.white} />
          </Pressable>
        </View>

        <Card style={styles.infoCard}>
          {editando ? (
            <>
              <AppInput
                label="Nome de exibição"
                value={nome}
                onChangeText={setNome}
                icon="person-outline"
              />
              <View style={styles.editActions}>
                <View style={{ flex: 1 }}>
                  <AppButton
                    title="Cancelar"
                    variant="outline"
                    onPress={() => {
                      setNome(user?.nome ?? "");
                      setEditando(false);
                    }}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <AppButton
                    title="Salvar"
                    variant="primary"
                    onPress={handleSalvar}
                    loading={salvando}
                  />
                </View>
              </View>
            </>
          ) : (
            <>
              <InfoRow
                icon="person-outline"
                label="Nome"
                value={user?.nome ?? "—"}
              />
              <InfoRow
                icon="mail-outline"
                label="E-mail"
                value={user?.email ?? "—"}
              />
              <InfoRow
                icon="trophy-outline"
                label="Pontuação total"
                value={`${user?.pontuacaoTotal ?? 0} pts`}
              />
              <InfoRow
                icon="checkmark-done-outline"
                label="Placares exatos"
                value={String(user?.placaresExatos ?? 0)}
              />
              <View style={styles.editBtnArea}>
                <AppButton
                  title="Editar perfil"
                  variant="outline"
                  onPress={() => setEditando(true)}
                />
              </View>
            </>
          )}
        </Card>

        <View style={styles.dangerZone}>
          <AppButton title="Sair da conta" variant="ghost" onPress={handleLogout} />
          <Pressable onPress={handleExcluirConta} style={styles.deleteLink}>
            <Text style={styles.deleteLinkText}>Excluir minha conta</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoIcon}>
        <Ionicons name={icon} size={16} color={COLORS.navy} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
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
  title: {
    fontFamily: FONTS.extraBold,
    fontSize: FONT_SIZE.xxl,
    color: COLORS.textPrimary,
    marginBottom: SPACING.lg,
  },
  avatarSection: {
    alignItems: "center",
    marginBottom: SPACING.xl,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: COLORS.surfaceAlt,
  },
  avatarPlaceholder: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: COLORS.green,
  },
  avatarInitial: {
    fontFamily: FONTS.extraBold,
    fontSize: 34,
    color: COLORS.navy,
  },
  editAvatarBtn: {
    position: "absolute",
    bottom: 0,
    right: "36%",
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.green,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: COLORS.backgroud,
  },
  infoCard: {
    marginBottom: SPACING.xl,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  infoIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.surfaceAlt,
    alignItems: "center",
    justifyContent: "center",
  },
  infoLabel: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZE.xs,
    color: COLORS.textMuted,
  },
  infoValue: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZE.md,
    color: COLORS.textPrimary,
    marginTop: 1,
  },
  editBtnArea: {
    marginTop: SPACING.md,
  },
  editActions: {
    flexDirection: "row",
    gap: SPACING.md,
    marginTop: SPACING.xs,
  },
  dangerZone: {
    alignItems: "center",
    gap: SPACING.md,
  },
  deleteLink: {
    padding: SPACING.sm,
  },
  deleteLinkText: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZE.sm,
    color: COLORS.danger,
  },
});
