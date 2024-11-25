import React, { useState, useEffect } from "react"
import {
  View,
  Image,
  Text,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Dimensions,
} from "react-native"
import { Input, Spinner } from "../../components/common"
import { white, primary, grey, black, lightGrey, buttonGradient } from "../../utils/colors"
import styles from "./LoginScreen.style"
import { useForm } from "react-hook-form"
import { useNavigation } from "@react-navigation/native"

import FlatButton from "../../components/common/FlatButton"
import { apiClient, endpoints } from "../../api"
import { setItem } from "../../utils/storage"
import notifyMessage from "../../utils/notification"

export default function LoginScreen() {
  const { control, handleSubmit } = useForm()
  const navigation = useNavigation()

  const [toggleCheckBox, setToggleCheckBox] = useState(false)

  const [loading, setLoading] = useState(false)

  const onSubmit = async (data, err) => {
    setLoading(true)

    try {
      data.username = data.username.toLowerCase()
      console.log(endpoints.LOGIN, data)
      const response = await apiClient.post(endpoints.LOGIN, data)
      console.log(response)
      if (response.status === 200) {
        setItem("tokens", JSON.stringify(response.data))
        navigation.replace("Secure Routes")
      } 
    } catch (error) {
      notifyMessage("Email or Password is incorrect")
      console.log(error)
    }

    setLoading(false)
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{ height: Dimensions.get("screen").height - 100 }}
        style={{ flex: 1, backgroundColor: white }}
        keyboardShouldPersistTaps="always">
        <Spinner visible={loading} color={primary} />
        <View style={styles.gradientScreen}>
          {/* <Image source={backgroundLogo} style={styles.backgroundLogo} /> */}
          <View
            style={{
              height: "40%",
              width: "100%",
              paddingTop: 50,
              fontWeight: "700",
              alignItems: "center",
              marginBottom: 28,
              justifyContent: "center",
            }}>
            {/* <Image source={logo} style={{ height: 120 }} resizeMode='contain' /> */}
            <Text
              style={{
                textAlign: "center",
                fontSize: 24,
                color: black,
                marginTop: 32,
              }}>
              Sign In
            </Text>
            <Text
              style={{
                textAlign: "center",
                fontSize: 14,
                color: black,
                marginTop: 12,
              }}>
              Please enter your credentials
            </Text>
          </View>

          <View style={{ width: "100%", height: "20%" }}>
            <Input
              isAnimated
              control={control}
              placeholder={"Email"}
              name="username"
              keyboardType="email-address"
              initialColor={lightGrey}
              finalColor={primary}
              required
              toolTipText="Please input valid Email"
            />
            <Input
              isAnimated
              control={control}
              placeholder={"Password"}
              name="password"
              keyboardType="default"
              isPassword
              initialColor={lightGrey}
              finalColor={primary}
              required
              toolTipText=""
            />
          </View>
          <FlatButton
            style={styles.loginButton}
            onPress={handleSubmit(onSubmit)}
            label={"Log In"}
            textColor={"#fff"}
          />
          <Text
            style={{
              marginBottom: 8,
              color: black,
              textAlign: "center",
            }}>
            {"Forgot your Password?" + " "}
            <Text
              style={{ textDecorationLine: "underline", color: black }}
              onPress={() => {
                navigation.navigate("Forget Pwd")
              }}>
              Click here
            </Text>
          </Text>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Signup")
            }}>
            <Text
              style={{
                textAlign: "center",
                fontSize: 14,
                color: black,
                textDecorationLine: "underline",
                marginTop: 12,
              }}>
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
