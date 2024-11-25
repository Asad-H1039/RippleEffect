import React, { useEffect, useState } from "react"
import { View, ScrollView, KeyboardAvoidingView, TouchableOpacity, Image, Text } from "react-native"

import { useForm } from "react-hook-form"

import notifyMessage from "../../utils/notification"
import { Input, Spinner } from "../../components/common"

import { blue, buttonGradient, lightGrey, primary, white } from "../../utils/colors"

import arrow_left from "../../assets/arrow_left.png"

import styles from "./ForgotPasword.styles"

import { Validate } from "../../utils/validator"

import Header from "../../components/common/Header"
import FlatButton from "../../components/common/FlatButton"
import { apiClient, endpoints } from "../../api"

export default function ForgotPassword2({ navigation, route }) {
  console.log(route)
  const { control, handleSubmit } = useForm()
  const [loading, setLoading] = useState(false)
  const [token, setToken] = useState("")
  let confirmPassword = ""

  const onSubmit = async (data, err) => {
    if (!data.password || !data.password?.trim()) {
      return notifyMessage("Password is required!")
    }
    if (!data.confirmPassword || !data.password?.trim()) {
      return notifyMessage("Please Confirm your password!")
    }
    if (!Validate(data?.password, { isPassword: true })) {
      return notifyMessage("Please enter valid password")
    }
    if (!Validate(data?.confirmPassword, { isPassword: true })) {
      return notifyMessage(`Password doesn't match`)
    }
    if (data?.password !== data?.confirmPassword) {
      return notifyMessage(`Password doesn't match`)
    }
    // const email = await getItem('resetEmail')
    // const { resetToken, userId } = route.params
    const payload = {
      email: route.params.email,
      otp: data.otp,
      password: data.password,
    }

    try {
      console.log(payload)
      const response = await apiClient.post(endpoints.PASSWORD_RESET_CONFIRM, payload)
      console.log(response)
      notifyMessage("Password Changed Successfully!")
      navigation.navigate("Login")
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    // const { resetToken } = route.params
    // setToken(resetToken)
  }, [])

  return (
    <KeyboardAvoidingView style={styles.KeyboardView}>
      <View style={styles.screenContainer}>
        <Spinner color={blue} visible={loading} />

        <Header
          leftNode={
            <TouchableOpacity
              style={{ padding: 15, marginLeft: -12 }}
              onPress={() => navigation.goBack()}>
              <Image source={arrow_left} style={{ tintColor: white }} />
            </TouchableOpacity>
          }
          centerNode={
            <View style={{ flex: 8 }}>
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 24,
                  color: white,
                  marginBottom: 4,
                }}>
                Reset Password
              </Text>
              {/* <Text style={{ fontWeight: '700', textAlign: 'center', fontSize: 14, }}>Enter your personal details</Text> */}
            </View>
          }
          // rightNode={<TouchableOpacity style={{ position: 'absolute', right: 5, bottom: 10, padding: 15 }} onPress={() => { navigation.navigate(NavigationStrings.EDIT_PROFILE_ACCOUNTS) }}><Text style={{ fontWeight: '700', color: '#2678EE', fontSize: 14 }}>Edit</Text></TouchableOpacity>}
          rightNode={<View style={{ flex: 1 }}></View>}
        />
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Input
            control={control}
            placeholder={"OTP"}
            name="otp"
            autoCapitalize="none"
            keyboardType="default"
            initialColor={lightGrey}
            finalColor={primary}
            required
            label="OTP"
            rule={{ isEmail: true }}
            defaultValue={""}
          />
          <Input
            control={control}
            placeholder={"Password"}
            name="password"
            keyboardType="default"
            initialColor={lightGrey}
            finalColor={blue}
            required
            isPassword
            label="Enter Your New Password"
            rule={{ isPassword: true }}
            onChange={(val) => {
              confirmPassword = val.nativeEvent.text
              console.log(confirmPassword)
            }}
          />
          <Text style={styles.passwordRequirementText}>
            Password Should contain atleast 1 capital letter, 1 lower case letter , 1 number and one
            special character
          </Text>
          <Input
            control={control}
            placeholder={"Password Confirmation"}
            name="confirmPassword"
            label="Confirm Password"
            keyboardType="default"
            initialColor={lightGrey}
            finalColor={blue}
            required
            isPassword
            rule={{ isPassword: true }}
            compValue={confirmPassword}
          />
          <FlatButton
            // style={{ borderWidth: 1, borderColor: white, width: "90%" }}
            onPress={handleSubmit(onSubmit)}
            label={"Change Password"}
            textColor={white}
          />
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  )
}
