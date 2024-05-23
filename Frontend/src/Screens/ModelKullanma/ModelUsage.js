import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ModelParametreler from './ModelParametreler';

const ModelUsage = ({ route }) => {
    const { modelId } = route.params;
    const [modelData, setModelData] = useState(null);
    const [columnArray, setColumnArray] = useState([]);

    useEffect(() => {
        fetch(`http://10.0.2.2:5000/response/model_id/${modelId}`)
            .then((response) => response.json())
            .then((data) => {
                console.log('Fetched data:', data);
                setModelData(data);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }, [modelId]);

    useEffect(() => {
        if (modelData && modelData[0] && modelData[0][2]) {
            const columns = JSON.parse(modelData[0][2]);
            setColumnArray(columns);
        }
    }, [modelData]);

    return (
        <View style={styles.container}>
            {modelData && (
                <>
                    <Text style={styles.title}>{modelData[0][5]}</Text>
                    <View style={styles.modelInfo}>
                        <Text>Model Bilgileri:</Text>
                        <Text>Label: {modelData[0][2]}</Text>
                        <Text>Accuracy: {modelData[0][6]}</Text>
                    </View>
                    <ModelParametreler columnArray={columnArray} id = {modelData[0][0]}/>
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
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    modelId: {
        fontSize: 18,
        marginBottom: 10,
    },
    modelInfo: {
        marginTop: 20,
        padding: 10,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: '#ccc',
    },
});

export default ModelUsage;
