import React from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import Menu from './src/Components/Menu';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Profile from './src/Screens/ProfileScreen/Profile';
import AllModelsPage from './src/Screens/AllModelsScreen/AllModelsPage';
import DatasetUploadScreen from './src/Screens/DatasetUploadScreen/DatasetUploadScreen';

const stack = createNativeStackNavigator();

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <NavigationContainer>
        <stack.Navigator initialRouteName='AllModelsPage'>
          <stack.Screen name="Anasayfa" component={Menu} />
          <stack.Screen name="Tüm Modeller" component={AllModelsPage} />
          <stack.Screen name="Veri Seti Yükleme Ekranı" component={DatasetUploadScreen} />
          <stack.Screen name="Profil" component={Profile} />
        </stack.Navigator>
      </NavigationContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
