import { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated, Easing } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Logo } from "./../components/Logo";
import { useAuth } from "./../contexts/AuthContext";
import { COLORS, FONTS, FONT_SIZE, SPACING, GRADIENTS } from "@/constants/theme";


export default function Loading() {
  const { user, bootstrapping } = useAuth();
  const fade = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0)).current;

  // efeito para o texto aparecer suavemente
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    if (bootstrapping) return;

    const timer = setTimeout(() => {
      if (user) {
        router.replace("/(tabs)/dashboard");
      } else {
        router.replace("/login");
      }
    }, 1100);
    return () => clearTimeout(timer);
  }, [bootstrapping, user]);

  return (
    <LinearGradient colors={GRADIENTS.hero} style={styles.container}>
      <Animated.View style={{ opacity: fade, transform: [{ scale }] }}>
        <Logo size="lg" />
      </Animated.View>
      <View style={styles.footer}>
        <Text style={styles.footerLabel}>Desenvolvido pela equipe</Text>
        <Text style={styles.footerTeam}>Tricode Systems</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  footer: {
    position: "absolute",
    bottom: 56,
    alignItems: "center",
  },
  footerLabel: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZE.sm,
    color: COLORS.textonDarkMuted,
  },
  footerTeam: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.md,
    color: COLORS.textOnDark,
    marginTop: SPACING.xs,
    letterSpacing: 0.5
  },
});