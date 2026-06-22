import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Pressable,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Logo } from "@/components/Logo";
import { AppInput } from "@/components/AppInput";
import { AppButton } from "@/components/AppButton";
import { useAuth } from "@/contexts/AuthContext";
import { ApiError } from "@/utils/api";
import { COLORS, FONTS, FONT_SIZE, SPACING, RADIUS } from "@/constants/theme";

export default function Register() {
  const { cadastrar, loading } = useAuth();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validar() {
    const next: Record<string, string> = {};
    if (!nome.trim()) next.nome = "Informe o seu nome";
    if (!email.trim()) next.email = "Informe o seu e-mail";
    else if (!/\S+@\S+\.\S+/.test(email)) next.email = "E-mail inválido";
    if (!senha) next.senha = "Crie uma senha";
    else if (senha.length < 6) next.senha = "Mínimo de 6 caracteres";
    if (confirmarSenha !== senha) next.confirmarSenha = "As senhas não são iguais!";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function clearError(field: string) {
    setErrors((e) => ({ ...e, [field]: "", geral: "" }));
  }

  async function handleCadastrar() {
    if (!validar()) return;
    try {
      await cadastrar(nome.trim(), email.trim(), senha);
      router.replace("/(tabs)/dashboard");
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.status === 409
            ? "Esse e-mail já está cadastrado"
            : error.message
          : "Não foi possível conectar ao servidor";
      setErrors({ geral: message });
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: COLORS.backgroud }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Pressable
          style={styles.backBtn}
          onPress={() => router.back()}
          hitSlop={10}
        >
          <Ionicons name="arrow-back" size={22} color={COLORS.textPrimary} />
        </Pressable>

        <View style={styles.logoArea}>
          <Logo size="sm" />
        </View>

        <Text style={styles.title}>Faça o seu cadastro</Text>

        <View style={styles.form}>
          <AppInput
            placeholder="Digite seu Nome"
            icon="person-outline"
            value={nome}
            onChangeText={(v) => {
              setNome(v);
              clearError("nome");
            }}
            error={errors.nome}
          />

          <AppInput
            placeholder="Digite o seu email"
            icon="mail-outline"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={(v) => {
              setEmail(v);
              clearError("email");
            }}
            error={errors.email}
          />

          <AppInput
            placeholder="Digite a sua senha"
            icon="lock-closed-outline"
            isPassword
            value={senha}
            onChangeText={(v) => {
              setSenha(v);
              clearError("senha");
            }}
            error={errors.senha}
          />

          <AppInput
            placeholder="Confirme sua senha"
            icon="lock-closed-outline"
            isPassword
            value={confirmarSenha}
            onChangeText={(v) => {
              setConfirmarSenha(v);
              clearError("confirmarSenha");
            }}
            error={errors.confirmarSenha}
          />

          {!!errors.geral && (
            <Text style={styles.geralError}>{errors.geral}</Text>
          )}

          <View style={styles.submitArea}>
            <AppButton
              title="Cadastrar"
              variant="primary"
              onPress={handleCadastrar}
              loading={loading}
            />
          </View>
        </View>

        <Pressable style={styles.loginLink} onPress={() => router.back()}>
          <Text style={styles.loginText}>
            Já tem uma conta?{" "}
            <Text style={styles.loginTextBold}>Fazer Login</Text>
          </Text>
        </Pressable>
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
    marginBottom: SPACING.xl,
  },
  form: {
    width: "100%",
  },
  geralError: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZE.sm,
    color: COLORS.danger,
    backgroundColor: COLORS.dangerBg,
    padding: SPACING.sm,
    borderRadius: RADIUS.sm,
    marginBottom: SPACING.sm,
    textAlign: "center",
  },
  submitArea: {
    marginTop: SPACING.lg,
  },
  loginLink: {
    marginTop: SPACING.xl,
    alignItems: "center",
  },
  loginText: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
  },
  loginTextBold: {
    fontFamily: FONTS.bold,
    color: COLORS.green,
  },
});
