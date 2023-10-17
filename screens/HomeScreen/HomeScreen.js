import React, { useEffect,useState,useMemo } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet,Image,ActivityIndicator, SafeAreaView, ScrollView, Alert, RefreshControl,TouchableOpacity,StatusBar,FlatList } from 'react-native';
import { Text,Input,Icon,Button } from '@rneui/themed';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Header from '../../components/Header/Header';
import * as Location from 'expo-location';
import { useRoute } from '@react-navigation/native';

//set url for weather API call using api key
const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/weather?&units=metric';
const API_KEY = 'Your openweather API key';
const WEATHER_DATA_KEY = 'weatherData';

const HomeScreen = () => {
  const navigation=useNavigation();
  const [weatherData, setWeatherData] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadWeatherData = async () => {
    setRefreshing(true);

    // Check if weather data is already cached
    const cachedWeatherData = await AsyncStorage.getItem(WEATHER_DATA_KEY);
    if (cachedWeatherData) {
      setWeatherData(JSON.parse(cachedWeatherData));
    }

    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission to access location was denied');
      setRefreshing(false);
      return;
    }

    let location = await Location.getCurrentPositionAsync({ enableHighAccuracy: true });

    const url = `${WEATHER_API_URL}&lat=${location.coords.latitude}&lon=${location.coords.longitude}&appid=${API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      Alert.alert(`Error retrieving weather data: ${data.message}`);
    } else {
      setWeatherData(data);
      // Cache weather data
      await AsyncStorage.setItem(WEATHER_DATA_KEY, JSON.stringify(data));
    }

    setRefreshing(false);
  };

  useEffect(() => {
    if (!weatherData) {
      loadWeatherData();
    }
  }, [weatherData]);

  if (!weatherData) {
    return (
      <SafeAreaView style={styles.loading}>
        <ActivityIndicator size="large" />
        <Text style={styles.title}>Loading Home Screen</Text>
      </SafeAreaView>
    );
  }

  const { weather, main } = weatherData;
  const currentWeather = weather?.[0];

    return(
    <View style={styles.view}>
      <StatusBar backgroundColor={"white"} barStyle={"dark-content"} />
        <View style={styles.header}>
          <View>
            <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
                <Icon type='material-community' name='account-circle-outline' size={35} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
                <Text style={{fontSize:16,fontWeight:"bold"}}>Profile</Text>
            </TouchableOpacity>
          </View>
          <Header />
        </View>
      <Text style={styles.title}>Current Weather</Text>
      <ScrollView
        refreshControl={
          <RefreshControl onRefresh={loadWeatherData} refreshing={refreshing} />
        }
      >
        <View style={styles.current}>
          <Image
            style={styles.largeIcon}
            source={{
              uri: `http://openweathermap.org/img/wn/${currentWeather?.icon}.png`,
            }}
          />
          <Text style={styles.currentTemp}>{Math.round(main?.temp)}°C</Text>
        </View>
        <Text style={styles.currentDescription}>{currentWeather?.description}</Text>
        <Text style={styles.currentFeelsLike}>Feels like: {Math.round(main?.feels_like)}°C</Text>
        <Text style={styles.currentHumidity}>Humidity: {main?.humidity}%</Text>
        <Text style={styles.currentWindSpeed}>Wind speed: {weatherData?.wind?.speed} km/h</Text>
        <View style={styles.rectangle}>
            <View style={styles.row}>
                {/* ICONS */}
                <View style={styles.iconContainer}>
                    <TouchableOpacity onPress={() => navigation.navigate("BuyInputs")}>
                        <Image source={require('../../assets/buyinputs.png')} style={styles.icon}/>
                    </TouchableOpacity>
                    <Text style={styles.iconText}>Buy Inputs</Text>
                </View>
                
                <View style={styles.iconContainer}>
                    <TouchableOpacity>
                        <Image source={require('../../assets/buyagroinsurance.png')} style={styles.icon}/>
                    </TouchableOpacity>
                    <Text style={styles.iconText}>Buy Agro Insurance</Text>
                </View>
                <View style={styles.iconContainer}>
                    <TouchableOpacity>
                        <Image source={require('../../assets/govprograms.png')} style={styles.icon}/>
                    </TouchableOpacity>
                    <Text style={styles.iconText}>Government Programs</Text>
                </View>
                <View style={styles.iconContainer}>
                    <TouchableOpacity>
                        <Image source={require('../../assets/sellagri.png')} style={styles.icon}/>
                    </TouchableOpacity>
                    <Text style={styles.iconText}>Sell Products</Text>
                </View>
            </View>
            <View style={styles.row}>
                <View style={styles.iconContainer}>
                    <TouchableOpacity>
                        <Image source={require('../../assets/rentmachinery.png')} style={styles.iconRowTwo}/>
                    </TouchableOpacity>
                    <Text style={styles.iconText}> Rent Machinery</Text>
                </View>
                <View style={styles.iconContainer}>
                    <TouchableOpacity>
                        <Image source={require('../../assets/finprods.png')} style={styles.iconRowTwo}/>
                    </TouchableOpacity>
                    <Text style={styles.iconText}>Financial Products</Text>
                </View>
                <View style={styles.iconContainer}>
                    <TouchableOpacity>
                        <Image source={require('../../assets/regenagri.png')} style={styles.iconRowTwo}/>
                    </TouchableOpacity>
                    <Text style={styles.iconText}>Regenerative Agriculture</Text>
                </View>
                <View style={styles.iconContainer}>
                    <TouchableOpacity>
                        <Image source={require('../../assets/agriinfo.png')} style={styles.iconRowTwo}/>
                    </TouchableOpacity>
                    <Text style={styles.iconText}>Agricultural Information</Text>
                </View>
              </View>
          </View>
        </ScrollView>
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
  button: {
    width: "75%",
    height:50,
    marginTop: 10
  },
  Icon: {
    marginTop: 75
  },
  button:{
    paddingTop:50,
    width:200
  },
  title: {
    fontSize: 42,
    color: '#94BF17',
    marginLeft:10,
  },
  subtitle: {
    fontSize: 24,
    marginVertical: 12,
    marginLeft: 4,
    color: '#F9B712',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  loading: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  current: {
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
  },
  currentTemp: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
  },  
  currentDescription: {
    width: '100%',
    textAlign: 'center',
    fontWeight: '200',
    fontSize: 24,
    marginBottom: 24
  },
  currentFeelsLike: {
    fontSize: 15,
    marginBottom: 5,
    marginLeft:10
  },
  currentHumidity: {
    fontSize: 15,
    marginBottom: 5,
    marginLeft:10
  },
  currentWindSpeed: {
    fontSize: 15,
    marginBottom: 5,
    marginLeft:10
  },
  hour: {
    padding: 6,
    alignItems: 'center',
  },
  day: {
    flexDirection: 'row',
  },
  dayDetails: {
    justifyContent: 'center',
  },
  dayTemp: {
    marginLeft: 12,
    alignSelf: 'center',
    fontSize: 20
  },
  largeIcon: {
    width: 250,
    height: 200,
  },
  smallIcon: {
    width: 100,
    height: 100,
  },
  rectangle:{
    backgroundColor: "transparent",
    borderWidth:1,
    borderRadius:20,
    borderColor:"#949494",
    marginVertical: 5,
    height:250,
    width:350,
    marginLeft:20,
    justifyContent:"space-around",
    alignItems:"center",
    marginTop:30,
  },
  row:{
    flexDirection:"row",
    alignItems:"center",
  },
  icon:{
    marginTop:10,
    marginLeft:10,
    alignSelf:"center"
  },
  iconRowTwo:{
    marginTop:10,
    marginLeft:15,
    alignSelf:"center"
  },
  iconText:{
    fontSize:11,
    fontFamily:'Arial',
    marginLeft:15,
    
  },
  iconContainer:{
    alignItems:"center",
    flexShrink:1,
    justifyContent:"space-between"
  }

})

export default HomeScreen;