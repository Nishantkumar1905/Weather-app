// Screens/ForecastScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ForecastScreen({ route }) {
  const { city } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>5-Day Forecast for {city}</Text>
      {/* You can build API logic to show actual forecast here */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: 'bold' },
});
