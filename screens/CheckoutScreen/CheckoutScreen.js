import React, { useEffect,useState } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet,Image, TouchableWithoutFeedback, Keyboard,ScrollView,TextInput,KeyboardAvoidingView,TouchableOpacity,StatusBar } from 'react-native';
import { Text,Input,Icon,Button,Divider,CheckBox } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import {Calendar, LocaleConfig} from 'react-native-calendars';
import CartItem from '../../components/CartItem/CartItem';

const paymentOptions = [
    {
      label: 'Cash on Delivery',
      value: 'cash',
      icon: 'currency-usd'
    },
    {
      label: 'Mercado Pago',
      value: 'mercado',
      image: require('../../assets/mercadopago.png')
    },
    {
      label: 'BanCoppel',
      value: 'bancoppel',
      image: require('../../assets/bancoppel.png')
    },
    {
      label: 'Openpay',
      value: 'openpay',
      image: require('../../assets/openpay.png')
    }
  ];

const CheckoutScreen = ({ route }) => {
    const { cartItems } = route.params;
    const navigation = useNavigation();
    const [subtotal, setSubtotal] = useState(0);
    const [tax, setTax] = useState(0.16);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        let total = 0;
        cartItems.forEach(item => {
        total += item.product.list_price * item.quantity;
        });
        setSubtotal(total);
        setTotal(total + (total * tax));
    }, [cartItems]);

    // Delivery details state
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [country, setCountry] = useState('Mexico');

  const [showEarliestCalendar, setShowEarliestCalendar] = useState(false);
  const [showLatestCalendar, setShowLatestCalendar] = useState(false);
  const [earliestDate, setEarliestDate] = useState('');
  const [latestDate, setLatestDate] = useState('');

  const handleEarliestDatePress = () => {
    setShowEarliestCalendar(true);
    setShowLatestCalendar(false);
  };

  const handleLatestDatePress = () => {
    setShowEarliestCalendar(false);
    setShowLatestCalendar(true);
  };

  const handleEarliestDateSelect = (date) => {
    setEarliestDate(date.dateString);
    setShowEarliestCalendar(false);
  };

  const handleLatestDateSelect = (date) => {
    setLatestDate(date.dateString);
    setShowLatestCalendar(false);
  };

  const handlePlaceOrder = () => {
    if (!address.trim() || !city.trim() || !state.trim() || !zip.trim() || !earliestDate.trim() || !latestDate.trim()) {
      alert('Please fill in all fields');
      return;
    }
    if (new Date(latestDate) < new Date(earliestDate)) {
        alert('Latest date cannot be earlier than earliest date');
        return;
    }
    alert("Order Placed!");
    // Perform order placement logic
  }

const [selectedPaymentOption, setSelectedPaymentOption] = useState(paymentOptions[0].value);

    return(
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.view}
        >
            <View style={styles.view}>
              <StatusBar backgroundColor={"white"} barStyle={"dark-content"} />
              <ScrollView showsVerticalScrollIndicator={false}>
                  <Text style={{fontSize: 28, fontWeight: '500', letterSpacing: 1, marginBottom: 20}}>Checkout</Text>
                  <View style={styles.box}>
                      <View style={{flexDirection:"row", justifyContent:"space-between"}}>
                        <Text style={{fontSize: 18, fontWeight: '500', letterSpacing: 1, marginBottom: 20}}>Order Summary</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('BuyInputs')}>
                            <Text style={{fontSize:14,color:"blue",fontWeight:400}}>Edit</Text>
                        </TouchableOpacity>
                      </View>
                      {cartItems.map(item => (
                          <CartItem item={item} key={item.product.id} />
                      ))}
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
                        <Text style={{ fontWeight: 'bold' }}>Subtotal:</Text>
                        <Text>${subtotal.toFixed(2)}</Text>
                      </View>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10,marginBottom:10 }}>
                        <Text style={{ fontWeight: 'bold' }}>Taxes ({(tax * 100).toFixed(0)}%):</Text>
                        <Text>${(subtotal * tax).toFixed(2)}</Text>
                      </View>
                      <Divider width={2}/>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                        <Text style={{ fontWeight: 'bold' }}>Total:</Text>
                        <Text>${total.toFixed(2)}</Text>
                      </View>
                  </View>
                  
                  <View style={styles.box}>
                      <Text style={{fontSize: 18, fontWeight: '500', letterSpacing: 1, marginBottom: 20}}>Delivery Details</Text>
                      <View style={{ marginBottom: 10 }}>
                        <TextInput
                        placeholder="Address"
                        value={address}
                        onChangeText={setAddress}
                        style={styles.input}
                        />
                        <TextInput
                        placeholder="City"
                        value={city}
                        onChangeText={setCity}
                        style={styles.input}
                        />
                        <TextInput
                        placeholder="State"
                        value={state}
                        onChangeText={setState}
                        style={styles.input}
                        />
                        <TextInput
                        placeholder="ZIP"
                        value={zip}
                        onChangeText={setZip}
                        style={styles.input}
                        />
                        <TextInput
                        placeholder="Country"
                        value="Mexico"
                        editable={false}
                        style={styles.input}
                        />
                      </View>
                      <View style={styles.container}>
                          <TouchableOpacity onPress={handleEarliestDatePress}>
                              <Text style={[styles.cartText,{fontSize:15}]}>Earliest Delivery Date: {earliestDate}</Text>
                          </TouchableOpacity>
                          {showEarliestCalendar && (
                              <Calendar
                              onDayPress={handleEarliestDateSelect}
                              onDayLongPress={handleEarliestDateSelect}
                              monthFormat={'MMMM yyyy'}
                              hideExtraDays={true}
                              disableMonthChange={true}
                              markedDates={{
                                  [earliestDate]: { selected: true, disableTouchEvent: true, selectedDotColor: 'orange' }
                              }}
                              theme={{
                                  backgroundColor: '#ffffff',
                                  calendarBackground: '#ffffff',
                                  textSectionTitleColor: '#b6c1cd',
                                  selectedDayBackgroundColor: '#00adf5',
                                  selectedDayTextColor: '#ffffff',
                                  todayTextColor: '#00adf5',
                                  dayTextColor: '#2d4150',
                                  textDisabledColor: '#d9e1e8',
                                  dotColor: '#00adf5',
                                  selectedDotColor: '#ffffff',
                                  arrowColor: 'orange',
                                  disabledArrowColor: '#d9e1e8',
                                  monthTextColor: '#2d4150',
                                  indicatorColor: 'orange',
                                  textDayFontWeight: 'bold',
                                  textMonthFontWeight: 'bold',
                                  textDayHeaderFontWeight: 'bold',
                                  textDayFontSize: 14,
                                  textMonthFontSize: 14,
                                  textDayHeaderFontSize: 14
                              }}
                              />
                          )}
                          <TouchableOpacity onPress={handleLatestDatePress}>
                              <Text style={[styles.cartText,{fontSize:15}]}>Latest Delivery Date: {latestDate}</Text>
                          </TouchableOpacity>
                          {showLatestCalendar && (
                              <Calendar
                              onDayPress={handleLatestDateSelect}
                              onDayLongPress={handleLatestDateSelect}
                              monthFormat={'MMMM yyyy'}
                              hideExtraDays={true}
                              disableMonthChange={true}
                              markedDates={{
                                  [latestDate]: { selected: true, disableTouchEvent: true, selectedDotColor: 'orange' }
                              }}
                              theme={{
                                  backgroundColor: '#ffffff',
                                  calendarBackground: '#ffffff',
                                  textSectionTitleColor: '#b6c1cd',
                                  selectedDayBackgroundColor: '#00adf5',
                                  selectedDayTextColor: '#ffffff',
                                  todayTextColor: '#00adf5',
                                  dayTextColor: '#2d4150',
                                  textDisabledColor: '#d9e1e8',
                                  dotColor: '#00adf5',
                                  selectedDotColor: '#ffffff',
                                  arrowColor: 'orange',
                                  disabledArrowColor: '#d9e1e8',
                                  monthTextColor: '#2d4150',
                                  indicatorColor: 'orange',
                                  textDayFontWeight: 'bold',
                                  textMonthFontWeight: 'bold',
                                  textDayHeaderFontWeight: 'bold',
                                  textDayFontSize: 14,
                                  textMonthFontSize: 14,
                                  textDayHeaderFontSize: 14
                              }}
                              />
                          )}
                        </View>
                    </View>
                    <View style={styles.box}>
                        <Text style={{fontSize: 18, fontWeight: '500', letterSpacing: 1, marginBottom: 20}}>Payment Method</Text>
                        {paymentOptions.map((option, index) => (
                        <View key={index} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
                            
                            <CheckBox
                            checked={selectedPaymentOption === option.value}
                            onPress={() => setSelectedPaymentOption(option.value)}
                            checkedIcon="dot-circle-o"
                            uncheckedIcon="circle-o"
                            />
                            {option.icon ? (
                                <Icon type="material-community" name={option.icon} style={{ width: 20, height: 20, marginLeft: 10 }} />
                            ) : (
                                <Image source={option.image} style={{ width: 50, height: 20, marginRight: 10 }} />
                            )}
                            <Text style={[{ marginLeft: 30,fontWeight: '500' }, index === 0 && { marginLeft:60 }]}>{option.label}</Text>
                        </View>
                        ))}
                    </View>
                    <TouchableOpacity style={styles.orderButton} onPress={() => handlePlaceOrder()}>
                        <Text style={styles.buttonText}>Place Order</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.orderButton, styles.cancelButton]} onPress={() => navigation.navigate('BuyInputs')}>
                        <Text style={styles.buttonText}>Cancel</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        </KeyboardAvoidingView>
)};

const styles=StyleSheet.create({
  view: {
    flex: 1,
    width: "100%",
    height: "100%",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingTop:35,
    paddingBottom:30
  },
  cartText: {
    marginBottom: 10,
    fontWeight: 'bold',
    fontSize: 13
  },
  box:{
    width: '100%', 
    backgroundColor: '#fff', 
    borderRadius: 10, 
    padding: 20, 
    borderWidth: 1, 
    marginBottom: 10
  },
  inputContainer: {
    marginTop: 10,
    marginBottom: 10,
  },
  inputLabel: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 5,
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
  container: {
    flex: 1,
  },
  orderButton: {
    backgroundColor: '#94BF17',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: '#404343',
  },
  buttonText:{
    color: '#fff',
    fontWeight: 'bold'
  }

})

export default CheckoutScreen;