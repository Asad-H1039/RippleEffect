import { StyleSheet } from "react-native"

export const styles = StyleSheet.create({
  coursesScreen: {
    display: "flex",
    flexDirection: "column",
    gap: 16,

    padding: 12,
  },
  filterContainer: {
    gap: 8,
  },
  picker: {
    height: 50,
    width: "100%",
  },
  courseDetails: {
    flex: 1,
    padding: 10,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
})
