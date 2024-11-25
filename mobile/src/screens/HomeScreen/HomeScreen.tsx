import { View, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions } from "react-native"
import { Button, Card, Chip, Divider, Icon, Text } from "react-native-paper"
import { styles } from "./HomeScreen.styles"
import { useQuery } from "react-query"
import { apiClient, endpoints } from "../../api"
import { Course } from "../../types/course"
import { CourseItem } from "../CoursesScreen/components/CourseItem"
import { useNavigation } from "@react-navigation/native"
import { Weather } from "../../types/weather"
import { generateEndpoint } from "../../utils/generateEndpoint"
import { WEATHER_ICONS } from "../../constants/weatherIcons"
import { format } from "date-fns"
import { Article } from "../../types/article"
import NetInfo from "@react-native-community/netinfo"
import { clearStorage, getItem, setItem } from "../../utils/storage"

export const HomeScreen = ({ navigation }: any) => {
  const { data: articles } = useQuery({
    queryKey: ["articles"],
    queryFn: async () => {
      const connected = (await NetInfo.fetch()).isConnected
      if (connected) {
        console.log("connnected")
        console.log(`api/${endpoints.FEATURED_ARTICLES_LIST}`)
        const { data } = await apiClient.get<Article[]>(endpoints.FEATURED_ARTICLES_LIST)
        setItem("featuredArticles", data)
        return data
      } else {
        console.log("not connected")
        const data = getItem("featuredArticles")
        return data
      }
    },
  })

  const { data: courses } = useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const connected = (await NetInfo.fetch()).isConnected
      if (connected) {
        console.log("connnected")
        console.log(`api/${endpoints.COURSES}`)
        const { data } = await apiClient.get<Course[]>(endpoints.COURSES)
        setItem("courses", data)
        return data
      } else {
        console.log("not connected")
        const data = getItem("courses")
        return data
      }
    },
  })
  // const { data: dailyWeatherList } = useQuery({
  //   queryKey: ["weathers", 1],
  //   queryFn: async () => {
  //     console.log(`api/${endpoints.DISTRICT_WEATHER_DETAIL}${{ id: 1 }}`)
  //     const { data } = await apiClient.get<Weather>(
  //       generateEndpoint(endpoints.DISTRICT_WEATHER_DETAIL, { id: 1 })
  //     )

  //     return data.weather.daily.slice(undefined, 3)
  //   },
  // })

  return (
    <ScrollView>
      <View style={styles.homeScreen}>
        <Text style={styles.sectionTitle}>Featured articles</Text>
        {articles?.map((article) => (
          <Card key={article.id} style={styles.card} mode="contained">
            <Card.Cover style={styles.articleImage} source={{ uri: article.miniature }} />
            <Card.Title titleStyle={styles.cardTitle} title={article.title} />
            <Card.Content>
              <Text>{article.description}</Text>
            </Card.Content>
            <Card.Actions>
              <Button mode="outlined" theme={{ colors: { outline: "tomato" } }}>
                Read more
              </Button>
            </Card.Actions>
          </Card>
        ))}

        <Divider style={styles.divider} />

        <Text style={styles.chatbotTitle}>Meet Our Chatbot</Text>
        <Text variant="bodyMedium">
          Our friendly chatbot is here to help you with general knowledge, courses available in the
          app, weather updates, and market prices. Get quick answers and stay informed with the
          latest agricultural trends.
        </Text>
        <Button
          style={styles.btn}
          mode="contained"
          onPress={() => {
            // @ts-ignore
            navigation.navigate("ChatBot")
          }}>
          Try it!
        </Button>

        <Divider style={styles.divider} />

        <View style={styles.courseList}>
          <Text style={styles.sectionTitle}>Courses</Text>
          {courses
            ?.slice(undefined, 2)
            .map((course) => <CourseItem key={course.id} course={course} btnMode="outlined" />)}
        </View>

        <Divider style={styles.divider} />

        {/* <Text style={styles.sectionTitle}>Weather Report</Text> */}
        {/* {dailyWeatherList?.map((dailyWeather) => (
          <Card key={dailyWeather.dt} style={styles.weatherCard} mode="contained">
            <Card.Title
              title={format(new Date(dailyWeather.dt * 1000), "eeee")}
              titleStyle={styles.weatherTitle}
              subtitle={format(new Date(dailyWeather.dt * 1000), "dd.MM")}
              left={() => (
                <Image
                  style={styles.weatherIcon}
                  source={WEATHER_ICONS[dailyWeather.weather[0].main]}
                />
              )}
              right={({ size }) => (
                <View style={styles.weatherInfoWrapper}>
                  <View style={styles.temperatureContainer}>
                    <Icon size={size} color="#ADD8E6" source="thermometer-low" />
                    <Text style={styles.minColor}>{Math.round(dailyWeather.temp.min)}°C</Text>
                  </View>
                  <View style={styles.temperatureContainer}>
                    <Icon size={size} color="#FF7F7F" source="thermometer-high" />
                    <Text style={styles.maxColor}>{Math.round(dailyWeather.temp.max)}°C</Text>
                  </View>
                </View>
              )}
            />
          </Card>
        ))} */}

        {/* <Divider style={styles.divider} /> */}
        {/*
        <Text style={styles.sectionTitle}>Market Prices</Text>
        <Card style={styles.card} mode="contained">
          {marketPrices.map((item) => (
            <View key={item.id} style={styles.marketItem}>
              <Text style={styles.marketText}>{item.name}</Text>
              <Text style={styles.marketText}>{item.price}</Text>
              <Text style={styles.trendText}>
                {item.trend === "up" && "⬆️"}
                {item.trend === "down" && "⬇️"}
                {item.trend === "stable" && "➡️"}
              </Text>
            </View>
          ))}
        </Card> */}
        <Button
          style={styles.btn}
          mode="contained"
          onPress={() => {
            // @ts-ignore
            clearStorage()
            navigation.replace("Login")
          }}>
          Logout
        </Button>
      </View>
    </ScrollView>
  )
}
