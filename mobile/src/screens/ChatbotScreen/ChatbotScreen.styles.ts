import { StyleSheet } from "react-native"

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  messagesList: {
    padding: 10,
  },
  messageContainer: {
    marginVertical: 5,
    padding: 15,
    borderRadius: 20,
    maxWidth: "80%",
  },
  userMessage: {
    backgroundColor: "tomato",
    alignSelf: "flex-end",
  },
  botMessage: {
    backgroundColor: "white",
    alignSelf: "flex-start",
  },
  userText: {
    color: "white",
  },
  botText: {
    color: "#666",
  },
  messageText: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    borderTopColor: "#eee",
    borderTopWidth: 2,
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 25,
    padding: 10,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
})
