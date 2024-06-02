import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, ScrollView, Alert, ActivityIndicator } from 'react-native';

export default function ModelParametreler({ columnArray, id }) {
    const [formValues, setFormValues] = useState({});
    const [loading, setLoading] = useState(false);

    const handleChange = (name, value) => {
        setFormValues({ ...formValues, [name]: value });
    };

    const fetchWithTimeout = (url, options, timeout = 60000) => {  // 60 saniye timeout
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

    const handleSubmit = () => {
        setLoading(true);  // Form gönderilirken loading state'i true yap
        console.log('Form Values:', formValues);
        console.log('id:', id);

        const formData = {
            model_id: id,
            parametreler: formValues
        };

        fetchWithTimeout('http://10.0.2.2:5000/form', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Response:', data);
            Alert.alert('Prediction', `Prediction: ${data.prediction}`); // Pred değerini alert ile ekrana yazdır
        })
        .catch(error => {
            console.error('Error:', error);
            Alert.alert('Error', `Error: ${error.message}`);
        })
        .finally(() => {
            setLoading(false);  // İşlem bittiğinde loading state'ini false yap
        });
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {columnArray.map((column, index) => (
                    <View key={index} style={styles.inputContainer}>
                        <Text style={styles.label}>{column}:</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={(value) => handleChange(column, value)}
                        />
                    </View>
                ))}
            </ScrollView>
            <View style={styles.buttonContainer}>
                {loading ? (
                    <ActivityIndicator size="large" color="#0000ff" />
                ) : (
                    <Button title="Submit" onPress={handleSubmit} />
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContainer: {
        padding: 20,
        paddingBottom: 80,
    },
    inputContainer: {
        marginBottom: 15,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginTop: 5,
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
    },
});
