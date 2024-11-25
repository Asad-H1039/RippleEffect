import { StyleSheet } from "react-native"

export const styles = StyleSheet.create({
  dailyItem: { paddingRight: 20 },
  title: {
    fontWeight: "bold",
  },
  icon: {
    width: 40,
    height: 40,
  },
  temperaturesWrapper: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  temperatureContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 0,
  },
  minColor: {
    color: "#ADD8E6",
  },
  maxColor: {
    color: "#FF7F7F",
  },
})
