import { useRouter } from 'expo-router';
import { View, Text, Image, Dimensions, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { GestureHandlerRootView, FlingGestureHandler, Directions, State } from 'react-native-gesture-handler';
import { Stack } from 'expo-router';

const { width } = Dimensions.get('window');

export default function Screen1() {
  const router = useRouter();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <FlingGestureHandler
        direction={Directions.LEFT} // Detect left swipe
        numberOfPointers={1} // Use single-finger swipe
        onHandlerStateChange={(event) => {
          if (event.nativeEvent.state === State.END) {
            router.push('/welcome/screen2'); // Navigate to the next screen
          }
        }}
      >
        <View style={{ flex: 1 }}>
          {/* Hide header */}
          <Stack.Screen options={{ headerShown: false }} />

          <LinearGradient colors={['#E0F2FE', '#F8FAFC']} style={styles.container}>
            {/* Image */}
            <Image 
              source={require('../../assets/images/Screen1.png')} // Ensure correct path
              style={styles.image}
            />

            {/* Title */}
            <Text style={styles.title}>Snooze no more</Text>

            {/* Subtitle */}
            <Text style={styles.subtitle}>
              Get out of bed with engaging missions to kickstart your day
            </Text>

            {/* Pagination Dots */}
            <View style={styles.pagination}>
              <View style={[styles.dot, styles.activeDot]} />
              <View style={styles.dot} />
              <View style={styles.dot} />
            </View>
          </LinearGradient>
        </View>
      </FlingGestureHandler>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: width * 0.7,
    height: width * 0.7,
    resizeMode: 'contain',
    marginBottom: 80,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 40,
    color: '#000',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#555',
    marginTop: 30,
    paddingHorizontal: 30,
  },
  pagination: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 50,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D3D3D3',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#00AEEF', // Blue color for active dot
  },
});
