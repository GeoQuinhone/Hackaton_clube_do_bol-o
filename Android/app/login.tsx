import { useState } from "react";
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Pressable, } from "react-native";
import { Router } from "expo-router";
import { Logo } from "./../components/Logo";
import { AppInput } from "./../components/AppInput";
import { useAuth } from "./../contexts/AuthContext";
import { ApiError } from "./../utils/api";
import { COLORS, FONTS, FONT_SIZE, SPACING, RADIUS } from "./../constants/theme";


export default function Login() {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [errors, setErrors] = useState<{ email?: String; senha?: String; geral?: string }>({});

  function validar() {
    const next: typeof errors = {};
    if (!email.trim()) next.email = "Informe o seu e-mail";
    else if (!/\S+@\S+\.\S+/.test(email)) next.email = "E-mail inválido";
    if (!senha) next.senha = "Informe a sua senha";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleEntrar() {
    if (!validar()) return;
    try {
      await login(email.trim(), senha);
      router.replace("/(tabs)/dashboard");
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.status === 401 || error.status === 422
            ? "E-mail ou senha incorretos"
            : error.message
          : "Não foi possível conectar ao servidor";
      setErrors({ geral: message })
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
        showsHorizontalScrollIndicator={false}
      >
        <View style={styles.logoArea}>
          <Logo size="md" />
        </View>

        <Text style={style.title}>Login</Text>
        <View style={styles.form}>
          <AppInput
            placeholder="Digite o seu Email"
            icon="mail-outline"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={(v) => {
              setEmail(v);
              setErrors((e) => ({ ...e, email: undefined, geral: undefined }));
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
              setErrors((e) => ({ ...e, senha: undefined, geral: undefined }));
            }}
            error={errors.senha}
          />

          {!!errors.geral && <Text style={styles.geralError}>{errors.geral</Text>};

          <View style={styles.actionsRow}>
            <View style={{ flex: 1 }}>
              <AppButton tittle="Esqueci minha senha" variant "danger" onPress={() => { }}/>
            </View>
            <View style={{ flex: 1 }}>
              <AppButton title="Entrar" variant="primary" onPress={handleEntrar} Loading={loading} />
            </View>
          </View>
        </View>

        <Pressable style={styles.registerLink} onPress={() => router.push("/register")}>
          <Text style={styles.registertext}>
            Não tem uma conta? <Text style={styles.registerTextBold}>Cadastrar-se</Text>
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
    paddingTop: 64,
    paddingBottom: SPACING.xl,
  },
  logoArea: {
    alignItems: "center",
    marginBottom: SPACING.xl,
  }
  title: {
    fontFamily: FONTS.extraBold,
    fontSize: FONT_SIZE.xxl,
    color: COLORS.textPrimary,
    textAlign: "center",
    marginBottom: SPACING.xl,
  },
  form: {
    width: "100%",
  },
  actionsRow: {
    flexDirection: "row",
    gap: SPACING.md,
    marginTop: SPACING.xs
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
  registerLink: {
    marginTop: SPACING.xxl,
    alignItems: "center",
  },
  registerTextBold: {
    fontFamily: FONTS.bold,
    color: COLORS.green,
  },
});