import { StyleSheet } from "react-native"

export const styles = StyleSheet.create({
  locationDetailScreen: {
    display: "flex",
    flexDirection: "column",
    gap: 16,

    padding: 12,
  },
  currentCard: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",

    padding: 30,
  },
  temperature: {
    marginTop: 8,

    fontSize: 24,
    fontWeight: "bold",
  },
  timezone: {
    height: 20,
  },
  icon: {
    width: 100,
    height: 100,
  },
  sectionTitle: {
    fontSize: 20,
    marginBottom: 10,
    color: "#333",
  },
  dailySection: {
    marginTop: 20,
  },
})
