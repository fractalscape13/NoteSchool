import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from "expo-av";
import { useCallback, useEffect, useRef } from "react";
import { Platform, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from "react-native";
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
  const tabBarHeight = Platform.OS === 'ios' ? 49 : 56;
  const pitchItems: readonly PitchItem[] = keyOptions.flatMap((o): PitchItem[] => {
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

  const containerTopPadding = insets.top;
  const containerBottomPadding = insets.bottom + tabBarHeight;
  const buttonContainerPadding = 10;
  const gapSize = 10;
  const numRows = 6;
  const totalGaps = (numRows - 1) * gapSize;
  const availableHeight = windowHeight - containerTopPadding - containerBottomPadding;
  const buttonHeight = Math.max(0, (availableHeight - (buttonContainerPadding * 2) - totalGaps) / numRows);
  const buttonContainerMaxHeight = (buttonHeight * numRows) + (buttonContainerPadding * 2) + totalGaps;

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom + tabBarHeight }]}>
      <View style={[styles.buttonContainer, { maxHeight: buttonContainerMaxHeight }]}>
        {pitchItems.map((item, index) => {
          if (index % 2 === 0) {
            return (
              <View key={`row-${index / 2}`} style={styles.columnWrapper}>
                <TouchableOpacity
                  style={[styles.button, { height: buttonHeight }]}
                  onPress={() => playNote(item.audioFile)}
                >
                  <Text style={styles.buttonText}>{item.label}</Text>
                </TouchableOpacity>
                {pitchItems[index + 1] && (
                  <TouchableOpacity
                    style={[styles.button, { height: buttonHeight }]}
                    onPress={() => playNote(pitchItems[index + 1].audioFile)}
                  >
                    <Text style={styles.buttonText}>{pitchItems[index + 1].label}</Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          }
          return null;
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    overflow: 'hidden',
  },
  buttonContainer: {
    padding: 10,
    gap: 10,
    flex: 1,
  },
  columnWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
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