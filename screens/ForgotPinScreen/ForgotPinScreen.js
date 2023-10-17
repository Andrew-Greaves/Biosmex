import React, { useEffect,useState,useRef } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet,Image, TouchableWithoutFeedback, Keyboard,TouchableOpacity,TextInput,ActivityIndicator,Dimensions } from 'react-native';
import { Text,Input,Icon,Button,Divider } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import base64 from 'react-native-base64';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const ForgotPinScreen = () => {
    const navigation = useNavigation();
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isLoading, setIsLoading] = useState(false); // Added loading state

    //Connect to Odoo Database
  const baseUrl = 'http://biosmex.odoo.com:80';
  const db = 'biosmex-biosmex-production-7962955';
  const username = 'admin';
  const password = 'Nio@1234';

  const endpoint = `${baseUrl}/web/dataset/search_read`;
  const loginEndpoint = `${baseUrl}/web/session/authenticate`;

  const getSessionId = async () => {
    try {
      const auth = base64.encode(`${username}:${password}`);
      const response = await axios.post(
        loginEndpoint,
        {
          jsonrpc: '2.0',
          method: 'call',
          id: Math.floor(Math.random() * 100000000) + 1,
          params: {
            db,
            login: username,
            password,
          },
        },
        {
          baseURL: baseUrl,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${auth}`,
          },
        },
      );
      return response.data.result.session_id;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const handleProceed = async () => {
    if (!phoneNumber.trim()) {
      alert("Error: Enter a phone number.");
    } else if (phoneNumber.length !== 10) {
      alert('Error: enter a valid phone number.');
    }
     else {
      setIsLoading(true); // Start loading
      try {
        const response = await axios.post(endpoint, {
          jsonrpc: '2.0',
          method: 'call',
          id: Math.floor(Math.random() * 100000000) + 1,
          params: {
            model: 'res.partner',
            domain: [['phone', '=', phoneNumber]],
            fields: ['id'],
          },
        });
  
        if (response.data && response.data.result && response.data.result.length === 0) {
          alert('Error: An account with this phone number does not exist.');
        } else {
          alert('Your PIN will be sent to you via text.')
        }
      } catch (error) {
        console.error(error);
        alert('Error: Failed to check phone number. Try Again later.');
      }
      setIsLoading(false); // Stop loading
    }
  };

    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.view}>
              <Image source={require('../../assets/BiosmexLogo.png')}  style={{ marginTop: 20 }}/>
              <View style={{ flexDirection: "row", alignItems: "center", paddingTop: 20,marginBottom:20 }}>
                  <TouchableOpacity style={{ padding: 10,alignSelf:"flex-start" }} onPress={() => navigation.navigate("Login")}>
                  <Icon type="material-community" size={35} name="arrow-left-circle" style={{ marginRight: 60 }} />
                  </TouchableOpacity>
                  <Text style={{ fontSize: 28, fontWeight: "bold",marginRight:90,letterSpacing:1}}>Forget Pin</Text>
              </View>
              <Text style={styles.text}>Cell Phone Number</Text>
              <TextInput
                  placeholder="Enter your cell phone number"
                  value={phoneNumber}
                  onChangeText={text => setPhoneNumber(text)}
                  keyboardType="numeric"
                  style={styles.input}
              />
              <TouchableOpacity style={styles.buttonContainer} onPress={() => handleProceed()} >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#ffffff" /> // Display loading indicator while processing
                ) : (
                  <Text style={styles.buttonText}>Continue</Text>
                )}
              </TouchableOpacity>
              <Image source={require('../../assets/shape.png')} style={styles.image} /> 
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
      backgroundColor: '#94BF17',
      borderRadius: 10,
      padding: 10,
      width: '80%',
      alignItems: 'center',
      alignSelf:"center",
      marginTop: 50,
    },
    buttonText: {
      color: '#FFFFFF',
      fontSize: 18,
      fontWeight: 'bold',
    },
    image: {
      position: 'absolute', // Position it absolute
      bottom: -screenHeight/5, // Align to bottom
      width: screenWidth * 2, // Set width as twice the screen width
      resizeMode: 'contain',
    },

  
  })
  
  export default ForgotPinScreen;