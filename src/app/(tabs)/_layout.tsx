import {
  createNativeBottomTabNavigator,
  NativeBottomTabNavigationEventMap,
  NativeBottomTabNavigationOptions,
} from "@bottom-tabs/react-navigation";
import { ParamListBase, TabNavigationState } from "@react-navigation/native";
import { withLayoutContext } from "expo-router";
import type { SFSymbol } from "sf-symbols-typescript";
import { colors } from "../../constants/theme";

const BottomTabNavigator = createNativeBottomTabNavigator().Navigator;

const Tabs = withLayoutContext<
  NativeBottomTabNavigationOptions,
  typeof BottomTabNavigator,
  TabNavigationState<ParamListBase>,
  NativeBottomTabNavigationEventMap
>(BottomTabNavigator);

const TabLayout = () => {
  return (
    <Tabs
      tabBarStyle={{ backgroundColor: colors.background }}
      tabLabelStyle={{ fontSize: 12 }}
      screenOptions={{ tabBarActiveTintColor: colors.primary }}
    >
      <Tabs.Screen
        name="chords"
        options={{
          title: "Chords",
          tabBarIcon: () => ({ sfSymbol: "pianokeys" satisfies SFSymbol }),
        }}
      />
      <Tabs.Screen
        name="scales"
        options={{
          title: "Scales",
          tabBarIcon: () => ({ sfSymbol: "list.bullet" satisfies SFSymbol }),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: "Mixed",
          tabBarIcon: () => ({
            sfSymbol: "square.grid.2x2" satisfies SFSymbol,
          }),
        }}
      />
      <Tabs.Screen
        name="notes"
        options={{
          title: "Notes",
          tabBarIcon: () => ({ sfSymbol: "music.note" satisfies SFSymbol }),
        }}
      />
      <Tabs.Screen
        name="pitches"
        options={{
          title: "Pitches",
          tabBarIcon: () => ({ sfSymbol: "tuningfork" satisfies SFSymbol }),
        }}
      />
    </Tabs>
  );
};

export default TabLayout;
