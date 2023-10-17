import React, { useEffect,useState,useMemo } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet,Image, SafeAreaView, ScrollView, Alert,TouchableOpacity,StatusBar,FlatList } from 'react-native';
import { Text,Input,Icon,Button } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import Header from '../../components/Header/Header';
import { useSelector } from 'react-redux';
import axios from 'axios';
import base64 from 'react-native-base64';


const ProfileScreen = () => {

  const navigation=useNavigation();
  const [userInfo, setUserInfo] = useState(null);
  const [showPersonalInfo, setShowPersonalInfo] = useState(false);
  const [showFarmInfo, setShowFarmInfo] = useState(false);
  
  const authenticationResponse = useSelector(
      (state) => state.authentication.authenticationResponse
    );

  //Connect to Odoo Database
  const baseUrl = 'http://biosmex.odoo.com:80';
  const db = 'biosmex-biosmex-production-7962955';
  const username = 'admin';
  const password = 'Nio@1234';

  const endpoint = `${baseUrl}/web/dataset/search_read`;
  const loginEndpoint = `${baseUrl}/web/session/authenticate`;

  const searchParams = {
    model: 'res.partner',
    fields: ['name', 'state_id','street','street2','zip','city','email','phone','mobile'],
  };
  const fetchUserData = async () => {
    try {
      const response = await axios.post(endpoint, {
        jsonrpc: '2.0',
        method: 'call',
        id: Math.floor(Math.random() * 100000000) + 1,
        params: {
          model: 'res.partner',
          domain: [['phone', '=', authenticationResponse.data.result.username]],
          fields: searchParams.fields,
        },
      });
  
      if (response.data && response.data.result) {
        const userData = response.data.result.records[0]; // Assuming there's only one record for the given phone number
        setUserInfo(userData);
        // Process and store the user data as needed
      } else {
        // Handle data retrieval error
        console.log("Didn't work");
      }
    } catch (error) {
      console.error(error);
      // Handle fetch error
    }
  };
  
  // Call the fetchUserData function to fetch the user data
  fetchUserData();

  const handlePersonalInfoPress = () => {
    setShowPersonalInfo(!showPersonalInfo);
    setShowFarmInfo(false);
  };

  const handleFarmInfoPress = () => {
    setShowFarmInfo(!showFarmInfo);
    setShowPersonalInfo(false);
  };
    return(
    <View style={styles.view}>
      <StatusBar backgroundColor={"white"} barStyle={"dark-content"} />
        <View style={styles.header}>
          <Header />
          <Text style={{fontWeight:"bold",letterSpacing:1,fontSize:28}}>Profile</Text>
           {/* Home Button */}
          <TouchableOpacity onPress={() => navigation.navigate("Home")}>
            <Icon type= 'material-community' size={25} name= 'home' containerStyle={{borderWidth:1,borderRadius:10,padding:12,backgroundColor:"#D3D3D3"}}/>
          </TouchableOpacity>
        </View>
        {userInfo && (
          <>
        <View style={styles.profileContainer}>
          <Image source={require('../../assets/blank-profile-picture.png')} style={styles.profileImage} />
          <Text style={styles.profileName}>{userInfo.name}</Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, showPersonalInfo && styles.activeButton]}
            onPress={handlePersonalInfoPress}
          >
            <View style={{flexDirection:"row"}}>
              <Icon type='material-community' name='account' style={{marginRight:10}}/>
              <Text style={[styles.buttonText, showPersonalInfo && styles.activeButtonText]}>Personal Info</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, showFarmInfo && styles.activeButton]}
            onPress={handleFarmInfoPress}
          >
            <View style={{flexDirection:"row"}}>
              <Icon type='material-community' name='barn' style={{marginRight:10}} />
              <Text style={[styles.buttonText, showFarmInfo && styles.activeButtonText]}>Farm Info</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button,{backgroundColor:"#404343",borderColor:"#404343"}]} onPress={() => navigation.navigate("Login")}>
            <Text style={[styles.buttonText,{color:"white"}]}>Log Out</Text>
          </TouchableOpacity>
      </View>
      {showPersonalInfo && userInfo && (
        <View style={styles.dropdownContainer}>
          <Text style={styles.userInfoText}>Name: {userInfo.name}</Text>
          <Text style={styles.userInfoText}>Email: {userInfo.email}</Text>
          <Text style={styles.userInfoText}>Phone: {userInfo.phone}</Text>
          <Text style={styles.userInfoText}>Street: {userInfo.street}</Text>
          <Text style={styles.userInfoText}>Street: {userInfo.street2}</Text>
          <Text style={styles.userInfoText}>City: {userInfo.city}</Text>
          <Text style={styles.userInfoText}>Zip: {userInfo.zip}</Text>
          <Text style={styles.userInfoText}>State: {userInfo.state_id}</Text>
          {/* Add other personal info fields */}
        </View>
      )}

      {showFarmInfo && userInfo && (
        <View style={styles.dropdownContainer}>
          <Text style={styles.userInfoText}>Farm Name: {userInfo.farmName}</Text>
          <Text style={styles.userInfoText}>Farm Location: {userInfo.farmLocation}</Text>
          {/* Add other farm info fields */}
        </View>
      )}
      </>
        )}

    </View>
    )};

const styles=StyleSheet.create({
  view: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: "#fff",
    paddingTop:50
  },
  header:{
    flexDirection:"row",
    justifyContent:"space-between",
    alignItems:"center",
    margin:20
  },
  profileContainer: {
    alignItems: "center",
    marginTop: 24,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profileName: {
    marginTop: 16,
    fontSize: 17,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    marginBottom: 20,
    marginTop:20,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom:20,
    borderColor: '#F9B712',
    width:"90%",
    alignSelf:"center"
  },
  activeButton: {
    backgroundColor: '#F9B712',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    alignSelf:"center"
  },
  activeButtonText: {
    color: 'white',
  },
  dropdownContainer: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    marginTop: 10,
  },
  userInfoText: {
    fontSize: 16,
    marginBottom: 10,
    color: '#333333',
  },
})

export default ProfileScreen;