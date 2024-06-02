import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { FontAwesome5 } from "@expo/vector-icons";
import { StyleSheet, Text, View, FlatList, Button, ActivityIndicator, TouchableOpacity } from 'react-native';

export default function AllModelsPage() {
  const navigation = useNavigation();
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWithTimeout = (url, options, timeout = 60000) => {
      return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
          reject(new Error('Request timed out'));
        }, timeout);

        fetch(url, options)
          .then(response => {
            clearTimeout(timer);
            resolve(response);
          })
          .catch(err => {
            clearTimeout(timer);
            reject(err);
          });
      });
    };

    fetchWithTimeout('http://10.0.2.2:5000/response', { method: 'GET' })
      .then(response => response.json())
      .then(data => {
        const formattedData = data.map(item => ({
          id: item[0],
          fileName: item[5],
          dogruluk: item[6]
        }));
        setModels(formattedData);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  const handleUseModel = (id) => {
    console.log(`Using model with ID: ${id}`);
    navigation.navigate('ModelUsage', { modelId: id });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.title}>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorTitle}>Error</Text>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <FontAwesome5 name="arrow-left" size={24} color="#fff" />
      </TouchableOpacity>
      <Text style={styles.title}>Tüm Modeller</Text>

      <FlatList
        data={models}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.fileName}>FileName: {item.fileName}</Text>
            <Text style={styles.dogruluk}>Accuracy: {item.dogruluk}</Text>
            <Button title="Kullan" onPress={() => handleUseModel(item.id)} />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center', // Başlık metnini ortala
  },
  item: {
    marginBottom: 15,
    padding: 15,
    borderRadius: 5,
    backgroundColor: '#f9f9f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 1,
  },
  fileName: {
    fontSize: 18,
    fontWeight: '500',
  },
  dogruluk: {
    fontSize: 16,
    color: '#666',
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'red',
    marginBottom: 10,
    textAlign: 'center', // Hata başlığını ortala
  },
  error: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center', // Hata mesajını ortala
  },

  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    padding: 10,
    borderRadius: 50,
    backgroundColor: '#3498db',
  },
});
