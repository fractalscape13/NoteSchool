import { Icon, Label, NativeTabs } from "expo-router/unstable-native-tabs";
const TabLayout = () => {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <Icon sf="square.grid.2x2" />
        <Label>Chords</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="notes">
        <Icon sf="music.note" />
        <Label>Notes</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="pitches">
        <Icon sf="tuningfork" />
        <Label>Pitches</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="ai">
        <Icon sf="sparkle" />
        <Label>AI</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
};

export default TabLayout;
