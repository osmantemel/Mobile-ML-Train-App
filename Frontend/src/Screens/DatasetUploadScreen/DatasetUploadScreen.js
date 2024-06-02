import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, Alert, Platform } from 'react-native';
import { FontAwesome5 } from "@expo/vector-icons";
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { Picker } from '@react-native-picker/picker';

export default function DatasetUploadScreen({ navigation }) {
  const [selectedFileName, setSelectedFileName] = useState(null);
  const [selectedFileUri, setSelectedFileUri] = useState(null);
  const [selectedFileType, setSelectedFileType] = useState(null);
  const [selectedFileSize, setSelectedFileSize] = useState(null);
  const [labelName, setLabelName] = useState('');
  const [problemType, setProblemType] = useState('');

  const handleUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: 'text/comma-separated-values' });

      if (result.type !== 'cancel') {
        const file = result;
        setSelectedFileName(file.name);
        setSelectedFileUri(file.uri);
        setSelectedFileType(file.mimeType);
        setSelectedFileSize(file.size);
      } else {
        Alert.alert('Dosya Seçme İptal Edildi');
      }
    } catch (error) {
      console.log('Dosya Seçme Hatası:', error);
      Alert.alert('Dosya Seçme Hatası', `Hata: ${error.message}`);
    }
  };

  const uploadFileToApi = async () => {
    if (!selectedFileName || !selectedFileUri || !selectedFileType || !selectedFileSize || !labelName || !problemType) {
      Alert.alert('Eksik Bilgi', 'Lütfen tüm bilgileri doldurun ve bir dosya seçin.');
      return;
    }

    try {
      const fileData = await FileSystem.readAsStringAsync(selectedFileUri, { encoding: FileSystem.EncodingType.Base64 });

      const data = {
        id: fileData.slice(0, 20),
        user_id: 0,
        name: selectedFileName,
        data: fileData,
        type: selectedFileType,
        size: selectedFileSize,
        labelColumnName: labelName,
        problemType: problemType,
      };

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
          Alert.alert("Dosya Başarı ile alındı", "Model eğitiliyor...(5 dk)");
        })
        .catch((error) => {
          console.error('Error:', error);
          Alert.alert('Hata', 'Dosya yüklenirken bir hata oluştu.');
        });

      // Form verilerini temizle
      setSelectedFileName(null);
      setSelectedFileUri(null);
      setSelectedFileType(null);
      setSelectedFileSize(null);
      setLabelName('');
      setProblemType('');
    } catch (error) {
      console.log('Dosya Okuma Hatası:', error);
      Alert.alert('Dosya Okuma Hatası', `Hata: ${error.message}`);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <FontAwesome5 name="arrow-left" size={24} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.iconButton} onPress={handleUpload}>
        <FontAwesome5 name="file-upload" size={100} color="white" />
        <Text style={styles.uploadText}>Dosya seçmek için dokunun</Text>
      </TouchableOpacity>
      {selectedFileName && <Text style={styles.fileName}>{selectedFileName}</Text>}
      <TextInput
        style={styles.input}
        placeholder="Etiket Sütununun İsmi"
        value={labelName}
        onChangeText={setLabelName}
      />
      <Picker
        selectedValue={problemType}
        style={styles.picker}
        onValueChange={(itemValue) => setProblemType(itemValue)}
      >
        <Picker.Item label="Problem Türünü Seçin" value="" />
        <Picker.Item label="Regresyon" value="regression" />
        <Picker.Item label="Sınıflandırma" value="classification" />
      </Picker>
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
    padding: 20,
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 40 : 20,
    left: 20,
    padding: 10,
    borderRadius: 50,
    backgroundColor: '#3498db',
  },
  iconButton: {
    backgroundColor: '#3498db',
    padding: 30,
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
    marginTop: 20,
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
    textAlign: 'center',
  },
  fileName: {
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    width: '80%',
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  picker: {
    height: 50,
    width: '80%',
    backgroundColor: '#fff',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
  },
});
