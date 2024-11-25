import { View } from "react-native"
import { LocationItem } from "../LocationItem"
import { styles } from "./LocationList.styles"
import { Weather } from "../../../../types/weather"
import { ScrollView } from "react-native-gesture-handler"

type LocationListProps = {
  locations: Weather[]
}

export const LocationList = ({ locations }: LocationListProps) => {
  return (
    <ScrollView>
      <View style={styles.locationList}>
        {locations.map((location) => (
          <LocationItem key={location.district} location={location} />
        ))}
      </View>
    </ScrollView>
  )
}
