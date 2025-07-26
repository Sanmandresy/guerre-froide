import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function StatScreen() {
  const inset = useSafeAreaInsets();
  return (
    <View style={{ top: inset.top, bottom: inset.bottom, ...styles.screen }}>
      <Text>Stat</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1e3c72",
    gap: 25,
  },
});
