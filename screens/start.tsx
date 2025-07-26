import { View, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function StartScreen() {
  const inset = useSafeAreaInsets();
  return (
    <View style={{ top: inset.top, bottom: inset.bottom }}>
      <Text>Start</Text>
    </View>
  );
}
