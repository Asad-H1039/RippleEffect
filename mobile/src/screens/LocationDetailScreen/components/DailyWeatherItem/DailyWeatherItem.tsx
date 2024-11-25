import { Image, View } from "react-native"
import { Card, Icon, Text } from "react-native-paper"
import { WeatherDaily } from "../../../../types/weather"
import { styles } from "./DailyWeatherItem.styles"
import { format } from "date-fns"
import { WEATHER_ICONS } from "../../../../constants/weatherIcons"

type DailyWeatherItemProps = {
  dailyWeather: WeatherDaily
}

export const DailyWeatherItem = ({ dailyWeather }: DailyWeatherItemProps) => {
  return (
    <Card style={styles.dailyItem} mode="contained">
      <Card.Title
        title={format(new Date(dailyWeather.dt * 1000), "eeee")}
        titleStyle={styles.title}
        subtitle={format(new Date(dailyWeather.dt * 1000), "dd.MM")}
        left={() => (
          <Image style={styles.icon} source={WEATHER_ICONS[dailyWeather.weather[0].main]} />
        )}
        right={({ size }) => (
          <View style={styles.temperaturesWrapper}>
            <View style={styles.temperatureContainer}>
              <Icon size={size} color="#ADD8E6" source="thermometer-low" />
              <Text style={styles.minColor}>{Math.round(dailyWeather.temp.min)}°C</Text>
            </View>
            <View style={styles.temperatureContainer}>
              <Icon size={size} color="#FF7F7F" source="thermometer-high" />
              <Text style={styles.maxColor}>{Math.round(dailyWeather.temp.max)}°C</Text>
            </View>
          </View>
        )}
      />
    </Card>
  )
}
