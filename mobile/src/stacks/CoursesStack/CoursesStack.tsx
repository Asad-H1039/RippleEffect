import { createStackNavigator } from "@react-navigation/stack"
import { CoursesScreen } from "../../screens/CoursesScreen"
import { CourseDetailScreen } from "../../screens/CourseDetailScreen"

const Stack = createStackNavigator()

export const CoursesStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CoursesMain" component={CoursesScreen} />
      <Stack.Screen name="CourseDetail" component={CourseDetailScreen} />
    </Stack.Navigator>
  )
}
