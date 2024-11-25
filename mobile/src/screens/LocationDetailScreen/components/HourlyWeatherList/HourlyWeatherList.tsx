import { View } from "react-native"
import { WeatherHourly } from "../../../../types/weather"
import { HourlyWeatherItem } from "../HourlyWeatherItem"
import { styles } from "./HourlyWeatherList.styles"

type HourlyWeatherListProps = {
  hourlyWeatherList: WeatherHourly[]
}

export const HourlyWeatherList = ({ hourlyWeatherList }: HourlyWeatherListProps) => {
  return (
    <View style={styles.hourlyWeatherList}>
      {hourlyWeatherList.map((hourlyWeather) => (
        <HourlyWeatherItem key={hourlyWeather.dt} hourlyWeather={hourlyWeather} />
      ))}
    </View>
  )
}
