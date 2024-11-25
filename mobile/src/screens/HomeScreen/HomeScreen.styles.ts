import { StyleSheet } from "react-native"

export const styles = StyleSheet.create({
  homeScreen: {
    display: "flex",
    flexDirection: "column",

    padding: 12,
  },
  card: {
    position: "relative",
    marginTop: 8,

    overflow: "hidden",
  },
  cardTitle: {
    fontWeight: "bold",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#666",
  },
  divider: {
    marginTop: 36,
    marginBottom: 20,
  },
  btn: {
    marginTop: 16,
  },
  chatbotTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 8,
  },
  courseList: {
    gap: 8,
  },
  articleImage: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderBottomWidth: 2,
    borderBottomColor: "tomato",
  },
  weatherCard: {
    marginTop: 8,
    paddingRight: 20,
  },
  weatherIcon: {
    width: 40,
    height: 40,
  },
  weatherTitle: {
    fontWeight: "bold",
  },
  weatherInfoWrapper: {
    flexDirection: "row",
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

  // weatherContent: {
  //   flex: 1,
  // },
  // weatherText: {
  //   fontSize: 16,
  //   color: "#555",
  //   marginBottom: 5,
  // },
  // marketItem: {
  //   flexDirection: "row",
  //   justifyContent: "space-between",
  //   marginBottom: 10,
  // },
  // marketText: {
  //   fontSize: 16,
  //   color: "#555",
  // },
  // trendText: {
  //   fontSize: 16,
  // },
})
