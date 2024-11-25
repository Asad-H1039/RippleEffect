import { Button, Card, Icon, Text } from "react-native-paper"
import { Course } from "../../../../types/course"
import { useNavigation } from "@react-navigation/core"
import { styles } from "./CourseItem.styles"
import { View } from "react-native"

type CourseItemProps = {
  course: Course

  btnMode?: "contained" | "outlined"
}

export const CourseItem = ({ course, btnMode = "contained" }: CourseItemProps) => {
  const navigation = useNavigation()

  const { name, miniature, language, category, attachment_extension } = course

  const handlePress = () => {
    // @ts-ignore
    navigation.navigate("CourseDetail", { course })
  }

  return (
    <Card mode="contained">
      <Card.Cover style={styles.thumbnail} source={{ uri: miniature }} />
      <Card.Title
        titleStyle={styles.title}
        title={name}
        subtitle={`${category} | ${language}`}
        subtitleStyle={styles.subtitle}
      />
      <Card.Content>
        <Text>{course.description}</Text>

        <View style={styles.footer}>
          <View style={styles.fileTypeContainer}>
            <Icon
              size={20}
              color="gray"
              source={attachment_extension === ".pdf" ? "file-document-outline" : "video-outline"}
            />
            <Text>{attachment_extension === ".pdf" ? "PDF" : "Video"}</Text>
          </View>

          <Button mode={btnMode} theme={{ colors: { outline: "tomato" } }} onPress={handlePress}>
            Go to course
          </Button>
        </View>
      </Card.Content>
    </Card>
  )
}
