import { StyleSheet } from "react-native"

export const styles = StyleSheet.create({
  thumbnail: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  title: {
    fontWeight: "bold",
  },
  subtitle: {
    color: "tomato",
  },
  footer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    width: "100%",
    marginTop: 16,
  },
  fileTypeContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
})
