import AsyncStorage from "@react-native-async-storage/async-storage"


export const getItem = async key => {
  const data = await AsyncStorage.getItem(key)
  const result = JSON.parse(data)
  return result
}

export const setItem = async (key, data) => {
  return await AsyncStorage.setItem(key, JSON.stringify(data))
}

export const removeItem = key => {
  return AsyncStorage.removeItem(key)
}

export const clearStorage = () => {
  return AsyncStorage.clear()
};