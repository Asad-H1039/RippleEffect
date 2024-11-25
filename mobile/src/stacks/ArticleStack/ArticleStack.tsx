import { createStackNavigator } from "@react-navigation/stack"
import { ArticleScreen } from "../../screens/ArticleScreen"
import { ArticleDetailScreen } from "../../screens/ArticleDetailScreen"

const Stack = createStackNavigator()

export const ArticleStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ArticleMain" component={ArticleScreen} />
      <Stack.Screen name="ArticleDetails" component={ArticleDetailScreen} />
    </Stack.Navigator>
  )
}
