import { useNavigation } from "@react-navigation/native"
import { Card, IconButton, Text } from "react-native-paper"
import { styles } from "./LocationItem.styles"
import { Image } from "react-native"
import { WEATHER_ICONS } from "../../../../constants/weatherIcons"
import { Weather } from "../../../../types/weather"

type LocationItemProps = {
  location: Weather
}

export const LocationItem = ({ location }: LocationItemProps) => {
  const navigation = useNavigation()

  const {
    district,
    weather: { current },
  } = location

  const showAlert = Math.round(current.temp) >= 34
  const subtitle = showAlert
    ? `${Math.round(current.temp)}°C - Very high temerature warning`
    : `${Math.round(current.temp)}°C`

  const handlePress = () => {
    // @ts-ignore
    navigation.navigate("LocationDetails", { location })
  }

  return (
    <Card mode="contained">
      <Card.Title
        titleStyle={styles.title}
        title={district}
        subtitle={subtitle}
        subtitleStyle={showAlert && styles.subtitle}
        left={() => <Image style={styles.icon} source={WEATHER_ICONS[current.weather[0].main]} />}
        right={({ size }) => <IconButton size={size} icon="chevron-right" onPress={handlePress} />}
      />
    </Card>
  )
}
