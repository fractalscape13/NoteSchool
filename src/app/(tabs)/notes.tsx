import { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { storage, STORAGE_KEYS } from "../../constants/storage";
import { colors } from "../../constants/theme";
import { Note, notes } from "../../utils/notes";

const NotesScreen = () => {
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const noteFontSize = height < 700 ? 250 : 280;
  const [includeAccidentals, setIncludeAccidentals] = useState<boolean>(() => {
    const savedIncludeAccidentals = storage.getBoolean(STORAGE_KEYS.INCLUDE_ACCIDENTALS);
    return savedIncludeAccidentals ?? false;
  });
  const [currentNote, setCurrentNote] = useState<Note>(notes[0]);
  const [intervalTime, setIntervalTime] = useState<number>(() => {
    const savedInterval = storage.getNumber(STORAGE_KEYS.INTERVAL_TIME);
    return savedInterval ?? 2;
  });
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [currentSecond, setCurrentSecond] = useState<number>(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const changeNote = (accidentals: boolean = includeAccidentals) => {
    const filteredNotes = accidentals
      ? notes
      : notes.filter(note => note.natural);
    const randomIndex = Math.floor(Math.random() * filteredNotes.length);
    setCurrentNote(filteredNotes[randomIndex]);
    setCurrentSecond(0);
  };

  const startTimer = (seconds: number) => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setIsRunning(true);
    setCurrentSecond(0);

    intervalRef.current = setInterval(() => {
      setCurrentSecond((prev) => {
        const nextSecond = prev + 1;
        if (nextSecond >= seconds) {
          changeNote();
          return 0;
        }
        return nextSecond;
      });
    }, 1000);
  };

  const stopTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setIsRunning(false);
  };

  const toggleAccidentals = () => {
    setIncludeAccidentals((prev) => {
      const next = !prev;
      changeNote(next);
      return next;
    });
  };

  useEffect(() => {
    changeNote(includeAccidentals);
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isRunning && typeof intervalTime === "number") {
      startTimer(intervalTime);
    } else if (isRunning) {
      stopTimer();
    }
  }, [includeAccidentals, intervalTime, isRunning]);

  useEffect(() => {
    storage.set(STORAGE_KEYS.INTERVAL_TIME, intervalTime);
  }, [intervalTime]);

  useEffect(() => {
    storage.set(STORAGE_KEYS.INCLUDE_ACCIDENTALS, includeAccidentals);
  }, [includeAccidentals]);

  const renderDotIndicators = () => {
    const dots = [];
    for (let i = 0; i < intervalTime; i++) {
      dots.push(
        <View
          key={i}
          style={[styles.dot, i === currentSecond && styles.activeDot]}
        />
      );
    }
    if (dots.length > 1) {
      return dots;
    }
    return null;
  };

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <View style={styles.noteContainer}>
        <TouchableOpacity
          onPress={() => {
            if (isRunning) {
              stopTimer();
            } else {
              if (typeof intervalTime === "number") {
                startTimer(intervalTime);
              }
            }
          }}
          activeOpacity={0.9}
          style={styles.noteTouchable}
        >
          <Text style={[styles.noteText, { fontSize: noteFontSize }, !isRunning && styles.noteTextInactive]}>
            {currentNote.name}
          </Text>
        </TouchableOpacity>
        <View style={styles.dotContainer}>{renderDotIndicators()}</View>
      </View>
      <View>
        <View style={styles.controls}>
          <View style={styles.incrementerContainer}>
            <TouchableOpacity
              style={styles.incrementButton}
              hitSlop={15}
              onPress={() => {
                if (typeof intervalTime === "number" && intervalTime > 1) {
                  setIntervalTime(intervalTime - 1);
                }
              }}
            >
              <Text style={styles.incrementText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.intervalText}>{intervalTime}</Text>
            <TouchableOpacity
              style={styles.incrementButton}
              hitSlop={15}
              onPress={() => {
                if (typeof intervalTime === "number" && intervalTime < 12) {
                  setIntervalTime(intervalTime + 1);
                }
              }}
            >
              <Text style={styles.incrementText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[
              styles.controlButton,
              isRunning ? styles.stopButton : styles.startButton,
            ]}
            onPress={
              isRunning
                ? stopTimer
                : () => {
                    if (typeof intervalTime === "number") {
                      startTimer(intervalTime);
                    }
                  }
            }
          >
            <Text style={styles.buttonText}>{isRunning ? "Stop" : "Start"}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.controlButton,
              styles.accidentalsButton,
              includeAccidentals && styles.accidentalsButtonActive,
            ]}
            onPress={toggleAccidentals}
          >
            <Text style={styles.buttonText}>Include Accidentals</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  noteContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noteTouchable: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  noteText: {
    fontWeight: "bold",
    color: colors.primary,
    textAlign: "center",
  },
  noteTextInactive: {
    opacity: 0.4,
  },
  dotContainer: {
    flexDirection: "row",
    justifyContent: "center",
    position: "absolute",
    bottom: 40,
  },
  dot: {
    width: 15,
    height: 15,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.text.secondary,
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: colors.text.secondary,
  },
  controls: {
    flexDirection: "column",
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  label: {
    color: colors.text.primary,
    fontSize: 16,
    marginBottom: 5,
  },
  incrementerContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  incrementButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  incrementText: {
    color: colors.primary,
    fontSize: 24,
    fontWeight: "bold",
  },
  intervalText: {
    color: colors.text.primary,
    fontSize: 24,
    fontWeight: "bold",
    minWidth: 40,
    textAlign: "center",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  controlButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    minWidth: 120,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  startButton: {
    backgroundColor: colors.button.start.background,
  },
  stopButton: {
    backgroundColor: colors.button.stop.background,
  },
  accidentalsButton: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  accidentalsButtonActive: {
    backgroundColor: colors.primary,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
});

export default NotesScreen;

