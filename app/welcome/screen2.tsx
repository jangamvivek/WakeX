import { useRouter } from 'expo-router';
import { View, Text, Image, Dimensions, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FlingGestureHandler, Directions, State } from 'react-native-gesture-handler';
import { Stack } from 'expo-router';

const { width } = Dimensions.get('window');

export default function Screen2() {
  const router = useRouter();

  return (
    <FlingGestureHandler
      direction={Directions.LEFT} // Detect right swipe
      onHandlerStateChange={(event) => {
        if (event.nativeEvent.state === State.END) {
          router.push('/welcome/screen3'); // Go to next screen
        }
      }}
    >
      <View style={{ flex: 1 }}>
        {/* Hide header */}
        <Stack.Screen options={{ headerShown: false }} />

        <LinearGradient colors={['#FCE7F3', '#F8FAFC']} style={styles.container}>
          {/* Image */}
          <Image 
            source={require('../../assets/images/notification.png')} // Ensure correct path
            style={styles.image}
          />

          {/* Title */}
          <Text style={styles.title}>Wake up smarter</Text>

          {/* Subtitle */}
          <Text style={styles.subtitle}>
            Solve challenges to prove you're awake and ready
          </Text>

          {/* Pagination Dots */}
          <View style={styles.pagination}>
            <View style={styles.dot} />
            <View style={[styles.dot, styles.activeDot]} />
            <View style={styles.dot} />
          </View>
        </LinearGradient>
      </View>
    </FlingGestureHandler>
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
