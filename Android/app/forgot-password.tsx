import { useState } from "react";
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Pressable,} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Logo } from "@/components/Logo";
import { AppInput } from "@/components/AppInput";
import { AppButton } from "@/components/AppButton";
import { AuthService } from "@/utils/services";
import { COLORS, FONTS, FONT_SIZE, SPACING } from "@/constants/theme";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [erro, setErro] = useState("");

  async function handleEnviar() {
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setErro("Informe um e-mail válido");
      return;
    }
    setErro("");
    setLoading(true);
    try {
      // POST /api/auth/forgot-password  ← corrigido
      await AuthService.recuperarSenha(email.trim());
      setEnviado(true);
    } catch {
      setErro("Não foi possível enviar o e-mail. Verifique e tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: COLORS.backgroud }}  // ← typo "backgroud" corrigido
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Pressable style={styles.backBtn} onPress={() => router.back()} hitSlop={10}>
          <Ionicons name="arrow-back" size={22} color={COLORS.textPrimary} />
        </Pressable>

        <View style={styles.logoArea}>
          <Logo size="sm" />
        </View>

        <Text style={styles.title}>Recuperar senha</Text>

        {enviado ? (
          <View style={styles.successBox}>
            <Ionicons name="mail-outline" size={48} color={COLORS.green} />
            <Text style={styles.successTitle}>E-mail enviado!</Text>
            <Text style={styles.successText}>
              Verifique sua caixa de entrada e siga as instruções para redefinir
              sua senha.
            </Text>
            <View style={{ marginTop: SPACING.xl }}>
              <AppButton
                title="Voltar ao login"
                variant="primary"
                onPress={() => router.replace("/login")}
              />
            </View>
          </View>
        ) : (
          <>
            <Text style={styles.description}>
              Digite o e-mail cadastrado e enviaremos um link para você redefinir
              sua senha.
            </Text>

            <AppInput
              placeholder="Digite o seu e-mail"
              icon="mail-outline"
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={(v) => {
                setEmail(v);
                setErro("");
              }}
              error={erro}
            />

            <AppButton
              title="Enviar link de recuperação"
              variant="primary"
              onPress={handleEnviar}
              loading={loading}
            />

            <Pressable style={styles.backLink} onPress={() => router.back()}>
              <Text style={styles.backLinkText}>Voltar ao login</Text>
            </Pressable>
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: SPACING.xl,
    paddingTop: 24,
    paddingBottom: SPACING.xl,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.surface,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.md,
  },
  logoArea: {
    alignItems: "center",
    marginBottom: SPACING.lg,
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.lg,
    color: COLORS.textPrimary,
    textAlign: "center",
    marginBottom: SPACING.md,
  },
  description: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginBottom: SPACING.xl,
    lineHeight: 20,
  },
  backLink: {
    marginTop: SPACING.xl,
    alignItems: "center",
  },
  backLinkText: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZE.sm,
    color: COLORS.green,
  },
  successBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: SPACING.xxl,
    gap: SPACING.md,
  },
  successTitle: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.xl,
    color: COLORS.textPrimary,
  },
  successText: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: 20,
  },
});
