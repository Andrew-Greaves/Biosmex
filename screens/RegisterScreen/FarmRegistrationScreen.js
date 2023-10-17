import React, { useEffect,useState,useRef } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet,Image, TouchableWithoutFeedback, Keyboard,ScrollView,TouchableOpacity,TextInput,FlatList,KeyboardAvoidingView,ActivityIndicator,StatusBar } from 'react-native';
import { Text,Input,Icon,Button,Divider } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import { SelectList } from 'react-native-dropdown-select-list';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import axios from 'axios';
import base64 from 'react-native-base64';

const FarmRegistrationScreen = () => {
    const navigation = useNavigation();

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.view}>
                <StatusBar backgroundColor={"white"} barStyle={"dark-content"} />
                <Image source={require('../../assets/BiosmexLogo.png')}  />
                <View style={{ flexDirection: "row", alignItems: "center", paddingTop: 20,marginBottom:20 }}>
                    <TouchableOpacity style={{ padding: 10,alignSelf:"flex-start" }} onPress={() => wizard.current.prev()}>
                    <Icon type="material-community" size={35} name="arrow-left-circle" style={{ marginRight: 60 }} />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 28, fontWeight: "bold",marginRight:90,letterSpacing:1}}>Registration</Text>
                </View>
                <KeyboardAwareScrollView>

                </KeyboardAwareScrollView>
            </View>
        </TouchableWithoutFeedback>
)};

const styles=StyleSheet.create({
    view: {
      flex: 1,
      width: "100%",
      height: "100%",
      alignItems: "center",
      backgroundColor: "#fff",
      paddingTop:50,
      paddingBottom:50
    },
    
    button: {
      width: "75%",
      height:50,
      marginTop: 10
    },
    Icon: {
      marginTop: 75
    },
    LoginText: {
      textAlign: "center",
      fontFamily:'Arial',
      fontSize:34,
      fontWeight:'600',
      marginTop: 40
    },
    PrivacyText: {
      textAlign: "center",
      fontFamily:'Arial',
      fontSize:20,
      fontWeight:'600',
      marginTop: 10,
      color:'rgba(0,0,0,0.6)',
      marginBottom:20
    },
    button:{
      paddingTop:50,
      width:200
    },
    input: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
      paddingVertical: 10,
      paddingHorizontal: 15,
      fontSize: 16,
      marginBottom: 10,
    },
    text: {
      fontWeight: 'bold',
      fontSize: 17,
      margin:5
    },
    buttonContainer: {
      backgroundColor: '#F9B712',
      borderRadius: 10,
      padding: 10,
      width: '80%',
      alignItems: 'center',
      alignSelf:"center",
      marginTop: 20,
    },
    buttonText: {
      color: '#FFFFFF',
      fontSize: 18,
      fontWeight: 'bold',
    },
  
  })
  
  export default FarmRegistrationScreen;