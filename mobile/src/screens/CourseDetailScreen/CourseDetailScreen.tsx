import React, { useState, useRef, useEffect } from "react";
import { StyleSheet, ScrollView, Image, ActivityIndicator, Linking, Platform, View } from "react-native";
import { useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";
import * as IntentLauncher from "expo-intent-launcher";
import { Video } from "expo-av";
import { Button, Text } from "react-native-paper";
import { Course } from "../../types/course";

export const CourseDetailScreen = () => {
  const route = useRoute();
  // @ts-ignore
  const { course }: { course: Course } = route.params;
  const [isContentStarted, setIsContentStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [playbackStatus, setPlaybackStatus] = useState({});
  const [playbackPosition, setPlaybackPosition] = useState(0);
  const [fileUri, setFileUri] = useState(null);
  const videoUrl =
    "https://zero-hunger-hackaton.s3.eu-west-2.amazonaws.com/media/small_farm_step_by_step.mp4";
  const pdfUrl =
    "https://zero-hunger-hackaton.s3.eu-west-2.amazonaws.com/media/Avocado+growing+training+module.pdf";
  const videoRef = useRef(null);

  useEffect(() => {
    const loadPlaybackPosition = async () => {
      try {
        const position = await AsyncStorage.getItem(`playbackPosition_${course.id}`);
        if (position !== null) {
          setPlaybackPosition(parseInt(position, 10));
        }
      } catch (error) {
        console.error("Error loading playback position:", error);
      }
    };

    const loadFileUri = async () => {
      try {
        const storedFileUri = await AsyncStorage.getItem(`fileUri_${course.id}`);
        if (storedFileUri) {
          setFileUri(storedFileUri);
        }
      } catch (error) {
        console.error("Error loading stored file URI:", error);
      }
    };

    loadPlaybackPosition();
    loadFileUri();
  }, [course.id]);

  const handleStartCourse = async () => {
    setLoading(true);


    try {
      if (course.attachment_extension === ".mp4" && videoRef.current && playbackPosition > 0) {
        // @ts-ignore
        await videoRef.current.setPositionAsync(playbackPosition);
      } else if (course.attachment_extension === ".pdf") {
        if (fileUri) {
          openPdf(fileUri);
        } else {
          await downloadAndOpenPdf();
        }
      }

      setIsContentStarted(true);
    } catch (error) {
      console.error("Error starting course:", error);
    } finally {
      setLoading(false);
    }
  };

  const downloadAndOpenPdf = async () => {
    try {
      const filename = course.attachment.split("/").pop();
      const fileUri = `${FileSystem.documentDirectory}${filename}`;
      const { uri } = await FileSystem.downloadAsync(course.attachment, fileUri);
      await AsyncStorage.setItem(`fileUri_${course.id}`, uri);
      setFileUri(uri);
      openPdf(uri);
    } catch (error) {
      console.error("Error downloading or opening the PDF file:", error);
    }
  };

  const openPdf = async (uri) => {
    try {
      if (Platform.OS === "android") {
        const contentUri = await FileSystem.getContentUriAsync(uri);
        IntentLauncher.startActivityAsync("android.intent.action.VIEW", {
          data: contentUri,
          flags: 1,
          type: "application/pdf",
        });
      } else {
        Linking.openURL(uri);
      }
    } catch (error) {
      console.error("Error opening the PDF file:", error);
    }
  };

  const handlePlaybackStatusUpdate = async (status) => {
    setPlaybackStatus(status);

    if (status.isLoaded && status.positionMillis != null) {
      try {
        await AsyncStorage.setItem(
          `playbackPosition_${course.id}`,
          status.positionMillis.toString()
        );
      } catch (error) {
        console.error("Error saving playback position:", error);
      }
    }

    if (status.didJustFinish) {
      console.log("Video has finished playing");
      // Notify that the video has finished
    }

    if (status.isLoaded && status.positionMillis != null && status.durationMillis != null) {
      const percentageWatched = (status.positionMillis / status.durationMillis) * 100;
      console.log(`Video watched: ${percentageWatched.toFixed(2)}%`);
      // Notify how much % watched
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: course.miniature }} style={styles.thumbnail} />
      <Text style={styles.title}>{course.name}</Text>
      <Text style={styles.detail}>Category: {course.category}</Text>
      <Text style={styles.detail}>Language: {course.language}</Text>
      <Text style={styles.description}>
        {course.description}
      </Text>
      {/* {course.attachment_extension === ".mp4" 
      ? <Text style={styles.detail}>Duration: 06:56</Text>
      : <Text>''</Text>
      } */}
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button style={styles.startReading} mode="contained" onPress={handleStartCourse}>
          {course.attachment_extension === ".mp4"
            ? "Start Watching Course"
            : fileUri
            ? "Open Downloaded Course"
            : "Start Reading Course"}
        </Button>
      )}
      {isContentStarted && course.attachment_extension === ".mp4" && (
        <View style={styles.videoContainer}>
          <Video
            ref={videoRef}
            source={{ uri: course.attachment }}
            style={styles.video}
            useNativeControls
            resizeMode="contain"
            onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
          />
        </View>
      )}
    </ScrollView>
  );
};

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
    marginBottom: 8,
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
    paddingBottom: 20
  },
  video: {
    width: "100%",
    height: 300,
    backgroundColor: "black",
  },
  startReading: {
    marginBottom: 40
  }
});
