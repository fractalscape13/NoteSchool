import { Platform } from "react-native";

export const getIOSVersion = (): number => {
  if (Platform.OS !== "ios") return 0;
  const version = Platform.Version;
  return typeof version === "string" ? parseFloat(version) : version;
};

export const isLiquidGlassSupported = (): boolean => {
  if (Platform.OS !== "ios") return false;
  const version = getIOSVersion();
  return version >= 26;
};
