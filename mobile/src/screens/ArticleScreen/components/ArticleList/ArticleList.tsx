import { View } from "react-native"
import { styles } from "./ArticleList.styles"
import { ArticleItem } from "../ArticleItem"
import { Course } from "../../../../types/course"

type CourseListProps = {
  courses: Course[]
}

export const CourseList = ({ courses }: CourseListProps) => {
  return (
    <View style={styles.courseList}>
      {courses.map((course) => (
        <ArticleItem key={course.id} course={course} />
      ))}
    </View>
  )
}
