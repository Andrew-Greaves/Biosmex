import React, { useEffect,useState } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet,Image, TouchableWithoutFeedback, Keyboard,ScrollView } from 'react-native';
import { Text,Input,Icon,Button } from '@rneui/themed';
import PrimaryButton from '../../components/Buttons/PrimaryButton/PrimaryButton';
import { useNavigation } from '@react-navigation/native';
import BackButton from '../../components/Buttons/BackButton/BackButton';

const RegisterScreen = () => {
  const nativation = useNavigation();
  const [password, setPassword]=useState('');
  const [isPasswordSecure,setIsPasswordSecure]= useState(true);
  return(
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.view}>
            <Image source={require('../../assets/BiosmexLogo.png')} style={{marginTop:30}} />
            <BackButton title={"Register"} style={{marginRight:150,marginTop:30}}/>
            
            <Input placeholder="First Name" />
            
            
            
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
    paddingTop:50
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
  oval:{
    width:100,
    height:100,
    borderRadius:50,
    backgroundColor:'red',
    borderWidth:2,
    borderColor:'black',
    transform:[{scaleX:2}]
  }

})

export default RegisterScreen;