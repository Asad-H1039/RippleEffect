import { Platform, ToastAndroid, Alert } from 'react-native'

function notifyMessage(msg) {
  if (Platform.OS === 'android') {
    ToastAndroid.show(msg, ToastAndroid.LONG)
  } else {
    Alert.alert(msg);
  }
  // Toast.show(msg)
}

export default notifyMessage