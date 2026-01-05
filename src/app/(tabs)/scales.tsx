import { FontAwesome } from "@expo/vector-icons";
import { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { OptionsModal } from "../../components/OptionsModal";
import { storage, STORAGE_KEYS } from "../../constants/storage";
import { colors } from "../../constants/theme";
import {
  getDiatonicTriads,
  getNumericDegreeLabelsForMode,
  Mode,
} from "../../utils/chords";
import {
  keyOptions,
  keyTypeOptions,
  type KeyTypeValue,
  type KeyValue,
} from "../../utils/keys";

type SelectorOption<TValue extends string> = { label: string; value: TValue };

const ScalesScreen = () => {
  const insets = useSafeAreaInsets();
  const [key, setKey] = useState<KeyValue>(() => {
    const savedKey = storage.getString(STORAGE_KEYS.SCALES_KEY);
    if (savedKey && keyOptions.some((o) => o.value === savedKey))
      return savedKey as KeyValue;
    return "C";
  });
  const [keyType, setKeyType] = useState<KeyTypeValue>(() => {
    const savedType = storage.getString(STORAGE_KEYS.SCALES_TYPE);
    if (savedType && keyTypeOptions.some((o) => o.value === savedType))
      return savedType as KeyTypeValue;
    return "ionian";
  });
  const [openSelector, setOpenSelector] = useState<"key" | "type" | null>(null);
  const scaleNotes = useMemo(() => {
    const triads = getDiatonicTriads(key, keyType as Mode, false);
    return triads.map((t) => t.root);
  }, [key, keyType]);
  const degreeLabels = useMemo(
    () => getNumericDegreeLabelsForMode(keyType as Mode),
    [keyType]
  );
  const selector = useMemo(() => {
    const isKeySelector = openSelector === "key";
    const isTypeSelector = openSelector === "type";
    const options: ReadonlyArray<SelectorOption<string>> = isKeySelector
      ? keyOptions
      : keyTypeOptions;
    const selectedValue = isKeySelector ? key : keyType;
    return { isKeySelector, isTypeSelector, options, selectedValue };
  }, [key, keyType, openSelector]);
  const closeSelector = () => setOpenSelector(null);

  useEffect(() => {
    storage.set(STORAGE_KEYS.SCALES_KEY, key);
  }, [key]);

  useEffect(() => {
    storage.set(STORAGE_KEYS.SCALES_TYPE, keyType);
  }, [keyType]);

  return (
    <ScrollView
      style={styles.container}
      bounces={false}
      contentContainerStyle={[
        styles.contentContainer,
        { paddingTop: insets.top },
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
        </View>
      </View>
      <View style={styles.table}>
        <View style={styles.tableHeaderRow}>
          <View style={styles.tableHeaderCell}>
            <Text style={styles.tableHeaderText}>Degree</Text>
          </View>
          <View style={styles.tableHeaderCell}>
            <Text style={styles.tableHeaderText}>Note</Text>
          </View>
        </View>
        <View style={styles.tableBody}>
          {scaleNotes.map((note, index) => (
            <View key={`${note}-${index}`} style={styles.tableDataRow}>
              <View style={styles.tableDataCell}>
                <Text style={styles.tableDataText}>
                  {degreeLabels[index] ?? index + 1}
                </Text>
              </View>
              <View style={styles.tableDataCell}>
                <Text style={styles.tableDataText}>{note}</Text>
              </View>
            </View>
          ))}
        </View>
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
  container: { flex: 1, backgroundColor: colors.background },
  contentContainer: { paddingBottom: 12 },
  header: { paddingHorizontal: 20, paddingTop: 12, gap: 16 },
  table: { paddingHorizontal: 20, paddingTop: 16, gap: 10 },
  tableBody: { gap: 10 },
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

export default ScalesScreen;
