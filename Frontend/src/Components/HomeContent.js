import React, { useRef, useEffect } from 'react';
import { StyleSheet, Text, View, ImageBackground, TouchableOpacity, Animated } from 'react-native';

const HomeContent = ({ navigation }) => {
  const slideInAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(slideInAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [slideInAnim]);

  return (
    <ImageBackground
      // source={require('../../assets/back3.jpg')}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <Animated.Text style={[styles.title, { transform: [{ translateX: slideInAnim.interpolate({ inputRange: [0, 1], outputRange: [300, 0] }) }] }]}>Hoş Geldiniz!</Animated.Text>
        <TouchableOpacity
          style={styles.exploreButton}
          onPress={() => navigation.navigate('Profile')}
        >
            <Text onPress={() => navigation.navigate('Profile')} style={styles.exploreButtonText}>Keşfetmeye Başla</Text>
       
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
  },
  exploreButton: {
    backgroundColor: '#3498db',
    paddingVertical: 10,
    paddingHorizontal: 20, 
    borderRadius: 5,
  },
  exploreButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default HomeContent;
