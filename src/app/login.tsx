import { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  function handleLogin() {
    if (!email.trim() || !password) {
      setMessage("Completează emailul și parola.");
      return;
    }

    setMessage(
      "Formular completat! Urmează să conectăm autentificarea."
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <Text style={styles.logo}>ExpenseTrack</Text>
          <Text style={styles.title}>Bine ai revenit!</Text>
          <Text style={styles.subtitle}>
            Cheltuielile tale, într-un singur loc.
          </Text>

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="exemplu@email.com"
            placeholderTextColor="#8A91A1"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="email"
            value={email}
            onChangeText={setEmail}
          />

          <Text style={styles.label}>Parolă</Text>
          <TextInput
            style={styles.input}
            placeholder="Introdu parola"
            placeholderTextColor="#8A91A1"
            secureTextEntry
            autoCapitalize="none"
            autoComplete="current-password"
            value={password}
            onChangeText={setPassword}
            onSubmitEditing={handleLogin}
          />

          <Pressable
            accessibilityRole="button"
            onPress={handleLogin}
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed,
            ]}
          >
            <Text style={styles.buttonText}>Autentificare</Text>
          </Pressable>

          <Text accessibilityLiveRegion="polite" style={styles.message}>
            {message}
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F0F3FF",
  },
  content: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
  },
  card: {
    width: "100%",
    maxWidth: 420,
    alignSelf: "center",
    backgroundColor: "#FFFFFF",
    padding: 24,
    borderRadius: 24,
  },
  logo: {
    fontSize: 28,
    fontWeight: "800",
    color: "#6155F5",
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#18213A",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: "#737B8E",
    marginBottom: 28,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#18213A",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#F7F8FC",
    borderWidth: 1,
    borderColor: "#E2E5EF",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#18213A",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#6155F5",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 4,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  message: {
    color: "#555D73",
    marginTop: 16,
    textAlign: "center",
  },
});