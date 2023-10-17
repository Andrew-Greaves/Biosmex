import React, { useEffect,useState } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet,Image, TouchableWithoutFeedback, Keyboard,TouchableOpacity,ActivityIndicator,StatusBar,Dimensions } from 'react-native';
import { Text,Input,Icon} from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setAuthenticationResponse } from '../../components/Redux/AuthenticationAction';

const screenWidth = Dimensions.get('window').width;

const LoginScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [pin, setPin] = useState('');
  const [phone, setPhone] = useState('');
  const [isPasswordSecure, setIsPasswordSecure] = useState(true);
  const [isLoading, setIsLoading] = useState(false); // Added loading state

  // Connect to Odoo Database
  const baseUrl = 'http://biosmex.odoo.com:80';
  const db = 'biosmex-biosmex-production-7962955';
  const endpoint = `${baseUrl}/web/session/authenticate`;

  const handleProceed = async () => {
    if (!phone.trim() || !pin.trim()) {
      alert('Error: Missing Phone Number or PIN');
      return;
    }

    setIsLoading(true); // Start loading

    try {
      const response = await axios.post(endpoint, {
        jsonrpc: '2.0',
        params: {
          db,
          login: phone,
          password: pin,
        },
      });

      if (response && response.data && response.data.result) {
        navigation.navigate('Home');
        dispatch(setAuthenticationResponse(response));
      } else {
        alert('Login failed: Phone Number or PIN incorrect');
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false); // Stop loading
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.view}>
        <StatusBar backgroundColor={"white"} barStyle={"dark-content"} />
        <Image source={require('../../assets/BiosmexLogo.png')} style={{ marginTop: 30 }} />
        <Text style={styles.LoginText}>Login</Text>
        <TouchableOpacity>
          <Text style={{ color: '#94BF17', fontSize: 20, margin:10 }}>By signing in you are agreeing to our terms and privacy policy.</Text>
        </TouchableOpacity>
        <Input
          placeholder="Phone Number"
          keyboardType="number-pad"
          maxLength={10} // Set the maxLength to 10
          leftIcon={<Icon type="material-community" name="phone" />}
          onChangeText={(text) => setPhone(text)}
        />
        <Input
          placeholder="PIN"
          secureTextEntry={isPasswordSecure}
          keyboardType="number-pad"
          maxLength={4} // Set the maxLength to 4
          leftIcon={<Icon type="material-community" name="lock-outline" />}
          rightIcon={<Icon type="material-community" name="eye" onPress={() => setIsPasswordSecure(!isPasswordSecure)} />}
          onChangeText={(text) => setPin(text)}
        />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={{ color: '#94BF17', fontSize: 18,marginRight:40 }}>Don't have an account?</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('ForgotPin')}>
            <Text style={{ color: '#94BF17', fontSize: 18, marginLeft:20 }}>Forgot PIN?</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.buttonContainer} onPress={() => handleProceed()}>
          {isLoading ? (
            <ActivityIndicator size="small" color="#ffffff"/> // Display loading indicator while processing
          ) : (
            <Text style={styles.buttonText}>Log In</Text>
          )}
        </TouchableOpacity>
        <Image source={require('../../assets/shape.png')} style={styles.image} /> 
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles=StyleSheet.create({
  view: {
    flex: 1,
    width: "100%",
    height: "100%",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingTop:50
  },
  LoginText: {
    textAlign: "center",
    fontFamily:'Arial',
    fontSize:34,
    fontWeight:'600',
    marginTop: 20,
    letterSpacing:1
  },
  buttonContainer: {
    backgroundColor: '#94BF17',
    borderRadius: 10,
    padding: 10,
    width: '80%',
    alignItems: 'center',
    alignSelf:"center",
    marginTop: 40,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  image: {
    width: screenWidth*2,
    marginBottom: 0,
    resizeMode: 'contain',
  },
 

})

export default LoginScreen;