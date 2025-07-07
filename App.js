import React, { useState } from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './Screens/HomeScreen';
import ForecastScreen from './Screens/ForecastScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [isDark, setIsDark] = useState(false);

  return (
    <NavigationContainer theme={isDark ? DarkTheme : DefaultTheme}>
      <Stack.Navigator>
        <Stack.Screen name="Home">
          {(props) => (
            <HomeScreen {...props} isDark={isDark} setIsDark={setIsDark} />
          )}
        </Stack.Screen>
        <Stack.Screen name="Forecast" component={ForecastScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
