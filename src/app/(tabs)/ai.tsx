import { FontAwesome } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { LLAMA3_2_1B, useLLM, type Message } from "react-native-executorch";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AI_SYSTEM_PROMPT } from "../../constants/ai";
import { colors } from "../../constants/theme";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const AIScreen = () => {
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<ScrollView>(null);
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const llm = useLLM({ model: LLAMA3_2_1B });
  const tabBarHeight = Platform.OS === "ios" ? 49 : 56;

  useEffect(() => {
    if (messages.length > 0) {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const handleSend = async () => {
    const question = inputText.trim();
    if (!question || loading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: question,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setError(null);
    setLoading(true);

    const chat: Message[] = [
      {
        role: "system",
        content: AI_SYSTEM_PROMPT,
      },
      { role: "user", content: question },
    ];

    try {
      await llm.generate(chat);
      const response = llm.response || "I'm sorry, I couldn't generate a response.";
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
      };
      setMessages((prev) => [...prev, assistantMessage]);
      llm.reset?.();
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to generate response. Please check your connection and try again.";
      setError(errorMessage);
      const errorUserMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `Error: ${errorMessage}`,
      };
      setMessages((prev) => [...prev, errorUserMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={tabBarHeight}
    >
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={[
          styles.messagesContent,
          { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 20 },
        ]}
        bounces={false}
      >
        {messages.length === 0 && (
          <View style={styles.emptyState}>
            <FontAwesome name="sparkles" size={48} color={colors.text.secondary} />
            <Text style={styles.emptyStateTitle}>Music Theory Assistant</Text>
            <Text style={styles.emptyStateText}>
              Ask me anything about music theory, chords, scales, and more!
            </Text>
          </View>
        )}
        {messages.map((message) => (
          <View
            key={message.id}
            style={[
              styles.messageBubble,
              message.role === "user" ? styles.userMessage : styles.assistantMessage,
            ]}
          >
            <Text
              style={[
                styles.messageText,
                message.role === "user" ? styles.userMessageText : styles.assistantMessageText,
              ]}
            >
              {message.content}
            </Text>
          </View>
        ))}
        {loading && (
          <View style={[styles.messageBubble, styles.assistantMessage]}>
            <ActivityIndicator size="small" color={colors.text.secondary} />
            <Text style={[styles.messageText, styles.assistantMessageText, styles.loadingText]}>
              Thinking...
            </Text>
          </View>
        )}
      </ScrollView>
      <View
        style={[
          styles.inputContainer,
          { paddingBottom: insets.bottom + tabBarHeight + 12, paddingTop: 12 },
        ]}
      >
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Ask a question about music theory..."
          placeholderTextColor={colors.text.secondary}
          multiline
          maxLength={500}
          editable={!loading}
          onSubmitEditing={handleSend}
          returnKeyType="send"
        />
        <Pressable
          style={[styles.sendButton, loading && styles.sendButtonDisabled]}
          onPress={handleSend}
          disabled={loading || !inputText.trim()}
        >
          {loading ? (
            <ActivityIndicator size="small" color={colors.text.primary} />
          ) : (
            <FontAwesome name="paper-plane" size={18} color={colors.text.primary} />
          )}
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    gap: 16,
  },
  emptyStateTitle: {
    color: colors.text.primary,
    fontSize: 24,
    fontWeight: "800",
  },
  emptyStateText: {
    color: colors.text.secondary,
    fontSize: 16,
    textAlign: "center",
    paddingHorizontal: 40,
  },
  messageBubble: {
    maxWidth: "85%",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    marginBottom: 4,
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: colors.primary,
  },
  assistantMessage: {
    alignSelf: "flex-start",
    backgroundColor: colors.tuner.button.background,
    borderWidth: 1,
    borderColor: colors.tuner.button.border,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userMessageText: {
    color: colors.text.primary,
    fontWeight: "500",
  },
  assistantMessageText: {
    color: colors.text.primary,
    fontWeight: "400",
  },
  loadingText: {
    color: colors.text.secondary,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 20,
    gap: 12,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.tuner.button.border,
  },
  input: {
    flex: 1,
    backgroundColor: colors.tuner.button.background,
    borderWidth: 1,
    borderColor: colors.tuner.button.border,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: colors.text.primary,
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});

export default AIScreen;
