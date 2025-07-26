import { View, Text, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { WinterButton } from "../components/winter-btn";

export function StartScreen() {
  const inset = useSafeAreaInsets();
  return (
    <View style={{ top: inset.top, bottom: inset.bottom, ...styles.screen }}>
      <Text style={styles.mainTitle}> T'as froid hun ?</Text>
      <WinterButton />
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
    gap: 35,
  },
  mainTitle: {
    fontSize: 40,
    color: "white",
    fontWeight: "bold",
  },
});
