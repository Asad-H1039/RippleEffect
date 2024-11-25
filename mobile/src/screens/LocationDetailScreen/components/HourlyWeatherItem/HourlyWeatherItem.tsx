import { Image, View } from "react-native"
import { styles } from "./HourlyWeatherItem.styles"
import { WeatherHourly } from "../../../../types/weather"
import { WEATHER_ICONS } from "../../../../constants/weatherIcons"
import { Text } from "react-native-paper"
import { format } from "date-fns"

type HourlyWeatherItemProps = {
  hourlyWeather: WeatherHourly
}

export const HourlyWeatherItem = ({ hourlyWeather }: HourlyWeatherItemProps) => {
  return (
    <View style={styles.hourlyWeatherItem}>
      <Text>{format(new Date(hourlyWeather.dt * 1000), "HH")}</Text>
      <Image style={styles.icon} source={WEATHER_ICONS[hourlyWeather.weather[0].main]} />
      <Text>{Math.round(hourlyWeather.temp)}°C</Text>
    </View>
  )
}
