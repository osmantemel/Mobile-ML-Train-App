import React from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import Menu from './src/Components/Menu';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Profile from './src/Screens/ProfileScreen/Profile';
import AllModelsPage from './src/Screens/AllModelsScreen/AllModelsPage';
import DatasetUploadScreen from './src/Screens/DatasetUploadScreen/DatasetUploadScreen';
import HomeContent from './src/Components/HomeContent';
import ModelUsage from './src/Screens/ModelKullanma/ModelUsage';

const stack = createNativeStackNavigator();

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <NavigationContainer>
        <stack.Navigator initialRouteName='AllModelsPage' >
          <stack.Screen name="Anasayfa" component={Menu} />
          <stack.Screen name="Tüm Modeller" component={AllModelsPage} options={{headerShown: false}}/>
          <stack.Screen name="Veri Seti Yükleme Ekranı" component={DatasetUploadScreen} options={{headerShown: false}}/>
          <stack.Screen name="Profil" component={Profile} options={{headerShown: false}}/>
          <stack.Screen name="HomeContent" component={HomeContent} />
          <stack.Screen name="ModelUsage" component={ModelUsage} options={{headerShown: false}}/>
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
