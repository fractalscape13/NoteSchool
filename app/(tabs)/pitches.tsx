import { LegendList, LegendListRenderItemProps } from "@legendapp/list";
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { Audio } from 'expo-av';
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../src/constants/theme';
import { Note, notes } from '../../src/utils/notes';

const PitchesScreen = () => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const insets = useSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions();
  const tabBarHeight = useBottomTabBarHeight();

  const playNote = async (audioFile: any) => {
    try {
      if (sound) {
        await sound.unloadAsync();
      }
      const { sound: newSound } = await Audio.Sound.createAsync(audioFile);
      setSound(newSound);
      await newSound.playAsync();
    } catch (error) {
      console.error('Error playing note:', error);
    }
  };

  const renderItem = ({ item }: LegendListRenderItemProps<Note>) => (
    <TouchableOpacity
      style={[styles.button, { height: (windowHeight - insets.top - insets.bottom - tabBarHeight - 60) / 6 }]}
      onPress={() => playNote(item.audioFile)}
    >
      <Text style={styles.buttonText}>
        {item.name}
        {item.altName && ` · ${item.altName}`}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <LegendList
        data={notes}
        renderItem={renderItem}
        keyExtractor={(item: Note) => item.name}
        numColumns={2}
        contentContainerStyle={styles.buttonContainer}
        columnWrapperStyle={styles.columnWrapper}
        scrollEnabled={false}
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