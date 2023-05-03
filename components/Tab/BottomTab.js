import React, { useEffect,useState } from 'react';
import { View, StyleSheet,Image,TouchableOpacity } from 'react-native';
import { Text,Icon,Button } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';

const BottomTab = () => {
    const navigation = useNavigation();
    return(
        <TouchableOpacity>
            <Icon type= 'material-community' size={20} name= 'home' 
            containerStyle={{borderWidth:1,borderRadius:10,padding:12,backgroundColor:"#D3D3D3",width:100}}/>
        </TouchableOpacity>
    )};

    const styles = StyleSheet.create({
    
    });
  
  export default BottomTab;