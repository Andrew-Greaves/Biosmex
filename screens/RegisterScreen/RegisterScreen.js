import React, { useEffect,useState,useRef } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet,Image, TouchableWithoutFeedback, Keyboard,ScrollView,TouchableOpacity,TextInput,FlatList,KeyboardAvoidingView,ActivityIndicator,StatusBar } from 'react-native';
import { Text,Input,Icon,Button,Divider } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import { SelectList } from 'react-native-dropdown-select-list';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import axios from 'axios';
import base64 from 'react-native-base64';

// An array of objects containing state options
const states = [
  { key: '0', value: 'Aguascalientes' },
  { key: '1', value: 'Baja California' },
  { key: '2', value: 'Baja California Sur' },
  { key: '3', value: 'Campeche' },
  { key: '4', value: 'Coahuila' },
  { key: '5', value: 'Colima' },
  { key: '6', value: 'Chiapas' },
  { key: '7', value: 'Chihuahua' },
  { key: '8', value: 'Distrito Federal' },
  { key: '9', value: 'Durango' },
  { key: '10', value: 'Guanajuato' },
  { key: '11', value: 'Guerrero' },
  { key: '12', value: 'Hidalgo' },
  { key: '13', value: 'Jalisco' },
  { key: '14', value: 'México' },
  { key: '15', value: 'Michoacán' },
  { key: '16', value: 'Morelos' },
  { key: '17', value: 'Nayarit' },
  { key: '18', value: 'Nuevo León' },
  { key: '19', value: 'Oaxaca' },
  { key: '20', value: 'Puebla' },
  { key: '21', value: 'Querétaro' },
  { key: '22', value: 'Quintana Roo' },
  { key: '23', value: 'San Luis Potosí' },
  { key: '24', value: 'Sinaloa' },
  { key: '25', value: 'Sonora' },
  { key: '26', value: 'Tabasco' },
  { key: '27', value: 'Tamaulipas' },
  { key: '28', value: 'Tlaxcala' },
  { key: '29', value: 'Veracruz' },
  { key: '30', value: 'Yucatán' },
  { key: '31', value: 'Zacatecas' },
];

const RegisterScreen = () => {
  const navigation = useNavigation();
  // const [password, setPassword]=useState('');
  // const [isPasswordSecure,setIsPasswordSecure]= useState(true);
 
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [secondSurname, setSecondSurname] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [street, setStreet] = useState('');
  const [population, setPopulation] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [municipality, setMunicipality] = useState('');
  const [country, setCountry] = useState('Mexico');
  const [state, setState] = useState([]);

  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');

  const [isLoading, setIsLoading] = useState(false); // Added loading state

  //Connect to Odoo Database
  const baseUrl = 'http://biosmex.odoo.com:80';
  const db = 'biosmex-biosmex-production-7962955';
  const username = 'admin';
  const password = 'Nio@1234';

  const endpoint = `${baseUrl}/web/dataset/search_read`;
  const loginEndpoint = `${baseUrl}/web/session/authenticate`;
  const createEndpoint = `${baseUrl}/web/dataset/call_kw`;

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

  const handlePinChange = (value) => {
    // Only allow 4 digits
    if (value.length <= 4) {
      setPin(value);
    }
  };

  const handleConfirmPinChange = (value) => {
    // Only allow 4 digits
    if (value.length <= 4) {
      setConfirmPin(value);
    }
  };

  const handleProceed = async () => {
    if (pin.length !== 4) {
      alert("Error: PIN must be 4 digits long.");
    } else if (pin !== confirmPin) {
      alert("Error: PIN and Confirm PIN do not match.");
    } else if (
      !name.trim() ||
      !lastName.trim() ||
      !phoneNumber.trim() ||
      !street.trim() ||
      !population.trim() ||
      !postalCode.trim() ||
      !municipality.trim() ||
      state.length === 0
    ) {
      alert("Please fill in all fields");
    } else if (phoneNumber.length !== 10) {
      alert("Error: enter a valid phone number.");
    } else {
      setIsLoading(true); // Start loading
      try {
        const response = await axios.post(endpoint, {
          jsonrpc: "2.0",
          method: "call",
          id: Math.floor(Math.random() * 100000000) + 1,
          params: {
            model: "res.partner",
            domain: [["phone", "=", phoneNumber]],
            fields: ["id"],
          },
        });
  
        if (response.data && response.data.result && response.data.result.length > 0) {
          alert("Error: An account already exists with this phone number. Please enter a different one.");
        } else {
          const combinedName = `${name} ${lastName} ${secondSurname}`.trim(); // Combine name, lastName, and secondSurname
  
          // Create a new user in res.partner table
          const createPartnerResponse = await axios.post(createEndpoint, {
            jsonrpc: "2.0",
            method: "call",
            id: Math.floor(Math.random() * 100000000) + 1,
            params: {
              model: "res.partner",
              method: "create",
              args: [{
                name:combinedName,
                phone: phoneNumber,
                street:street,
                street2:population,
                zip:postalCode,
                state_id:state[0],
                city:municipality,
                email:emailAddress,
                country_id:country
            
                // Include other fields here
              }],
              kwargs: {
                context: {
                  lang: "en_US"
                }
              }
            },
          });

          if (createPartnerResponse.data && createPartnerResponse.data.result){
           console.log(createPartnerResponse.data.result)
          }else{
            console.log("Error creating user partner");
          }
          
          // Create a new user in res.users table
          // const createUserResponse = await axios.post(createEndpoint, {
          //   jsonrpc: "2.0",
          //   method: "call",
          //   id: Math.floor(Math.random() * 100000000) + 1,
          //   params: {
          //     model: "res.users",
          //     method: "call",
          //     args: [
          //       {
          //         login: phoneNumber,
          //         password: pin,
          //         partner_id: createPartnerResponse.data.result, // Assign the partner_id of the newly created partner
          //       },
          //     ],
          //     kwargs: {
          //       context: {
          //         lang: "en_US"
          //       }
          //     }
          //   },
          // });
  
          // // Handle the createUserResponse accordingly (e.g., check if user creation was successful)
          // if (createUserResponse.data && createUserResponse.data.result){
          //   navigation.navigate("FarmRegistration");
          // }else{
          //   console.log("Error creating user");
          // }
          
        }
      } catch (error) {
        console.error(error);
        alert("Error: Failed to check phone number. Try Again later.");
      }
      setIsLoading(false); // Stop loading
    }
  };
  
  
  

  return(
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.view}>
          <StatusBar backgroundColor={"white"} barStyle={"dark-content"} />
          <Image source={require('../../assets/BiosmexLogo.png')}  />
          <View style={{ flexDirection: "row", alignItems: "center", paddingTop: 20,marginBottom:20 }}>
            <TouchableOpacity style={{ padding: 10,alignSelf:"flex-start" }} onPress={() => navigation.navigate("Login")}>
            <Icon type="material-community" size={35} name="arrow-left-circle" style={{ marginRight: 60 }} />
            </TouchableOpacity>
            <Text style={{ fontSize: 28, fontWeight: "bold",marginRight:90,letterSpacing:1}}>Registration</Text>
          </View>
          <KeyboardAwareScrollView  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <View>
              <Text style={styles.text}>Name</Text>
              <TextInput
                placeholder="Enter your name"
                value={name}
                onChangeText={text => setName(text)}
                style={styles.input}
              />

              <Text style={styles.text}>Last Name</Text>
              <TextInput
                placeholder="Enter your last name"
                value={lastName}
                onChangeText={text => setLastName(text)}
                style={styles.input}
              />

              <Text style={styles.text}>Second Surname</Text>
              <TextInput
                placeholder="Enter your second surname"
                value={secondSurname}
                onChangeText={text => setSecondSurname(text)}
                style={styles.input}
              />

              <Text style={styles.text}>Cell Phone Number</Text>
              <TextInput
                placeholder="Enter your cell phone number"
                value={phoneNumber}
                onChangeText={text => setPhoneNumber(text)}
                keyboardType="numeric"
                style={styles.input}
              />

              <Text style={styles.text}>Email Address (Optional)</Text>
              <TextInput
                placeholder="Enter your email address"
                value={emailAddress}
                onChangeText={text => setEmailAddress(text)}
                keyboardType="email-address"
                style={styles.input}
              />

              <Text style={styles.text}>Street</Text>
              <TextInput
                placeholder="Enter your street"
                value={street}
                onChangeText={text => setStreet(text)}
                style={styles.input}
              />

              <Text style={styles.text}>Population</Text>
              <TextInput
                placeholder="Enter your population"
                value={population}
                onChangeText={text => setPopulation(text)}
                style={styles.input}
              />

              <Text style={styles.text}>Postal Code</Text>
              <TextInput
                placeholder="Enter your postal code"
                value={postalCode}
                onChangeText={text => setPostalCode(text)}
                keyboardType="numeric"
                style={styles.input}
              />

              <Text style={styles.text}>Municipality</Text>
              <TextInput
                placeholder="Enter your municipality"
                value={municipality}
                onChangeText={text => setMunicipality(text)}
                style={styles.input}
              />
              
              <Text style={styles.text}>State</Text>
              <SelectList 
                  setSelected={(val) => setState(val)} 
                  data={states} 
                  save="value"
                  label="States"
              />

              <Text style={styles.text}>Country</Text>
              <TextInput
                placeholder="Enter your country"
                value={country}
                onChangeText={text => setCountry(text)}
                editable={false}
                style={styles.input}
              />

            </View>
            <Divider width={2} style={{marginTop:10}}/>
            <View style={{marginTop:10}}>
              <Text style={styles.text}>
              ATTENTION: CONFIDENTIAL PIN CREATED FOR YOUR PERSONAL USE. Do not share your PIN with anyone, either by phone or by email. Your pin provides an additional layer of security to the electronic transaction process.
              </Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 20 }}>
                <Text style={[styles.text,{ fontSize: 18 }]}>PIN:</Text>
                <TextInput
                  placeholder="Enter your 4 digit PIN"
                  value={pin}
                  onChangeText={handlePinChange}
                  keyboardType="numeric"
                  secureTextEntry={true}
                  style={{ borderWidth: 1, borderColor: '#000', borderRadius: 5, padding: 10, width: '60%' }}
                />
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
                <Text style={[styles.text,{ fontSize: 18 }]}>Confirm PIN:</Text>
                <TextInput
                  placeholder="Confirm your 4 digit PIN"
                  value={confirmPin}
                  onChangeText={handleConfirmPinChange}
                  keyboardType="numeric"
                  secureTextEntry={true}
                  style={{ borderWidth: 1, borderColor: '#000', borderRadius: 5, padding: 10, width: '60%' }}
                />
              </View>
            </View>
            <TouchableOpacity style={styles.buttonContainer} onPress={() => handleProceed()} >
              {isLoading ? (
                <ActivityIndicator size="small" color="#ffffff" /> // Display loading indicator while processing
              ) : (
                <Text style={styles.buttonText}>Continue</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={{color:"#94BF17",alignSelf:"center",marginTop:15,fontSize:15}}>Already have an account?</Text>
            </TouchableOpacity>
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
    backgroundColor: '#94BF17',
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

export default RegisterScreen;