import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { FlatList, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../constants/theme";

export type OptionsModalOption = { label: string; value: string };

type OptionsModalProps = {
  onClose: () => void;
  onSelect: (value: string) => void;
  options: ReadonlyArray<OptionsModalOption>;
  selectedValue: string;
  visible: boolean;
};

export const OptionsModal = ({
  onClose,
  onSelect,
  options,
  selectedValue,
  visible,
}: OptionsModalProps) => {
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      transparent={false}
      animationType="slide"
      statusBarTranslucent
      navigationBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View
          style={[
            styles.modalCard,
            {
              paddingTop: Math.max(insets.top, 12),
              paddingBottom: Math.max(insets.bottom, 12),
            },
          ]}
        >
          <Pressable style={styles.modalCloseButton} onPress={onClose} hitSlop={10}>
            <FontAwesome name="close" size={18} color={colors.text.secondary} />
          </Pressable>
          <FlatList
            data={options}
            keyExtractor={(item) => item.value}
            renderItem={({ item }) => (
              <Pressable
                style={[styles.optionRow, item.value === selectedValue && styles.optionRowSelected]}
                onPress={() => onSelect(item.value)}
              >
                <Text style={styles.optionText}>{item.label}</Text>
              </Pressable>
            )}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: colors.background },
  modalCard: { flex: 1, backgroundColor: colors.background, paddingHorizontal: 12 },
  modalCloseButton: { alignSelf: "flex-end", padding: 8, marginBottom: 6 },
  optionRow: { paddingVertical: 14, paddingHorizontal: 12, borderRadius: 12 },
  optionRowSelected: {
    backgroundColor: colors.tuner.button.background,
    borderWidth: 1,
    borderColor: colors.tuner.button.border,
  },
  optionText: { color: colors.text.primary, fontSize: 24, fontWeight: "500" },
});


