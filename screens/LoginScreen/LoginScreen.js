import React, { useEffect,useState } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet,Image, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Text,Input,Icon,Button } from '@rneui/themed';
import PrimaryButton from '../../components/Buttons/PrimaryButton/PrimaryButton';
import { useNavigation } from '@react-navigation/native';

const LoginScreen = () => {
  const navigation = useNavigation();
  const [password, setPassword]=useState('');
  const [isPasswordSecure,setIsPasswordSecure]= useState(true);
  return(
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.view}>
            <Image source={require('../../assets/BiosmexLogo.png')} style={{marginTop:30}} />
            <Text style={styles.LoginText}>Login</Text>
            <Button title={"By signing in you are agreeing to our terms and privacy policy"} type={'clear'} titleStyle={{color:'#46D17E'}}/>
            <Input placeholder="Phone Number" keyboardType="number-pad" leftIcon={<Icon type= 'material-community' name= 'phone'/>} />
            <Input placeholder="PIN" 
            secureTextEntry={isPasswordSecure} 
            leftIcon={ <Icon type= 'material-community' name= 'lock-outline'/> }
            rightIcon={<Icon type= 'material-community' name= 'eye' onPress={() => setIsPasswordSecure(!isPasswordSecure)}/>}/>
            <View style={{flexDirection:"row"}}>
                <Button title={"Don't have an account?"} onPress={() => navigation.navigate("Register")} type={'clear'} titleStyle={{color:'#46D17E'}}/>
                <Button title={"Forgot PIN?"} type={'clear'} titleStyle={{color:'#46D17E'}}/>
            </View>
            <PrimaryButton title={"Login"} style={styles.button} onPress={() => navigation.navigate("Home")}/>
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

export default LoginScreen;