import { createStackNavigator } from "@react-navigation/stack"
import { WeatherScreen } from "../../screens/WeatherScreen"
import { LocationDetailScreen } from "../../screens/LocationDetailScreen"

const Stack = createStackNavigator()

export const WeatherStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="WeatherMain" component={WeatherScreen} />
      <Stack.Screen name="LocationDetails" component={LocationDetailScreen} />
    </Stack.Navigator>
  )
}
