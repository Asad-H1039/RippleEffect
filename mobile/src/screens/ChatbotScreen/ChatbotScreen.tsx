import { useState } from "react"
import { apiClient, endpoints } from "../../api"
import { View, Text, TextInput, FlatList, ActivityIndicator, Keyboard } from "react-native"
import { styles } from "./ChatbotScreen.styles"
import { Card, IconButton } from "react-native-paper"

export const ChatbotScreen = () => {
  const [messages, setMessages] = useState<any[]>([])
  const [inputText, setInputText] = useState("")
  const [loading, setLoading] = useState(false)

  const sendMessage = async () => {
    Keyboard.dismiss()

    if (inputText.trim().length > 0) {
      const newMessage = {
        id: `${new Date().getTime()}`,
        text: inputText,
        sender: "user",
      }
      setMessages([...messages, newMessage])
      setInputText("")
      setLoading(true)

      try {
        console.log(`api/${endpoints.CHATBOT} ${{ question: inputText }}`)
        const response = await apiClient.post(endpoints.CHATBOT, { question: inputText })
        const responseMessage = {
          id: `${new Date().getTime() + 1}`,
          text: response.data,
          sender: "bot",
        }
      
        setMessages((prevMessages) => [...prevMessages, responseMessage])
      } catch (error) {
        console.log(error)
        const errorMessage = {
          id: `${new Date().getTime() + 2}`,
          text: "Sorry, I couldn't process your request. Please try again later.",
          sender: "bot",
        }
        setMessages((prevMessages) => [...prevMessages, errorMessage])
      } finally {
        setLoading(false)
      }
    }
  }

  const renderItem = ({ item }: { item: any }) => {

    return (
      <Card
        style={[
          styles.messageContainer,
          item.sender === "user" ? styles.userMessage : styles.botMessage,
        ]}>
        <Text
          style={[styles.messageText, item.sender === "user" ? styles.userText : styles.botText]}>
          {item.text}
        </Text>
      </Card>
    )
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesList}
      />
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type your message..."
          placeholderTextColor="#888"
        />

        <IconButton iconColor="tomato" size={30} icon="send" onPress={sendMessage} />
      </View>
    </View>
  )
}
