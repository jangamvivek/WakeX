import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Stack } from 'expo-router';
import AlarmWatcher from './components/AlarmWatcher';

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AlarmWatcher />
      <Stack />
    </GestureHandlerRootView>
  );
}
