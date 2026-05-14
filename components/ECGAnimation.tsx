import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Easing } from 'react-native';
import { colors } from '@/src/theme/colors';

export default function ECGAnimation() {
  const lineAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(lineAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const translateX = lineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-200, 400],
  });

  return (
    <View style={styles.container}>
      <View style={styles.ecgBaseLine} />
      <Animated.View style={[styles.ecgLine, { transform: [{ translateX }] }]}>
          <View style={styles.pulse} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 60,
    width: '100%',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  ecgBaseLine: {
    height: 2,
    backgroundColor: 'rgba(175, 16, 26, 0.1)',
    width: '100%',
    position: 'absolute',
  },
  ecgLine: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pulse: {
    width: 200,
    height: 40,
    borderWidth: 2,
    borderColor: colors.primary,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    // Simple pulse shape using border radius or specific paths would be better
    // but for now a styled line segment
    opacity: 0.8,
  },
});
