import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  return (
    <ImageBackground
      source={require('../assets/images/img1.jpg')}
      resizeMode="cover"
      style={styles.background}
    >
       {/* Login Button */}
       <TouchableOpacity style={styles.loginButton} onPress={() => console.log('Login pressed')}>
        <Text style={styles.loginText}>Login</Text>
      </TouchableOpacity>
      
      <View style={styles.overlay}>
        <Text style={styles.title}>Welcome to Ruth’s Chicken</Text>
        <Text style={styles.subtitle}>
          Your favorite gluten-free fried chicken, now in an app.
        </Text>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  loginButton: {
    position: 'absolute',
    top: 60, // Adjust this for safe area / notch
    right: 20,
    backgroundColor: 'rgba(255,255,255,0.8)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    zIndex: 10,
  },
  loginText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  title: {
    color: 'white',
    fontSize: 42,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    color: 'white',
    fontSize: 24,
    textAlign: 'center',
  },
});
