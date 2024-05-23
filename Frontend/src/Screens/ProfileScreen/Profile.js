import { StyleSheet, Text, View, Image } from 'react-native';
import React from 'react';

export default function Profile() {
  return (
    <View style={styles.container}>
      <Image
        style={styles.avatar}
        source={{
          uri: 'http://osmantemel.me/static/media/pfoto.9a199c720199d4310ea6.png', // Placeholder image URL
        }}
      />
      <View style={styles.infoContainer}>
        <Text style={styles.name}>Osman TEMEL</Text>
        <Text style={styles.email}>osman.temel@gmail.com</Text>
        <Text style={styles.bio}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  infoContainer: {
    alignItems: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  email: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  bio: {
    textAlign: 'center',
    fontSize: 16,
    color: '#333',
  },
});
