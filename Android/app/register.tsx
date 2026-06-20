import { View, Text, TextInput, Button } from "react-native";
import { useState } from "react";

export default function Register() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  return (
    <View style={{ padding: 20 }}>
      <Text>Cadastro</Text>

      <TextInput
        placeholder="Nome"
        value={nome}
        onChangeText={setNome}
      />

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

      <Button title="Cadastrar" onPress={() => {}} />
    </View>
  );
}