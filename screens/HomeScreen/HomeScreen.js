import React, { useEffect,useState } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet,Image,ActivityIndicator, SafeAreaView, ScrollView, FlatList, Alert, RefreshControl,TouchableOpacity } from 'react-native';
import { Text,Input,Icon,Button } from '@rneui/themed';
import PrimaryButton from '../../components/Buttons/PrimaryButton/PrimaryButton';
import { useNavigation } from '@react-navigation/native';
import Header from '../../components/Header/Header';
import * as Location from 'expo-location';

//set url for weather API call using api key
const openWeatherKey = `6ba95b76cace61dfa6ddc6bf59626d12`;
let url = `https://api.openweathermap.org/data/3.0/onecall?&units=metric&exclude=minutely&appid=${openWeatherKey}`;

const HomeScreen = () => {
    const navigation = useNavigation();
    // const [value, setValue] = useState(null);
    // const [isFocus, setIsFocus] = useState(false);

    const [forecast, setForecast] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadForecast = async () => {
    setRefreshing(true);

    //Ensure Location permissions are granted
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission to access location was denied');
    }

    let location = await Location.getCurrentPositionAsync({enableHighAccuracy: true});

    //Fetch weather data and translate it to JSON
    const response = await fetch( `${url}&lat=${location.coords.latitude}&lon=${location.coords.longitude}`);
    const data = await response.json();

    //Error handling and setting forcast
    if(!response.ok) {
      Alert.alert(`Error retrieving weather data: ${data.message}`); 
    } else {
      setForecast(data);
    }

    setRefreshing(false);
  }

  useEffect(() => { 
    if (!forecast) {
      loadForecast(); 
    }
  })

  if (!forecast) {
    return <SafeAreaView style={styles.loading}>
      <ActivityIndicator size="large" />
      </SafeAreaView>;
  }

  const current = forecast.current.weather[0];
    return(
    <View style={styles.view}>
        <View style={styles.header}>
        <Text style={styles.title}>Current Weather</Text>
            <Header />
        </View>
        <ScrollView 
            refreshControl={
          <RefreshControl 
            onRefresh={() => {  loadForecast() }} 
            refreshing={refreshing}
          />}
        >
            {/* <Text style={styles.title}>Current Weather</Text> */}
            <View style={styles.current}>
            <Image
                style={styles.largeIcon}
                source={{
                uri: `http://openweathermap.org/img/wn/${current.icon}@4x.png`,
                }}
            />
            <Text style={styles.currentTemp}>{Math.round(forecast.current.temp)}°C</Text>
            </View>
            
            <Text style={styles.currentDescription}>{current.description}</Text>
            <View>
            <Text style={styles.subtitle}>Hourly Forecast</Text>
            <FlatList horizontal
                data={forecast.hourly.slice(0, 24)}
                keyExtractor={(item, index) => index.toString()}
                renderItem={(hour) => {
                const weather = hour.item.weather[0];
                var dt = new Date(hour.item.dt * 1000);
                return <View style={styles.hour}>
                    <Text>{dt.toLocaleTimeString().replace(/:\d+ /, ' ')}</Text>
                    <Text>{Math.round(hour.item.temp)}°C</Text>
                    <Image
                    style={styles.smallIcon}
                    source={{
                        uri: `http://openweathermap.org/img/wn/${weather.icon}@4x.png`,
                    }}
                    />
                    <Text>{weather.description}</Text>
                </View>
                }}
                />
            </View>
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
                            <Image source={require('../../assets/rentmachinery.png')} style={styles.icon}/>
                        </TouchableOpacity>
                        <Text style={styles.iconText}> Rent Machinery</Text>
                    </View>
                    <View style={styles.iconContainer}>
                        <TouchableOpacity>
                            <Image source={require('../../assets/finprods.png')} style={styles.icon}/>
                        </TouchableOpacity>
                        <Text style={styles.iconText}>Financial Products</Text>
                    </View>
                    <View style={styles.iconContainer}>
                        <TouchableOpacity>
                            <Image source={require('../../assets/regenagri.png')} style={styles.icon}/>
                        </TouchableOpacity>
                        <Text style={styles.iconText}>Regenerative Agriculture</Text>
                    </View>
                    <View style={styles.iconContainer}>
                        <TouchableOpacity>
                            <Image source={require('../../assets/agriinfo.png')} style={styles.icon}/>
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
    // alignItems: "center",
    // justifyContent:"center",
    backgroundColor: "#fff",
    paddingTop:50
  },
  header:{
    flexDirection:"row",
    justifyContent:"space-between",
    alignItems:"center",
    margin:20
    // marginLeft:100
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
  button:{
    paddingTop:50,
    width:200
  },
  dropdownButtonText:{
    fontFamily:'Arial',
    fontWeight:'600',
    fontSize:15,
    textAlign:"left",
    color:'rgba(45,47,51,0.5)',
  },
  dropdownButton:{
    width: '80%',
    height: 30,
    marginTop:40,
    
  },
  dropdownsearchInputStyle:{
    backgroundColor: 'slategray',
    borderBottomWidth: 1,
    borderBottomColor: '#FFF',
  },
  
  title: {
    // width: '100%',
    // textAlign: 'center',
    fontSize: 42,
    color: '#46D17E',
    // marginTop:40
  },
  subtitle: {
    fontSize: 24,
    marginVertical: 12,
    marginLeft: 4,
    color: '#46D17E',
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
    alignItems:"center"
  },
  row:{
    flexDirection:"row"
  },
  icon:{
    marginTop:10,
    marginLeft:10
  },
  iconText:{
    fontSize:12,
    fontFamily:'Arial',
    marginLeft:15,
    
  },
  iconContainer:{
    alignItems:"center",
    flexShrink:1
  }

})

export default HomeScreen;