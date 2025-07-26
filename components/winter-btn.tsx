import { useNavigation } from "@react-navigation/native";
import { Pressable, StyleSheet, Text } from "react-native";

export const WinterButton = () => {
  const navigation = useNavigation();
  return (
    <Pressable
      style={styles.button}
      onPress={() => navigation.navigate("action")}>
      <Text style={styles.text}>J'aimerais avoir chaud !!!</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#fff",
  },
  text: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
