import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, Button } from 'react-native';

export default function AllModelsPage() {
  const navigation = useNavigation();
  
  const [models, setModels] = useState([]);

  useEffect(() => {
    fetch('http://10.0.2.2:5000/response')
      .then((response) => response.json())
      .then((data) => {
        // console.log('Fetched data:', data); // Konsola veri yazdırma
        // // Verileri işleyip uygun formata dönüştür
        const formattedData = data.map(item => ({
          id: item[0],
          fileName: item[5],
          dogruluk: item[6]
        }));
        setModels(formattedData);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const handleUseModel = (id) => {
    console.log(`Using model with ID: ${id}`);
    navigation.navigate('ModelUsage', { modelId: id });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>All Models</Text>
      <FlatList
        data={models}
        keyExtractor={(item) => item.id.toString()} // id kullanarak benzersiz anahtar belirleme
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
});
