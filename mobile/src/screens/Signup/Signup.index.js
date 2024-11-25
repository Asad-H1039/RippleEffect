import React, { useEffect, useState } from "react"
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  KeyboardAvoidingView,
  TouchableOpacity,
  Image,
  Alert,
  Linking,
} from "react-native"
import { useForm } from "react-hook-form"
import CheckBox from "@react-native-community/checkbox"
import { Input, Spinner } from "../../components/common"
import { primary, lightGrey, white, black, darkGrey } from "../../utils/colors"
import styles from "./Signup.style"
import { Validate } from "../../utils/validator"
import notifyMessage from "../../utils/notification"

import Header from "../../components/common/Header"
import arrow_left from "../../assets/arrow_left.png"
import FlatButton from "../../components/common/FlatButton"
import { apiClient, endpoints } from "../../api"

export default function SignupScreen({ navigation }) {
  const { control, handleSubmit } = useForm()
  const [toggleCheckBox, setToggleCheckBox] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {}, [])

  let confirmPassword = ""

  const onSubmit = async (data, err) => {
    if (!data.fullname || !data.fullname?.trim()) {
      return notifyMessage("Name is required!")
    }
    if (!data.email) {
      return notifyMessage("Email is required!")
    }
    if (!Validate(data?.email, { isEmail: true })) {
      return notifyMessage("Please enter valid email!")
    }

    if (!data.password || !data.password?.trim()) {
      return notifyMessage("Password is required!")
    }
    if (!Validate(data?.password, { isPassword: true })) {
      return notifyMessage("The password you have entered does not meet the password requirements")
    }
    if (!Validate(data?.confirmPassword, { isPassword: true })) {
      return notifyMessage(`Password doesn't match`)
    }
    if (data?.password !== data?.confirmPassword) {
      return notifyMessage(`Password doesn't match`)
    }
    setLoading(true)
    delete data.confirmPassword
    data.username = data.email
    console.log(endpoints.REGISTER, data)
    try {
      const response = await apiClient.post(endpoints.REGISTER, data)
      console.log(response)
      navigation.replace('Login')
    } catch (error) {
      console.log(error)
    }
    setLoading(false)
  }

  const getData = async () => {
    setLoading(true)

    setLoading(false)
  }

  useEffect(() => {
    getData()
  }, [])

  return (
    <KeyboardAvoidingView style={{ flex: 1 }}>
      <View style={styles.screenContainer}>
        <Spinner color={primary} visible={loading} />

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
              <Text style={{ textAlign: "center", fontSize: 24, color: white, marginBottom: 4 }}>
                Register Yourself
              </Text>
              <Text style={{ textAlign: "center", fontSize: 14, color: white }}>
                Enter your personal details
              </Text>
            </View>
          }
          // rightNode={<TouchableOpacity style={{ position: 'absolute', right: 5, bottom: 10, padding: 15 }} onPress={() => { navigation.navigate(NavigationStrings.EDIT_PROFILE_ACCOUNTS) }}><Text style={{ fontWeight: '700', color: '#2678EE', fontSize: 14 }}>Edit</Text></TouchableOpacity>}
          rightNode={<View style={{ flex: 1 }}></View>}
        />

        <ScrollView contentContainerStyle={{ padding: 20 }} keyboardShouldPersistTaps="always">
          <Input
            control={control}
            placeholder={"Full Name"}
            name="fullname"
            keyboardType="default"
            initialColor={lightGrey}
            finalColor={primary}
            required
            label="Display Name"
          />

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

          <Input
            control={control}
            placeholder={"Password"}
            name="password"
            keyboardType="default"
            initialColor={lightGrey}
            finalColor={primary}
            required
            isPassword
            label="Password"
            rule={{ isPassword: true }}
            onChange={(val) => {
              confirmPassword = val.nativeEvent.text
              console.log(confirmPassword)
            }}
            isSignup={true}
          />
          <Input
            control={control}
            placeholder={"Password Confirmation"}
            name="confirmPassword"
            keyboardType="default"
            initialColor={lightGrey}
            finalColor={primary}
            required
            isPassword
            rule={{ isPassword: true }}
            compValue={confirmPassword}
          />

          <FlatButton
            // isDisabled={!toggleCheckBox}
            style={{ borderWidth: 1, borderColor: white }}
            onPress={handleSubmit(onSubmit)}
            label={"Create Account"}
            textColor={white}
          />
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  )
}
