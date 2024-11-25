import React from "react"
import { View, Text, ScrollView, Image } from "react-native"
import { Weather } from "../../types/weather"
import { styles } from "./LocationDetailScreen.styles"
import { DailyWeatherList } from "./components/DailyWeatherList"
import { Card } from "react-native-paper"
import { WEATHER_ICONS } from "../../constants/weatherIcons"
import { HourlyWeatherList } from "./components/HourlyWeatherList"
import { useRoute } from "@react-navigation/native"

export const LocationDetailScreen = () => {
  const route = useRoute()
  // @ts-ignore
  const { location }: { location: Weather } = route.params
  const { weather } = location

  return (
    <ScrollView>
      <View style={styles.locationDetailScreen}>
        <Card mode="contained">
          <View style={styles.currentCard}>
            <Image style={styles.icon} source={WEATHER_ICONS[weather?.current?.weather[0].main]} />
            <Text style={styles.temperature}>{Math.round(weather?.current?.temp)}°C</Text>
            <Text style={styles.timezone}>{location.district}</Text>
          </View>
        </Card>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <HourlyWeatherList hourlyWeatherList={weather.hourly} />
        </ScrollView>

        <View style={styles.dailySection}>
          <Text style={styles.sectionTitle}>Daily Forecast</Text>
          <DailyWeatherList dailyWeatherList={weather.daily} />
        </View>
      </View>
    </ScrollView>
  )
}
