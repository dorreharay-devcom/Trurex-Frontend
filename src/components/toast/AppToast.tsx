import { StyleSheet, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { appToastConfig } from './toastConfig';

export function AppToast() {
  return (
    <View pointerEvents="box-none" style={styles.host}>
      <Toast config={appToastConfig} />
    </View>
  );
}

const styles = StyleSheet.create({
  host: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999999,
    elevation: 999999,
  },
});
