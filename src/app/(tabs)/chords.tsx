import { FontAwesome } from "@expo/vector-icons";
import React, { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { OptionsModal } from "../../components/OptionsModal";
import { storage, STORAGE_KEYS } from "../../constants/storage";
import { colors } from "../../constants/theme";
import { getDiatonicTriads, Mode } from "../../utils/chords";
import {
  keyOptions,
  keyTypeOptions,
  type KeyTypeValue,
  type KeyValue,
} from "../../utils/keys";

type SelectorOption<TValue extends string> = { label: string; value: TValue };

const ChordsScreen = () => {
  const insets = useSafeAreaInsets();
  const [key, setKey] = useState<KeyValue>(() => {
    const savedKey = storage.getString(STORAGE_KEYS.CHORDS_KEY);
    if (savedKey && keyOptions.some((o) => o.value === savedKey))
      return savedKey as KeyValue;
    return "C";
  });
  const [keyType, setKeyType] = useState<KeyTypeValue>(() => {
    const savedType = storage.getString(STORAGE_KEYS.CHORDS_TYPE);
    if (savedType && keyTypeOptions.some((o) => o.value === savedType))
      return savedType as KeyTypeValue;
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
    const options: readonly SelectorOption<string>[] = isKeySelector
      ? keyOptions
      : keyTypeOptions;
    const selectedValue = isKeySelector ? key : keyType;
    return { isKeySelector, isTypeSelector, options, selectedValue };
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
    <ScrollView
      style={styles.container}
      bounces={false}
      contentContainerStyle={[
        styles.contentContainer,
        { paddingTop: insets.top, paddingBottom: insets.bottom + 120 },
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
      <OptionsModal
        visible={!!openSelector}
        options={selector.options}
        selectedValue={selector.selectedValue}
        onClose={closeSelector}
        onSelect={(value) => {
          if (selector.isKeySelector) setKey(value as KeyValue);
          if (selector.isTypeSelector) setKeyType(value as KeyTypeValue);
          closeSelector();
        }}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: { flexGrow: 1 },
  header: { paddingHorizontal: 20, paddingTop: 12, gap: 16 },
  table: { paddingHorizontal: 20, paddingTop: 16, gap: 10 },
  tableHeaderRow: { flexDirection: "row", gap: 10 },
  tableHeaderCell: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "center",
    paddingVertical: 6,
  },
  tableHeaderText: {
    color: colors.text.secondary,
    fontSize: 14,
    fontWeight: "800",
    textAlign: "left",
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
    textAlign: "left",
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
});

export default ChordsScreen;
