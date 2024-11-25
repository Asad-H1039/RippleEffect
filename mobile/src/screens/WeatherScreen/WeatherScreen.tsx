import React, { useState } from "react"
import { View, SafeAreaView, StyleSheet, ScrollView } from "react-native"
import { MapTab } from "./components/MapTab"
import { LocationsTab } from "./components/LocationsTab"
import { SegmentedButtons } from "react-native-paper"
import { styles } from "./WeatherScreen.styles"

export const WeatherScreen = () => {
  const [selectedTab, setSelectedTab] = useState("locations")

  return (
    <View style={styles.weatherScreen}>
      <SafeAreaView style={styles.safeArea}>
        <SegmentedButtons
          value={selectedTab}
          onValueChange={setSelectedTab}
          theme={{ colors: { onSurface: "tomato", outline: "tomato" } }}
          buttons={[
            {
              value: "locations",
              label: "My locations",
              icon: "map-marker-multiple",
            },
            {
              value: "map",
              label: "Map",
              icon: "map",
            },
          ]}
        />
      </SafeAreaView>
      {selectedTab === "locations" ? <LocationsTab /> : <MapTab />}
    </View>
  )
}
