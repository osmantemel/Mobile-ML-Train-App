import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { FontAwesome5 } from "@expo/vector-icons";
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';

export default function DatasetUploadScreen() {
  const [selectedFileName, setSelectedFileName] = useState();
  const [selectedFileUri, setselectedFileUri] = useState();
  const [selectedFileType, setselectedFileType] = useState();
  const [selectedFileSize, setselectedFileSize] = useState();

  const handleUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: 'text/comma-separated-values'});

      if (!result.cancelled) {
        const file = result.assets[0];
        setSelectedFileName(file.name);
        setselectedFileUri(file.uri);
        setselectedFileType(file.mimeType);
        setselectedFileSize(file.size);
      } else {
        Alert.alert('Dosya Seçme İptal Edildi');
      }
    } catch (error) {
      console.log('Dosya Seçme Hatası:', error);
      Alert.alert('Dosya Seçme Hatası', `Hata: ${error.message}`);
    }
  };

  const uploadFileToApi = async () => {
    if (!selectedFileName || !selectedFileUri || !selectedFileType || !selectedFileSize) {
      Alert.alert('Dosya Seçilmedi', 'Lütfen önce bir dosya seçin.');
      return;
    }
  
    try {
      const fileData = await FileSystem.readAsStringAsync(selectedFileUri, { encoding: FileSystem.EncodingType.Base64 });
      console.log(fileData.slice(0, 20)); 
      
      var data = {
        id : fileData.slice(0, 20),
        user_id : 0,
        name: selectedFileName,
        data: fileData,
        type: selectedFileType,
        size: selectedFileSize,
      }
  
      fetch('http://10.0.2.2:5000/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
        body: JSON.stringify(data),
      })
      .then(response => response.json())
      .then(data => {
        console.log(data);
      })
      .catch((error) => {
        console.error('Error:', error);    
      });
    } catch (error) {
      console.log('Dosya Okuma Hatası:', error);
      Alert.alert('Dosya Okuma Hatası', `Hata: ${error.message}`);
    }
  };
  
  
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.iconButton} onPress={handleUpload}>
        <FontAwesome5 name="file-upload" size={200} color="white" />
        <Text style={styles.uploadText}>Dosya seçmek için dokunun</Text>
      </TouchableOpacity>
      <Text>{selectedFileName}</Text>
      <TouchableOpacity style={styles.trainButton} onPress={uploadFileToApi}>
        <Text style={styles.buttonText}>Eğitimi Başlat</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  iconButton: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  trainButton: {
    backgroundColor: '#27ae60',
    padding: 15,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  uploadText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
});
