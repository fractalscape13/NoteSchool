import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../../src/constants/theme";

const TabLayout = () => {
  const insets = useSafeAreaInsets();
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.text.secondary,
        tabBarStyle: {
          borderTopWidth: 0.5,
          borderTopColor: colors.primary,
          paddingBottom: insets.bottom,
          backgroundColor: colors.background,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginTop: 4,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Notes",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="random" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="pitches"
        options={{
          title: "Pitches",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="pitchfork" size={28} color={color} />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabLayout;
