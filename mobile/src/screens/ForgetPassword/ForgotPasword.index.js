import React, { useEffect, useState } from "react"
import { View, ScrollView, KeyboardAvoidingView, TouchableOpacity, Image, Text } from "react-native"

import { useForm } from "react-hook-form"

import { Input, Spinner } from "../../components/common"
import notifyMessage from "../../utils/notification"

import { Validate } from "../../utils/validator"

import { blue, lightGrey, primary, white } from "../../utils/colors"

import arrow_left from "../../assets/arrow_left.png"

import styles from "./ForgotPasword.styles"

import Header from "../../components/common/Header"
import FlatButton from "../../components/common/FlatButton"
import { apiClient, endpoints } from "../../api"

export default function ForgotPassword({ navigation, route }) {
  const { control, handleSubmit } = useForm()
  const [loading, setLoading] = useState(false)

  const onSubmit = async (data, err) => {
    if (!data.email) {
      return notifyMessage("Email is required!")
    }
    if (!Validate(data?.email, { isEmail: true })) {
      return notifyMessage("Please enter valid email!")
    }
    setLoading(true)
    try {
      try {
        data.email = data.email.toLowerCase()
        console.log(endpoints.FORGOT_PASSWORD, data)
        const response = await apiClient.post(endpoints.FORGOT_PASSWORD, data)
        console.log(response)
        navigation.replace("Forget Pwd2", data)
      } catch (error) {
        console.log(error)
      }
      // navigation.replace("Secure Routes")
    } catch (error) {
      console.log("errorrrrrr", error)
    }

    setLoading(false)
    //
  }

  useEffect(() => {
    if (route.params) {
      setLoading(true)
      if (route.params.token) {
        const { token, userId } = route.params
        const temp = decodeURIComponent(token)
        const id = decodeURIComponent(userId)
        setLoading(true)
        navigation.navigate("Reset Pwd", { resetToken: temp, userId: id })
      }
      setLoading(false)
    }
  }, [route])

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
                Forgot Password
              </Text>
              {/* <Text style={{ fontWeight: '700', textAlign: 'center', fontSize: 14, }}>Enter your personal details</Text> */}
            </View>
          }
          // rightNode={<TouchableOpacity style={{ position: 'absolute', right: 5, bottom: 10, padding: 15 }} onPress={() => { navigation.navigate(NavigationStrings.EDIT_PROFILE_ACCOUNTS) }}><Text style={{ fontWeight: '700', color: '#2678EE', fontSize: 14 }}>Edit</Text></TouchableOpacity>}
          rightNode={<View style={{ flex: 1 }}></View>}
        />
        <ScrollView contentContainerStyle={{ padding: 20 }} keyboardShouldPersistTaps="always">
          <Input
            control={control}
            placeholder={"Email"}
            name="email"
            autoCapitalize="none"
            keyboardType="email-address"
            initialColor={lightGrey}
            finalColor={primary}
            required
            label="Email"
            rule={{ isEmail: true }}
            defaultValue={""}
          />
          <FlatButton onPress={handleSubmit(onSubmit)} label={"Confirm Email"} textColor={white} />
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  )
}
