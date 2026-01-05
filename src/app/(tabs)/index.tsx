import { FontAwesome } from "@expo/vector-icons";
import { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { OptionsModal } from "../../components/OptionsModal";
import { storage, STORAGE_KEYS } from "../../constants/storage";
import { colors } from "../../constants/theme";
import { getDiatonicTriads, Mode } from "../../utils/chords";
import { keyOptions, keyTypeOptions, type KeyTypeValue, type KeyValue } from "../../utils/keys";

type SelectorOption<TValue extends string> = { label: string; value: TValue };

const getChordToneIndices = (chordIndex: number, include7th: boolean) => {
  const triad = [chordIndex, (chordIndex + 2) % 7, (chordIndex + 4) % 7];
  if (!include7th) return triad;
  return [...triad, (chordIndex + 6) % 7];
};

const getTriadAbbreviation = (quality: string) => {
  if (quality === "major") return "maj";
  if (quality === "minor") return "min";
  return quality;
};

const MixedScreen = () => {
  const insets = useSafeAreaInsets();
  const [key, setKey] = useState<KeyValue>(() => {
    const savedKey = storage.getString(STORAGE_KEYS.MIXED_KEY);
    if (savedKey && keyOptions.some((o) => o.value === savedKey)) return savedKey as KeyValue;
    return "C";
  });
  const [keyType, setKeyType] = useState<KeyTypeValue>(() => {
    const savedType = storage.getString(STORAGE_KEYS.MIXED_TYPE);
    if (savedType && keyTypeOptions.some((o) => o.value === savedType)) return savedType as KeyTypeValue;
    return "ionian";
  });
  const [include7th, setInclude7th] = useState<boolean>(() => {
    const savedInclude7th = storage.getBoolean(STORAGE_KEYS.MIXED_INCLUDE_7TH);
    return savedInclude7th ?? false;
  });
  const [openSelector, setOpenSelector] = useState<"key" | "type" | null>(null);
  const [selectedChordIndex, setSelectedChordIndex] = useState<number>(0);

  const diatonic = useMemo(
    () => getDiatonicTriads(key, keyType as Mode, include7th),
    [include7th, key, keyType]
  );
  const scaleNotes = useMemo(() => diatonic.map((t) => t.root), [diatonic]);
  const chordToneIndices = useMemo(
    () => getChordToneIndices(selectedChordIndex, include7th),
    [include7th, selectedChordIndex]
  );
  const selector = useMemo(() => {
    const isKeySelector = openSelector === "key";
    const isTypeSelector = openSelector === "type";
    const options: ReadonlyArray<SelectorOption<string>> = isKeySelector ? keyOptions : keyTypeOptions;
    const selectedValue = isKeySelector ? key : keyType;
    return { isKeySelector, isTypeSelector, options, selectedValue };
  }, [key, keyType, openSelector]);
  const closeSelector = () => setOpenSelector(null);

  useEffect(() => {
    storage.set(STORAGE_KEYS.MIXED_KEY, key);
  }, [key]);

  useEffect(() => {
    storage.set(STORAGE_KEYS.MIXED_TYPE, keyType);
  }, [keyType]);

  useEffect(() => {
    storage.set(STORAGE_KEYS.MIXED_INCLUDE_7TH, include7th);
  }, [include7th]);

  useEffect(() => {
    setSelectedChordIndex(0);
  }, [key, keyType]);

  useEffect(() => {
    if (!Number.isFinite(selectedChordIndex) || selectedChordIndex < 0 || selectedChordIndex > 6) {
      setSelectedChordIndex(0);
    }
  }, [selectedChordIndex]);

  return (
    <ScrollView
      style={styles.container}
      bounces={false}
      contentContainerStyle={[
        styles.contentContainer,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      <View style={styles.header}>
        <View style={styles.selectors}>
          <View style={styles.selectorRow}>
            <View style={styles.selectorColumn}>
              <Text style={styles.selectorLabel}>Key</Text>
              <Pressable style={styles.selectorButton} onPress={() => setOpenSelector("key")}>
                <Text style={styles.selectorValue} numberOfLines={1} ellipsizeMode="tail">
                  {keyOptions.find((o) => o.value === key)?.label ?? key}
                </Text>
                <FontAwesome name="chevron-down" size={16} color={colors.text.secondary} />
              </Pressable>
            </View>
            <View style={styles.selectorColumn}>
              <Text style={styles.selectorLabel}>Type</Text>
              <Pressable style={styles.selectorButton} onPress={() => setOpenSelector("type")}>
                <Text style={styles.selectorValue} numberOfLines={1} ellipsizeMode="tail">
                  {keyTypeOptions.find((o) => o.value === keyType)?.label ?? "Select"}
                </Text>
                <FontAwesome name="chevron-down" size={16} color={colors.text.secondary} />
              </Pressable>
            </View>
          </View>
          <Pressable style={styles.checkboxRow} onPress={() => setInclude7th((v) => !v)} hitSlop={10}>
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

      <View style={styles.body}>
        <View style={styles.section}>
          <View style={styles.tableHeaderRow}>
            <View style={styles.tableHeaderCell}>
              <Text style={styles.tableHeaderText}>Chord</Text>
            </View>
            <View style={styles.tableHeaderCell}>
              <Text style={styles.tableHeaderText}>Notes</Text>
            </View>
          </View>
          <View>
            {diatonic.map((item, index) => {
              const chordSelected = index === selectedChordIndex;
              const noteSelected = chordToneIndices.includes(index);
              const chordLabel = include7th ? item.chord : `${item.root} ${getTriadAbbreviation(item.quality)}`;
              return (
                <Pressable
                  key={item.degree}
                  style={styles.tableDataRow}
                  onPress={() => setSelectedChordIndex(index)}
                >
                  <View style={[styles.tableDataCell, chordSelected && styles.tableDataCellSelected]}>
                    <View style={styles.chordCellRow}>
                      <Text style={styles.degreeText}>{item.degree}</Text>
                      <Text
                        style={[
                          styles.chordNameText,
                          chordSelected ? styles.textSelected : styles.textUnselected,
                        ]}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {chordLabel}
                      </Text>
                    </View>
                  </View>
                  <View style={[styles.tableDataCell, noteSelected && styles.tableDataCellSelected]}>
                    <Text
                      style={[
                        styles.noteCellText,
                        noteSelected ? styles.textSelected : styles.textUnselected,
                      ]}
                    >
                      {scaleNotes[index]}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
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
  contentContainer: { flexGrow: 1 },
  header: { paddingHorizontal: 20, paddingTop: 12, gap: 16 },
  selectors: { gap: 10 },
  selectorRow: { flexDirection: "row", gap: 10 },
  selectorColumn: { flex: 1, gap: 10 },
  selectorLabel: { color: colors.text.secondary, fontSize: 14, fontWeight: "600" },
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
  checkboxRow: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 6 },
  checkbox: { width: 26, alignItems: "center", justifyContent: "center" },
  checkboxLabel: { color: colors.text.primary, fontSize: 16, fontWeight: "700" },
  body: { paddingHorizontal: 20, paddingTop: 16, gap: 16 },
  section: { gap: 10 },
  tableHeaderRow: { flexDirection: "row", gap: 10 },
  tableHeaderCell: { flex: 1, alignItems: "flex-start", justifyContent: "center", paddingVertical: 6 },
  tableHeaderText: { color: colors.text.secondary, fontSize: 14, fontWeight: "800", textAlign: "left" },
  tableDataRow: { flexDirection: "row", gap: 10, marginBottom: 10 },
  tableDataCell: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "transparent",
    backgroundColor: "transparent",
  },
  tableDataCellSelected: { borderColor: colors.primary, backgroundColor: colors.tuner.button.background },
  chordCellRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  degreeText: { color: colors.text.secondary, fontSize: 13, fontWeight: "900", letterSpacing: 0.2 },
  chordNameText: { fontSize: 17, fontWeight: "800", textAlign: "left", flexShrink: 1 },
  noteCellText: { fontSize: 18, fontWeight: "800", textAlign: "left" },
  textSelected: { color: colors.text.primary },
  textUnselected: { color: "rgba(241,245,249,0.78)" },
});

export default MixedScreen;


