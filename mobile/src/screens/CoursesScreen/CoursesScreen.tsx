import React, { useEffect, useState } from "react"
import { View, Text, ScrollView } from "react-native"
import { Picker } from "@react-native-picker/picker"
import { styles } from "./CoursesScreen.styles"
import { CourseList } from "./components/CourseList"
import { Course } from "../../types/course"
import { Select } from "../../components/Select"
import { useQuery } from "react-query"
import { apiClient, endpoints } from "../../api"
import { Option } from "../../types/option"
import NetInfo from "@react-native-community/netinfo"
import { getItem, setItem } from "../../utils/storage"

const MOCKED_CATEGORIES: Option[] = [
  { id: 1, name: "All categories" },
  { id: 2, name: "Agriculture" },
  { id: 3, name: "Livestock" },
  { id: 4, name: "Nutrition" },
  { id: 5, name: "Sustainability" },
]
const MOCKED_LANGUAGES: Option[] = [
  { id: 1, name: "All languages" },
  { id: 2, name: "English" },
  { id: 3, name: "Kinyarwanda" },
  { id: 4, name: "French" },
  { id: 5, name: "Swahili" },
]

export const CoursesScreen = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<Option["id"]>(1)
  const [selectedLanguageId, setSelectedLanguageId] = useState<Option["id"]>(1)
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([])

  const { data: courses } = useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const connected = (await NetInfo.fetch()).isConnected
      if (connected) {
        console.log("connnected")
        console.log(`api/${endpoints.COURSES}`)
        const { data } = await apiClient.get<Course[]>(endpoints.COURSES)
        setItem("courses", data)
        setFilteredCourses(courses)
        return data
      } else {
        console.log("not connected")
        const data = await getItem("courses")
        setFilteredCourses(courses)
        return data
      }
    },
  })

  useEffect(() => {
    setFilteredCourses(courses)
  }, [courses])

  const filterCourses = (categoryId: Option["id"], languageId: Option["id"]) => {
    let filtered = filteredCourses ?? []

    if (categoryId > 1) {
      const categoryName = MOCKED_CATEGORIES[categoryId]?.name
      filtered = filtered.filter((course) => course.category === categoryName)
      setFilteredCourses(filtered)
    }

    if (languageId > 1) {
      const languageName = MOCKED_LANGUAGES[languageId]?.name
      filtered = filtered.filter((course) => course.language === languageName)
      setFilteredCourses(filtered)
    }
    if (categoryId === 1 && languageId === 1) {
      setFilteredCourses(courses)
    }

   
  }

  const handleCategoryChange = (categoryId: Option["id"]) => {
    setSelectedCategoryId(categoryId)
    filterCourses(categoryId, selectedLanguageId)
  }

  const handleLanguageChange = (languageId: Option["id"]) => {
    setSelectedLanguageId(languageId)
    filterCourses(selectedCategoryId, languageId)
  }

  return (
    <ScrollView>
      <View style={styles.coursesScreen}>
        <View style={styles.filterContainer}>
          <Select
            selectedOption={selectedCategoryId}
            options={MOCKED_CATEGORIES}
            onOptionChange={handleCategoryChange}
          />
          <Select
            selectedOption={selectedLanguageId}
            options={MOCKED_LANGUAGES}
            onOptionChange={handleLanguageChange}
          />
        </View>

        <CourseList courses={filteredCourses} />
      </View>
    </ScrollView>
  )
}
