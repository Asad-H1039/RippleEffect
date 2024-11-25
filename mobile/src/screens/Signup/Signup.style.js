
import { StyleSheet } from 'react-native';
import { darkGrey, primary, white } from '../../utils/colors';

const styles = StyleSheet.create({
  screenContainer: {
    backgroundColor: white,
    flexGrow: 1,
    position: 'relative',
    flex: 1,
  },
  departmentTitle: {
    marginBottom: 8,
    marginTop: 8,
    color: darkGrey,
    fontWeight: '700',
    fontSize: 14,
  },
  headerTxt: {
    textAlign: 'center',
fontSize: 22,
    fontWeight: '700',
    color: primary,
    marginLeft: 20,
    position: 'absolute',
    bottom: 12,
    fontWeight: '700'
  },
});

export default styles;