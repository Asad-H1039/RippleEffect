import React, { useEffect } from "react"
import { View, Image, AppState, Text } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { getItem } from "../../utils/storage"
import { apiClient, endpoints } from "../../api"

export default function SplashScreen() {
  const navigation = useNavigation()

  // const user = await getItem('user')

  const verify = async () => {
    const token = await getItem("tokens")
    // const user = await getItem('user')
    if (token) {
      console.log(token)
      try {
        // data.username = data.username.toLowerCase()
        // console.log('try',endpoints.VERIFY_TOKEN, JSON.parse(token).access)
        // const response = await apiClient.post(endpoints.VERIFY_TOKEN, { token: JSON.parse(token).access })
        // console.log(response.data)
        // setItem("tokens", JSON.stringify(response.data))
        navigation.replace("Secure Routes")
      } catch (error) {
        console.log(error)
        navigation.replace('Login')
      }
    } else {
      navigation.replace('Login')
    }


  }

  useEffect(() => {
    verify()
  }, [])

  return (
    <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
      {/* <Image source={splashLogo} style={{ height: 200 }} resizeMode="contain" /> */}
    </View>
  )
}
