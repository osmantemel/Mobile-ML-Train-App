import React from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions,Text } from 'react-native';
import { FontAwesome5 } from "@expo/vector-icons";
import HomeContent from '../Components/HomeContent';

const { height } = Dimensions.get('window');

function Menu({navigation}) {
  return (
    <View>
      <HomeContent/>
    <View style={[styles.menuContainer, { top: height - 115 }]}>
    
      <TouchableOpacity style={styles.menuItem} onPress={()=>navigation.navigate('Anasayfa')}>
        <FontAwesome5 name="home" size={24} color="black" />
        <Text>Anasyafa</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem} onPress={()=>navigation.navigate('Veri Seti Yükleme Ekranı')}>
        <FontAwesome5 name="upload" size={24} color="black" />
        <Text>Veri seti Yükle</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem} onPress={()=>navigation.navigate('Tüm Modeller')}>
        <FontAwesome5 name="cogs" size={24} color="black" />
        <Text>Modeller</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.menuItem} onPress={()=>navigation.navigate('Profil')}>
        <FontAwesome5 name="user" size={24} color="black"  />
        <Text>Profil</Text>
      </TouchableOpacity>
    </View>
    </View>

  );
}

const styles = StyleSheet.create({
  menuContainer: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 5, 
    borderColor: '#3498db', 
    backgroundColor:"#3498db",
    height: 60,
    width: '100%',
  },
  menuItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Menu;
