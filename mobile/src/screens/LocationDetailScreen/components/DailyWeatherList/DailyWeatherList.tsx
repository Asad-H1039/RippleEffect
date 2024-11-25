import { View } from "react-native"
import { WeatherDaily } from "../../../../types/weather"
import { DailyWeatherItem } from "../DailyWeatherItem"
import { styles } from "./DailyWeatherList.styles"

type DailyWeatherListProps = {
  dailyWeatherList: WeatherDaily[]
}

export const DailyWeatherList = ({ dailyWeatherList }: DailyWeatherListProps) => {
  return (
    <View style={styles.dailyWeatherList}>
      {dailyWeatherList.map((dailyWeather) => (
        <DailyWeatherItem key={dailyWeather.dt} dailyWeather={dailyWeather} />
      ))}
    </View>
  )
}
