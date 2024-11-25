import React, { useState, useRef, useEffect } from "react"
import {
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  Linking,
  Platform,
  View,
} from "react-native"
import { useRoute } from "@react-navigation/native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import * as FileSystem from "expo-file-system"
import * as IntentLauncher from "expo-intent-launcher"
import { Video } from "expo-av"
import { Button, Card, Text } from "react-native-paper"
import { Course } from "../../types/course"
import { useQuery } from "react-query"
import NetInfo from "@react-native-community/netinfo"
import { apiClient, endpoints } from "../../api"
import { setItem } from "../../utils/storage"
import { Article } from "../../types/article"

export const ArticleDetailScreen = ({navigation}:any) => {
  const { data: relatedArticles } = useQuery({
    queryKey: ["relatedArticles"],
    queryFn: async () => {
      const connected = (await NetInfo.fetch()).isConnected
      if (connected) {
        console.log("connnected")
        console.log(`api/${endpoints.ARTICLES_BY_CATEGORY_ID}${course.id}/`)
        const { data } = await apiClient.get<Article[]>(`${endpoints.ARTICLES_BY_CATEGORY_ID}${course.id}/`)
        setItem("articles", data)
        return data
      }
    },
  })

  const route = useRoute()
  // @ts-ignore
  const { course }: { course: Course } = route.params
  const [isContentStarted, setIsContentStarted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [playbackStatus, setPlaybackStatus] = useState({})
  const [playbackPosition, setPlaybackPosition] = useState(0)
  const [fileUri, setFileUri] = useState(null)
  const videoUrl =
    "https://zero-hunger-hackaton.s3.eu-west-2.amazonaws.com/media/small_farm_step_by_step.mp4"
  const pdfUrl =
    "https://zero-hunger-hackaton.s3.eu-west-2.amazonaws.com/media/Avocado+growing+training+module.pdf"
  const videoRef = useRef(null)
  console.log(course)
  useEffect(() => {
    const loadPlaybackPosition = async () => {
      try {
        const position = await AsyncStorage.getItem(`playbackPosition_${course.id}`)
        if (position !== null) {
          setPlaybackPosition(parseInt(position, 10))
        }
      } catch (error) {
        console.error("Error loading playback position:", error)
      }
    }

    const loadFileUri = async () => {
      try {
        const storedFileUri = await AsyncStorage.getItem(`fileUri_${course.id}`)
        if (storedFileUri) {
          setFileUri(storedFileUri)
        }
      } catch (error) {
        console.error("Error loading stored file URI:", error)
      }
    }

    loadPlaybackPosition()
    loadFileUri()
  }, [course.id])

  const handleStartCourse = async () => {
    setLoading(true)

    try {
      if (course.attachment_extension === ".mp4" && videoRef.current && playbackPosition > 0) {
        // @ts-ignore
        await videoRef.current.setPositionAsync(playbackPosition)
      } else if (course.attachment_extension === ".pdf") {
        if (fileUri) {
          openPdf(fileUri)
        } else {
          await downloadAndOpenPdf()
        }
      }

      setIsContentStarted(true)
    } catch (error) {
      console.error("Error starting course:", error)
    } finally {
      setLoading(false)
    }
  }

  const downloadAndOpenPdf = async () => {
    try {
      console.log(course.attachment)
      const filename = course.attachment.split("/").pop()
      const fileUri = `${FileSystem.documentDirectory}${filename}`
      const { uri } = await FileSystem.downloadAsync(course.attachment, fileUri)
      await AsyncStorage.setItem(`fileUri_${course.id}`, uri)
      setFileUri(uri)
      openPdf(uri)
    } catch (error) {
      console.error("Error downloading or opening the PDF file:", error)
    }
  }

  const openPdf = async (uri) => {
    try {
      if (Platform.OS === "android") {
        const contentUri = await FileSystem.getContentUriAsync(uri)
        IntentLauncher.startActivityAsync("android.intent.action.VIEW", {
          data: contentUri,
          flags: 1,
          type: "application/pdf",
        })
      } else {
        Linking.openURL(uri)
      }
    } catch (error) {
      console.error("Error opening the PDF file:", error)
    }
  }

  const handlePlaybackStatusUpdate = async (status) => {
    setPlaybackStatus(status)

    if (status.isLoaded && status.positionMillis != null) {
      try {
        await AsyncStorage.setItem(
          `playbackPosition_${course.id}`,
          status.positionMillis.toString()
        )
      } catch (error) {
        console.error("Error saving playback position:", error)
      }
    }

    if (status.didJustFinish) {
      console.log("Video has finished playing")
      // Notify that the video has finished
    }

    if (status.isLoaded && status.positionMillis != null && status.durationMillis != null) {
      const percentageWatched = (status.positionMillis / status.durationMillis) * 100
      console.log(`Video watched: ${percentageWatched.toFixed(2)}%`)
      // Notify how much % watched
    }
  }

  const handlePress = (article: Article) => {
    // @ts-ignore
    navigation.navigate("ArticleDetails", {
      course: {
        id: article.id,
        title: article.title,
        description: article.description,
        miniature: article.miniature,
        attachment: article.attachment,
      },
    })
  }

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: course.miniature }} style={styles.thumbnail} />
      <Text style={styles.title}>{course.title}</Text>
      {/* <Text style={styles.detail}>Category: {course.category}</Text> */}
      {/* <Text style={styles.detail}>Language: {course.language}</Text> */}
      <Text style={styles.description}>{course.description}</Text>
      <Button
        style={styles.btn}
        mode="contained"
        disabled={!course.attachment}
        onPress={() => {
          downloadAndOpenPdf()
          // @ts-ignore
          // clearStorage()
          // navigation.replace("Login")
        }}>
        Download PDF
      </Button>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : // <Button style={styles.startReading} mode="contained" onPress={handleStartCourse}>
      //   {course.attachment_extension === ".mp4"
      //     ? "Start Watching Course"
      //     : fileUri
      //       ? "Open Downloaded Course"
      //       : "Start Reading Course"}
      // </Button>
      null}
      <Text style={styles.title}>Related Articles</Text>
      <View style={styles.coursesScreen}>
       
        {relatedArticles?.map((article: Article) => {
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

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
    padding: 12,
  },
  thumbnail: {
    width: "100%",
    height: 200,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 8,
  },
  btn: {
    marginTop: 16,
  },
  description: {
    fontSize: 16,
    marginTop: 16,
    marginBottom: 24,
  },
  detail: {
    fontSize: 16,
    marginBottom: 8,
  },
  videoContainer: {
    marginTop: 20,
    marginBottom: 20,
    paddingBottom: 20,
  },
  video: {
    width: "100%",
    height: 300,
    backgroundColor: "black",
  },
  startReading: {
    marginBottom: 40,
  },
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
