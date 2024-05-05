import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { FontAwesome5 } from "@expo/vector-icons";
import * as DocumentPicker from 'expo-document-picker';

export default function DatasetUploadScreen() {
  const [selectedFileName, setSelectedFileName] = useState();
  const [selectedFileUri, setselectedFileUri] = useState();
  const [selectedFileType, setselectedFileType] = useState();
  const [selectedFileSize, setselectedFileSize] = useState();

  const handleUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
      });
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
    try {

      const data = {
        name: selectedFileName,
        uri: selectedFileUri,
        Type: selectedFileType,
        size: selectedFileSize,
      };
      console.log(selectedFileName);
      console.log(selectedFileType);
      console.log(selectedFileUri);
      console.log(selectedFileSize);
    }
    catch (error) {
      console.log('Dosya gönderme hatası:', error);
      Alert.alert('Dosya Gönderme Hatası', `Hata: ${error.message}`);
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
