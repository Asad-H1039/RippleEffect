import { StyleSheet } from "react-native"
import { primary, white } from "../../utils/colors"

const styles = StyleSheet.create({
  mainTitle: {
    fontSize: 40,
    fontWeight: "700",
    marginTop: 20,
    fontWeight: "700",

    color: "#000",
  },
  screenContainer: {
    alignItems: "center",
    flexGrow: 1,
    justifyContent: "center",
    backgroundColor: white,
  },
  gradientScreen: {
    height: "100%",
    width: "100%",
    paddingLeft: 40,
    paddingRight: 40,
    backgroundColor: white,
  },
  backgroundLogo: {
    position: "absolute",
    top: "15%",
    right: 0,
    tintColor: "#000",
  },
  loginButton: {
    borderWidth: 1,
    borderColor: "#FFF",
    fontWeight: "700",

    width: "100%",
    marginVertical: 16,
  },
  textButton: { color: "#fff", fontSize: 14, fontWeight: "700", marginTop: 20, fontWeight: "700" },
})

export default styles
