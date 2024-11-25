import React, { useState } from "react"
import { View, ScrollView } from "react-native"
import { Picker } from "@react-native-picker/picker"
import { Button, Card, Chip, Divider, Icon, Text } from "react-native-paper"
import { styles } from "./ArticleScreen.styles"
import { CourseList } from "./components/ArticleList"
import { Course } from "../../types/course"
import { Select } from "../../components/Select"
import { useQuery } from "react-query"
import { apiClient, endpoints } from "../../api"
import { Option } from "../../types/option"
import { useNavigation } from "@react-navigation/core"
import { Article } from "../../types/article"
import { getItem, setItem } from "../../utils/storage"
import NetInfo from "@react-native-community/netinfo"

export const ArticleScreen = () => {
  const navigation = useNavigation()

  const { data: articles } = useQuery({
    queryKey: ["articles"],
    queryFn: async () => {
      const connected = (await NetInfo.fetch()).isConnected
      if (connected) {
        console.log("connnected")
        console.log(`api/${endpoints.ARTICLES_LIST}`)
        const { data } = await apiClient.get<Article[]>(endpoints.ARTICLES_LIST)
        setItem("articles", data)
        return data
      } else {
        console.log("not connected")
        const data = getItem("articles")
        return data
      }
    },
  })

  const handlePress = (article: Article) => {
    // @ts-ignore
    navigation.navigate("ArticleDetails", {
      course: {
        id: article.id,
        title: article.title,
        description: article.description,
        miniature: article.miniature,
        attachment: article.attachment,
        category: article.category,
      },
    })
  }
  return (
    <ScrollView>
      <View style={styles.coursesScreen}>
        <Text style={styles.courseTitle}>All articles</Text>
        {articles.map((article: Article) => {
          console.log(article)
          return (
            <Card key={article.id} style={{}} mode="contained">
              <Card.Cover style={{}} source={{ uri: article.miniature }} />
              <Card.Title titleStyle={styles.courseTitle} title={article.title} />
              <Card.Content>
                <Text>{article.description}</Text>
              </Card.Content>
              <Card.Actions>
                <Button
                  onPress={() => handlePress(article)}
                  mode="outlined"
                  theme={{ colors: { outline: "tomato" } }}>
                  Read more
                </Button>
              </Card.Actions>
            </Card>
          )
        })}
      </View>
    </ScrollView>
  )
}
