import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { stopAlarm } from './utils/alarmPlayer';
import { useRouter } from 'expo-router';

export default function QRScreen() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [dismissed, setDismissed] = useState(false);

  if (!permission) {
    return <View style={styles.container}><Text style={styles.text}>Requesting camera permission…</Text></View>;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.text} onPress={requestPermission}>Tap to allow camera</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      {!dismissed ? (
        <CameraView
          style={{ flex: 1 }}
          barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
          onBarcodeScanned={() => { setDismissed(true); stopAlarm(); router.replace('/welcome/HomeScreen'); }}
        />
      ) : (
        <View style={styles.container}><Text style={styles.text}>✅ Alarm dismissed!</Text></View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' },
  text: { color: '#fff', fontSize: 18 },
});


