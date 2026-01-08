import { Icon, Label, NativeTabs } from "expo-router/unstable-native-tabs";
import { colors } from "../../constants/theme";
const TabLayout = () => {
  return (
    <NativeTabs
      backgroundColor={colors.background}
      labelStyle={{ fontSize: 12 }}
      minimizeBehavior="automatic"
      tintColor={colors.primary}
    >
      <NativeTabs.Trigger name="chords">
        <Icon sf="pianokeys" />
        <Label>Chords</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="scales">
        <Icon sf="list.bullet" />
        <Label>Scales</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="index">
        <Icon sf="square.grid.2x2" />
        <Label>Mixed</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="notes">
        <Icon sf="music.note" />
        <Label>Notes</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="pitches">
        <Icon sf="tuningfork" />
        <Label>Pitches</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
};

export default TabLayout;
