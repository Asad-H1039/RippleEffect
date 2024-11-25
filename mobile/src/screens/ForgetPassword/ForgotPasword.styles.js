import { StyleSheet } from 'react-native';
import { white, blue, buttonGradient, lightGrey, primary } from '../../utils/colors';

const styles = StyleSheet.create({
  screenContainer: {
    backgroundColor: white,
    flexGrow: 1,
    position: 'relative',
    flex: 1,
  },

  KeyboardView: {
    flex: 1
  },

  HeaderLeftContiner: {
    position: 'absolute',
    left: 5,
    bottom: 15,
    padding: 15
  },
  HeaderLeftTextContiner: {
    marginLeft: 20,
    position: "absolute",
    bottom: 20,
    left: 23
  },
  HeaderLeftText: {

    textAlign: 'left',
    fontSize: 22,
    color: primary,
  },
  forgotPasswordText: {

    textAlign: 'left',
    fontSize: 22,
    color: white,
  },
  confirmEmailBtn: {
    borderWidth: 1,
    borderColor: white,
    width: '90%'
  },
  scrollContainer: {
    padding: 20,
  },
  passwordRequirementText: {

    fontSize: 12,
    marginBottom: 10,
    fontWeight: '800'
  },

});

export default styles;