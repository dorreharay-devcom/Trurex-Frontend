import { StyleSheet, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { appToastConfig } from './toastConfig';

export function ModalToastLayer() {
  return (
    <View pointerEvents="box-none" style={styles.layer}>
      <Toast config={appToastConfig} />
    </View>
  );
}

const styles = StyleSheet.create({
  layer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999999,
    elevation: 999999,
  },
});
