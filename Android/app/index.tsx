import { View, Text, Button } from "react-native";
import { router } from "expo-router";

export default function Home() {
  return (
    <View style={{ padding: 20 }}>
      <Text>Bolão Copa 2026</Text>

      <Button
        title="Login"
        onPress={() => router.push("/login")}
      />

      <Button
        title="Cadastro"
        onPress={() => router.push("/register")}
      />

      <Button
        title="Jogos"
        onPress={() => router.push("/matches")}
      />

      <Button
        title="Ranking"
        onPress={() => router.push("/ranking")}
      />
    </View>
  );
}