// Screens/HomeScreen.js
import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  Image, ActivityIndicator, Switch, Keyboard, ScrollView
} from 'react-native';
import axios from 'axios';
import * as Location from 'expo-location';

const API_KEY = '6b9f2f40e8ff779d952ed89272db5256'; // Replace this with your actual OpenWeatherMap key

export default function HomeScreen({ navigation, isDark, setIsDark }) {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchWeatherByCoords = async (lat, lon) => {
    try {
      const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      setWeather(res.data);
      setLastUpdated(new Date());
    } catch {
      setError('Failed to fetch weather');
    } finally {
      setLoading(false);
    }
  };

  const fetchWeatherByCity = async () => {
    if (!city) return;
    setLoading(true);
    try {
      const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      setWeather(res.data);
      setLastUpdated(new Date());
      setError('');
      Keyboard.dismiss();
    } catch {
      setError('City not found');
    } finally {
      setLoading(false);
    }
  };

  const getLocationAndFetch = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setError('Permission to access location was denied');
      setLoading(false);
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    fetchWeatherByCoords(location.coords.latitude, location.coords.longitude);
  };

  useEffect(() => {
    getLocationAndFetch();
  }, []);

  const getTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <ScrollView style={[styles.container, isDark && { backgroundColor: '#121212' }]}>
      <View style={styles.toggleRow}>
        <Text style={[styles.toggleLabel, isDark && { color: '#fff' }]}>Dark Mode</Text>
        <Switch value={isDark} onValueChange={() => setIsDark(!isDark)} />
      </View>

      <TextInput
        style={[styles.input, isDark && { backgroundColor: '#333', color: '#fff' }]}
        placeholder="Enter city"
        placeholderTextColor={isDark ? '#aaa' : '#666'}
        value={city}
        onChangeText={setCity}
        onSubmitEditing={fetchWeatherByCity}
      />

      <TouchableOpacity style={styles.button} onPress={fetchWeatherByCity}>
        <Text style={styles.buttonText}>Search</Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: 20 }} />
      ) : weather ? (
        <View style={[styles.card, isDark && { backgroundColor: '#1e1e1e' }]}>
          <Text style={[styles.city, isDark && { color: '#fff' }]}>{weather.name}</Text>
          <Image
            source={{ uri: `https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png` }}
            style={styles.icon}
          />
          <Text style={[styles.temp, isDark && { color: '#fff' }]}>
            {Math.round(weather.main.temp)}°C
          </Text>
          <Text style={[styles.desc, isDark && { color: '#aaa' }]}>
            {weather.weather[0].description}
          </Text>

          <Text style={[styles.extraText, isDark && { color: '#ccc' }]}>
            Feels like: {Math.round(weather.main.feels_like)}°C
          </Text>
          <Text style={[styles.extraText, isDark && { color: '#ccc' }]}>
            Humidity: 💧 {weather.main.humidity}%
          </Text>
          <Text style={[styles.extraText, isDark && { color: '#ccc' }]}>
            Wind Speed: 🌬️ {weather.wind.speed} m/s
          </Text>
          <Text style={[styles.extraText, isDark && { color: '#ccc' }]}>
            Sunrise: 🌅 {getTime(weather.sys.sunrise)}
          </Text>
          <Text style={[styles.extraText, isDark && { color: '#ccc' }]}>
            Sunset: 🌇 {getTime(weather.sys.sunset)}
          </Text>
          <Text style={[styles.lastUpdated, isDark && { color: '#999' }]}>
            Last updated: {lastUpdated?.toLocaleTimeString()}
          </Text>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#4FC3F7' }]}
            onPress={() => navigation.navigate('Forecast', { city: weather.name })}
          >
            <Text style={styles.buttonText}>5-Day Forecast ➡️</Text>
          </TouchableOpacity>
        </View>
      ) : (
        error !== '' && <Text style={{ color: 'red' }}>{error}</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#FFD54F',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: { fontWeight: 'bold' },
  card: {
    marginTop: 20,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    elevation: 3,
    backgroundColor: '#fff',
  },
  city: { fontSize: 24, fontWeight: 'bold' },
  temp: { fontSize: 40, fontWeight: 'bold' },
  desc: { fontSize: 18 },
  icon: { width: 100, height: 100 },
  extraText: { fontSize: 16, marginTop: 5 },
  lastUpdated: { fontSize: 12, marginTop: 8, fontStyle: 'italic' },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  toggleLabel: { fontSize: 16 },
});
