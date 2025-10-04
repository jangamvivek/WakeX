import { View, Text, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
import { useNavigation, useRouter } from 'expo-router';
import { ResizeMode, Video } from 'expo-av';
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';


const { width,height} = Dimensions.get('window');

export default function Screen3() {
  const router = useRouter();
  const navigation = useNavigation();

  // Hide the header
  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);
  
  return (
    <View style={styles.container}>
      {/* Video */}
      <Video
        source={require('../../assets/videos/screen3.mp4')} // Local video file
        style={styles.video}
        useNativeControls
        resizeMode={ResizeMode.COVER}
        isLooping
        shouldPlay
      />

      {/* Get Started Button */}
      {/* <TouchableOpacity style={styles.button} onPress={() => router.replace('/welcome/HomeScreen')}>
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity> */}
      <TouchableOpacity style={styles.button} onPress={async () => {
          await AsyncStorage.setItem("hasLaunched", "true");
          router.replace('/welcome/HomeScreen');
        }}><Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>


      {/* Pagination Dots */}
      <View style={styles.pagination}>
        <View style={styles.dot} />
        <View style={styles.dot} />
        <View style={[styles.dot, styles.activeDot]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    paddingBottom: 40, // Added padding for better spacing
  },
  video: {
    width: width * 1.0,
    height: width * 1.9
  },
  button: {
    width: width * 0.8,
    backgroundColor: '#7D3C98', // Purple color
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 20, // Added spacing
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20, // Adjusted for spacing
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D3D3D3', // Light gray for inactive dots
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#7D3C98', // Purple for active dot
  },
});
