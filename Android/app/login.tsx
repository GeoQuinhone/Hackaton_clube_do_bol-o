import { View, Text, TextInput, Button } from "react-native";
import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  return (
    <View style={{ padding: 20 }}>
      <Text>Login</Text>

      <TextInput
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        placeholder="Senha"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />

      <Button title="Entrar" onPress={() => {}} />
    </View>
  );
}