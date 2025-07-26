import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function ActionScreen() {
  const inset = useSafeAreaInsets();
  return (
    <View style={{ top: inset.top, bottom: inset.bottom }}>
      <Text>Action</Text>
    </View>
  );
}
