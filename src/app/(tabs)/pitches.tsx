import { LegendList, LegendListRenderItemProps } from "@legendapp/list";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from "expo-av";
import { useCallback, useEffect, useRef } from "react";
import { StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../../constants/theme";
import { keyOptions } from "../../utils/keys";
import { notes } from "../../utils/notes";

type KeyOption = (typeof keyOptions)[number];
type PitchItem = { value: KeyOption["value"]; label: KeyOption["label"]; audioFile: number };

const PitchesScreen = () => {
  const soundRef = useRef<Audio.Sound | null>(null);
  const insets = useSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions();
  const tabBarHeight = useBottomTabBarHeight();
  const availableHeight = windowHeight - insets.top - insets.bottom - tabBarHeight - 60;
  const buttonHeight = Math.max(availableHeight / 6, 90);
  const pitchItems: ReadonlyArray<PitchItem> = keyOptions.flatMap((o): PitchItem[] => {
    const matchingNote = notes.find((n) => n.name === o.label || n.altName === o.label);
    if (!matchingNote) return [];
    return [{ value: o.value, label: o.label, audioFile: matchingNote.audioFile }];
  });

  useEffect(() => {
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: InterruptionModeAndroid.DuckOthers,
      interruptionModeIOS: InterruptionModeIOS.DuckOthers,
    }).catch((error) => {
      console.error('Error setting audio mode:', error);
    });
  }, []);

  useEffect(() => {
    return () => {
      soundRef.current?.setOnPlaybackStatusUpdate(null);
      soundRef.current?.unloadAsync().catch(() => {});
      soundRef.current = null;
    };
  }, []);

  const playNote = useCallback(async (audioFile: number) => {
    try {
      if (soundRef.current) {
        soundRef.current.setOnPlaybackStatusUpdate(null);
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }
      const { sound } = await Audio.Sound.createAsync(audioFile, { shouldPlay: true });
      sound.setOnPlaybackStatusUpdate(() => {});
      soundRef.current = sound;
    } catch (error) {
      console.error('Error playing note:', error);
    }
  }, []);

  const renderItem = ({ item }: LegendListRenderItemProps<PitchItem>) => (
    <TouchableOpacity
      style={[styles.button, { height: (windowHeight - insets.top - insets.bottom - tabBarHeight - 50) / 6 }]}
      onPress={() => playNote(item.audioFile)}
    >
      <Text style={styles.buttonText}>
        {item.label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <LegendList
        data={pitchItems}
        renderItem={renderItem}
        keyExtractor={(item: PitchItem) => item.value}
        numColumns={2}
        contentContainerStyle={styles.buttonContainer}
        columnWrapperStyle={styles.columnWrapper}
        scrollEnabled
        showsVerticalScrollIndicator={false}
        bounces={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  buttonContainer: {
    padding: 10,
    flexGrow: 1,
    gap: 10,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    gap: 10,
    flex: 1,
  },
  button: {
    backgroundColor: colors.tuner.button.background,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.tuner.button.border,
    flex: 1,
    marginHorizontal: 0,
  },
  buttonText: {
    color: colors.tuner.button.text,
    fontSize: 42,
    fontWeight: '500',
  },
});

export default PitchesScreen; 