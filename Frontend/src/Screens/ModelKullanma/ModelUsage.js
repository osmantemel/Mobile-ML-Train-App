import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from "@expo/vector-icons";
import ModelParametreler from './ModelParametreler';

const ModelUsage = ({ route, navigation }) => {
    const { modelId } = route.params;
    const [modelData, setModelData] = useState(null);
    const [columnArray, setColumnArray] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://10.0.2.2:5000/response/model_id/${modelId}`);
                const data = await response.json();
                console.log('Fetched data:', data);
                setModelData(data);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [modelId]);

    useEffect(() => {
        if (modelData && modelData[0] && modelData[0][2]) {
            const columns = JSON.parse(modelData[0][2]);
            setColumnArray(columns);
        }
    }, [modelData]);

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text style={styles.loadingText}>Loading...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>Error: {error}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <FontAwesome5 name="arrow-left" size={24} color="#fff" />
            </TouchableOpacity>
            {modelData && (
                <>
                    <Text style={styles.title}>{modelData[0][5]}</Text>
                    <View style={styles.modelInfo}>
                        <Text>Model Bilgileri:</Text>
                        <Text>Label: {modelData[0][2]}</Text>
                        <Text>Accuracy: {modelData[0][6]}</Text>
                    </View>
                    <ModelParametreler columnArray={columnArray} id={modelData[0][0]} />
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    modelInfo: {
        marginTop: 20,
        padding: 10,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: '#ccc',
        width: '100%',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 18,
        textAlign: 'center',
    },
    errorText: {
        fontSize: 18,
        color: 'red',
        textAlign: 'center',
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

export default ModelUsage;
