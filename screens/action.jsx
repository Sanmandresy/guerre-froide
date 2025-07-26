import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Animated,
  StatusBar,
} from "react-native";
import { Accelerometer } from "expo-sensors";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";
import { Audio } from "expo-av";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

export function ActionScreen() {
  const inset = useSafeAreaInsets();
  const navigation = useNavigation();

  const [count, setCount] = useState(0);
  const maxShake = 100;

  // Animations
  const animatedProgress = useRef(new Animated.Value(0)).current;
  const animatedBackground = useRef(new Animated.Value(0)).current;
  const animatedScale = useRef(new Animated.Value(1)).current;

  // Son
  const [sound, setSound] = useState(null);
  const isPlayingSound = useRef(false);

  // Historique secousses
  const shakeTimestamps = useRef([]);

  // Lecture musique
  async function playVictorySound() {
    if (!isPlayingSound.current) {
      const { sound } = await Audio.Sound.createAsync(
        require("../assets/motiv.mp3"),
      );
      // @ts-ignore
      setSound(sound);
      isPlayingSound.current = true;
      await sound.playAsync();
    }
  }

  // Arrêt musique
  async function stopVictorySound() {
    if (sound) {
      try {
        await sound.stopAsync();
        await sound.unloadAsync();
      } catch (e) {
        console.log("Erreur arrêt son :", e);
      }
      setSound(null);
    }
    isPlayingSound.current = false; // reset pour pouvoir relancer
  }

  // Nettoyage quand composant démonte
  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  // Animation et gestion musique en fonction du count
  useEffect(() => {
    Animated.timing(animatedProgress, {
      toValue: count / maxShake,
      duration: 150,
      useNativeDriver: false,
    }).start();

    Animated.timing(animatedBackground, {
      toValue: count >= 90 ? 1 : 0,
      duration: 800,
      useNativeDriver: false,
    }).start();

    // Gestion musique
    if (count >= 90 && !isPlayingSound.current) {
      playVictorySound();
    } else if (count < 90 && isPlayingSound.current) {
      stopVictorySound();
    }

    // Pulse au max
    if (count === maxShake) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Animated.sequence([
        Animated.spring(animatedScale, {
          toValue: 1.3,
          friction: 3,
          useNativeDriver: true,
        }),
        Animated.spring(animatedScale, {
          toValue: 1,
          friction: 3,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [count]);

  // Détection secousses
  useEffect(() => {
    Accelerometer.setUpdateInterval(50);

    const subscription = Accelerometer.addListener(({ x, y, z }) => {
      const totalForce = Math.sqrt(x * x + y * y + z * z);

      if (totalForce > 1.3) {
        const now = Date.now();

        shakeTimestamps.current.push(now);

        // Garde uniquement les secousses de la dernière seconde
        shakeTimestamps.current = shakeTimestamps.current.filter(
          (t) => now - t <= 1000,
        );

        const frequency = shakeTimestamps.current.length;

        // Augmente si fréquence >= 3 secousses / sec
        if (frequency >= 3) {
          setCount((prev) => Math.min(prev + 1, maxShake));
        }
      }
    });

    return () => subscription.remove();
  }, []);

  // Diminution auto quand pas assez de secousses
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();

      shakeTimestamps.current = shakeTimestamps.current.filter(
        (t) => now - t <= 1000,
      );

      const frequency = shakeTimestamps.current.length;

      if (frequency < 3) {
        setCount((prev) => Math.max(prev - 1, 0));
      }
    }, 50);

    return () => clearInterval(interval);
  }, []);

  // Reset
  const resetShake = () => {
    stopVictorySound();
    setCount(0);
    animatedProgress.setValue(0);
    animatedBackground.setValue(0);
  };

  // Interpolations
  const progressWidth = animatedProgress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  const backgroundColor = animatedBackground.interpolate({
    inputRange: [0, 1],
    outputRange: ["#1e3c72", "#ff512f"], // bleu -> rouge feu
  });

  // Message affiché
  const getMessage = () => {
    if (count < 90) return "Encore un peu... Chauffe !";
    if (count < 100) return "🔥 Presque au max !";
    return "Bravo ! Feu total !";
  };

  const isHot = count >= 90;
  const calories = count * 0.5;

  return (
    <Animated.View
      style={{ top: inset.top, bottom: inset.bottom, ...styles.container }}>
      <StatusBar barStyle="light-content" />

      <Text style={styles.title}>{getMessage()}</Text>

      <Animated.View style={{ transform: [{ scale: animatedScale }] }}>
        <Image
          source={
            isHot
              ? require("../assets/feu.webp") // feu si ≥90
              : require("../assets/flocan.webp") // flocon sinon
          }
          style={styles.image}
          contentFit="contain"
        />
      </Animated.View>

      <Text style={styles.counterText}>
        {count} / {maxShake} secousses
      </Text>

      <View style={styles.progressWrapper}>
        <Animated.View
          style={[styles.progressFill, { width: progressWidth }]}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={resetShake}>
        <Text style={styles.buttonText}>Recommencer</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { marginTop: 15 }]}
        onPress={() => navigation.navigate("stat", { calories })}>
        <Text style={styles.buttonText}>Voir Calories</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#1e3c72",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
    textAlign: "center",
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 30,
  },
  counterText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 15,
  },
  progressWrapper: {
    width: "80%",
    height: 20,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 20,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#fff",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
