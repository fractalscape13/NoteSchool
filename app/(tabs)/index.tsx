import { FontAwesome } from "@expo/vector-icons";
import React, { useEffect, useMemo, useState } from "react";
import { FlatList, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { storage, STORAGE_KEYS } from "../../src/constants/storage";
import { colors } from "../../src/constants/theme";
import { getDiatonicTriads, Mode } from "../../src/utils/chords";

type SelectorOption<TValue extends string> = { label: string; value: TValue };
const keyOptions = [
  { label: "C", value: "C" },
  { label: "C♯", value: "C#" },
  { label: "D", value: "D" },
  { label: "E♭", value: "Eb" },
  { label: "E", value: "E" },
  { label: "F", value: "F" },
  { label: "F♯", value: "F#" },
  { label: "G", value: "G" },
  { label: "A♭", value: "Ab" },
  { label: "A", value: "A" },
  { label: "B♭", value: "Bb" },
  { label: "B", value: "B" },
  { label: "D♭", value: "Db" },
  { label: "G♭", value: "Gb" },
] as const satisfies ReadonlyArray<SelectorOption<string>>;
type KeyValue = (typeof keyOptions)[number]["value"];

const keyTypeOptions = [
  { label: "Ionian", value: "ionian" },
  { label: "Dorian", value: "dorian" },
  { label: "Phrygian", value: "phrygian" },
  { label: "Lydian", value: "lydian" },
  { label: "Mixolydian", value: "mixolydian" },
  { label: "Aeolian", value: "aeolian" },
  { label: "Locrian", value: "locrian" },
] as const satisfies ReadonlyArray<SelectorOption<string>>;
type KeyTypeValue = (typeof keyTypeOptions)[number]["value"];

const ChordsScreen = () => {
  const insets = useSafeAreaInsets();
  const [key, setKey] = useState<KeyValue>(() => {
    const savedKey = storage.getString(STORAGE_KEYS.CHORDS_KEY);
    if (savedKey && keyOptions.some((o) => o.value === savedKey)) return savedKey as KeyValue;
    return "C";
  });
  const [keyType, setKeyType] = useState<KeyTypeValue>(() => {
    const savedType = storage.getString(STORAGE_KEYS.CHORDS_TYPE);
    if (savedType && keyTypeOptions.some((o) => o.value === savedType)) return savedType as KeyTypeValue;
    return "ionian";
  });
  const [include7th, setInclude7th] = useState<boolean>(() => {
    const savedInclude7th = storage.getBoolean(STORAGE_KEYS.CHORDS_INCLUDE_7TH);
    return savedInclude7th ?? false;
  });
  const [openSelector, setOpenSelector] = useState<"key" | "type" | null>(null);
  const chords = useMemo(
    () => getDiatonicTriads(key, keyType as Mode, include7th),
    [include7th, key, keyType]
  );
  const selector = useMemo(() => {
    const isKeySelector = openSelector === "key";
    const isTypeSelector = openSelector === "type";
    const options: ReadonlyArray<SelectorOption<string>> = isKeySelector
      ? keyOptions
      : keyTypeOptions;
    const selectedValue = isKeySelector ? key : keyType;
    const title = isKeySelector ? "Key" : "Type";
    return { isKeySelector, isTypeSelector, options, selectedValue, title };
  }, [key, keyType, openSelector]);
  const closeSelector = () => setOpenSelector(null);

  useEffect(() => {
    storage.set(STORAGE_KEYS.CHORDS_KEY, key);
  }, [key]);

  useEffect(() => {
    storage.set(STORAGE_KEYS.CHORDS_TYPE, keyType);
  }, [keyType]);

  useEffect(() => {
    storage.set(STORAGE_KEYS.CHORDS_INCLUDE_7TH, include7th);
  }, [include7th]);

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      <View style={styles.header}>
        <View style={styles.selectors}>
          <View style={styles.selectorRow}>
            <View style={styles.selectorColumn}>
              <Text style={styles.selectorLabel}>Key</Text>
              <Pressable
                style={styles.selectorButton}
                onPress={() => setOpenSelector("key")}
              >
                <Text
                  style={styles.selectorValue}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {keyOptions.find((o) => o.value === key)?.label ?? key}
                </Text>
                <FontAwesome
                  name="chevron-down"
                  size={16}
                  color={colors.text.secondary}
                />
              </Pressable>
            </View>
            <View style={styles.selectorColumn}>
              <Text style={styles.selectorLabel}>Type</Text>
              <Pressable
                style={styles.selectorButton}
                onPress={() => setOpenSelector("type")}
              >
                <Text
                  style={styles.selectorValue}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {keyTypeOptions.find((o) => o.value === keyType)?.label ??
                    "Select"}
                </Text>
                <FontAwesome
                  name="chevron-down"
                  size={16}
                  color={colors.text.secondary}
                />
              </Pressable>
            </View>
          </View>
          <Pressable
            style={styles.checkboxRow}
            onPress={() => setInclude7th((v) => !v)}
            hitSlop={10}
          >
            <View style={styles.checkbox}>
              <FontAwesome
                name={include7th ? "check-square" : "square-o"}
                size={18}
                color={include7th ? colors.primary : colors.text.secondary}
              />
            </View>
            <Text style={styles.checkboxLabel}>Include 7th</Text>
          </Pressable>
        </View>
      </View>
      <View style={styles.table}>
        <View style={styles.tableHeaderRow}>
          <View style={styles.tableHeaderCell}>
            <Text style={styles.tableHeaderText}>Degree</Text>
          </View>
          <View style={styles.tableHeaderCell}>
            <Text style={styles.tableHeaderText}>Chord</Text>
          </View>
        </View>
        {chords.map((t) => (
          <View key={t.degree} style={styles.tableDataRow}>
            <View style={styles.tableDataCell}>
              <Text style={styles.tableDataText}>{t.degree}</Text>
            </View>
            <View style={styles.tableDataCell}>
              <Text style={styles.tableDataText}>{t.chord}</Text>
            </View>
          </View>
        ))}
      </View>
      <Modal
        visible={!!openSelector}
        transparent={false}
        animationType="slide"
        onRequestClose={closeSelector}
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
            <Pressable
              style={styles.modalCloseButton}
              onPress={closeSelector}
              hitSlop={10}
            >
              <FontAwesome
                name="close"
                size={18}
                color={colors.text.secondary}
              />
            </Pressable>
            <FlatList
              data={selector.options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <Pressable
                  style={[
                    styles.optionRow,
                    item.value === selector.selectedValue &&
                      styles.optionRowSelected,
                  ]}
                  onPress={() => {
                    if (selector.isKeySelector) {
                      setKey(item.value as KeyValue);
                    }
                    if (selector.isTypeSelector) {
                      setKeyType(item.value as KeyTypeValue);
                    }
                    closeSelector();
                  }}
                >
                  <Text style={styles.optionText}>{item.label}</Text>
                </Pressable>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: { paddingHorizontal: 20, paddingTop: 12, gap: 16 },
  table: { paddingHorizontal: 20, paddingTop: 16, gap: 10 },
  tableHeaderRow: { flexDirection: "row", gap: 10 },
  tableHeaderCell: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
  },
  tableHeaderText: {
    color: colors.text.secondary,
    fontSize: 14,
    fontWeight: "800",
    textAlign: "center",
  },
  tableDataRow: { flexDirection: "row", gap: 10 },
  tableDataCell: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: colors.tuner.button.background,
    borderWidth: 1,
    borderColor: colors.tuner.button.border,
  },
  tableDataText: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: "800",
    textAlign: "center",
  },
  selectors: { gap: 10 },
  selectorRow: { flexDirection: "row", gap: 10 },
  selectorColumn: { flex: 1, gap: 10 },
  selectorLabel: {
    color: colors.text.secondary,
    fontSize: 14,
    fontWeight: "600",
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 6,
  },
  checkbox: { width: 26, alignItems: "center", justifyContent: "center" },
  checkboxLabel: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: "700",
  },
  selectorButton: {
    backgroundColor: colors.tuner.button.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.tuner.button.border,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selectorValue: {
    color: colors.text.primary,
    fontSize: 18,
    fontWeight: "700",
    flexShrink: 1,
    paddingRight: 8,
  },
  modalOverlay: { flex: 1, backgroundColor: colors.background },
  modalCard: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 12,
  },
  modalCloseButton: { alignSelf: "flex-end", padding: 8, marginBottom: 6 },
  optionRow: { paddingVertical: 14, paddingHorizontal: 12, borderRadius: 12 },
  optionRowSelected: {
    backgroundColor: colors.tuner.button.background,
    borderWidth: 1,
    borderColor: colors.tuner.button.border,
  },
  optionText: { color: colors.text.primary, fontSize: 24, fontWeight: "500" },
});

export default ChordsScreen;
