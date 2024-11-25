import { StyleSheet } from "react-native"
import { useTheme } from "react-native-paper"

export const useStyles = () => {
  const theme = useTheme()

  return StyleSheet.create({
    select: {
      color: "#666",
      backgroundColor: theme.colors.surfaceVariant,

      borderRadius: theme.roundness,
    },
  })
}
