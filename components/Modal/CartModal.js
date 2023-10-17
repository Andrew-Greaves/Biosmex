import React, { useState,useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, Image, StyleSheet,SafeAreaView } from 'react-native';
import { Icon, Divider } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';


const cartItems=[];

const CartModal = ({ cartItems, removeFromCart, modalVisible, setModalVisible,addToCart,setCartItems }) => {
  const navigation = useNavigation();
  const [cartTotal, setCartTotal] = useState(0);
  

  const calculateCartTotal = () => {
    let total = 0;
    cartItems.forEach(item => {
      total += item.product.list_price * item.quantity;
    });
    setCartTotal(total);
  };

  useEffect(() => {
    calculateCartTotal();
  }, [cartItems]);

  const handleRemoveItem = (item) => {
    if (item.quantity > 1) {
      removeFromCart(item.product.id, 1);
    } 
  };

  const removeAll=(item) => {
    removeFromCart(item.product.id,item.quantity);
  };

  const handleAddItem=(item) => {
    const product = item.product;
  const existingItem = cartItems.find(item => item.product.id === product.id);

  if (existingItem) {
    // If the item is already in the cart, add one to the quantity
    const updatedItem = { product, quantity: existingItem.quantity + 1 };
    const updatedCartItems = cartItems.map(item => item.product.id === product.id ? updatedItem : item);
    setCartItems(updatedCartItems);
  } else {
    // If the item is not in the cart, add it with a quantity of 1
    addToCart(product, 1);
  }
  }


  const renderItem = ({ item }) => {
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
        <Image source={{ uri: item.product.image_128 }} style={{ width: 50, height: 50 }} />
        <View style={{ marginLeft: 10 }}>
          <Text style={styles.cartText}>{item.product.name}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.cartText}>Quantity: {item.quantity}</Text>
            <TouchableOpacity style={{ marginLeft: 10,marginBottom:10 }} onPress={() => item.quantity > 1 && handleRemoveItem(item)}>
                <Icon name="minus-circle-outline" type="material-community" size={24} color={item.quantity > 1 ? '#000' : '#ccc'} />
            </TouchableOpacity>
            <TouchableOpacity style={{ marginLeft: 10,marginBottom:10 }} onPress={() => handleAddItem(item)}>
                <Icon name="plus-circle-outline" type="material-community" size={24} color={'#000'} />
            </TouchableOpacity>
          </View>
          <Text style={styles.cartText}>Price: ${item.product.list_price}</Text>
          <Divider />
        </View>
        <TouchableOpacity style={{ marginLeft: 'auto' }} onPress={() => removeAll(item)}>
          <Icon name="trash-can-outline" type="material-community" size={24} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Modal animationType="slide" transparent={true} visible={modalVisible}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
          <View style={{ width: '90%', backgroundColor: '#fff', borderRadius: 10, padding: 20,borderWidth:1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
              <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Cart</Text>
              <TouchableOpacity style={{ marginLeft: 'auto' }} onPress={() => setModalVisible(false)}>
                <Icon name="close" type="material-community" size={24} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={cartItems}
              renderItem={renderItem}
              keyExtractor={item => item.product.id.toString()}
              ListEmptyComponent={<Text>Your cart is empty.</Text>}
              ListFooterComponent={
                <>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20 }}>
                    <Text style={{ fontWeight: 'bold' }}>Subtotal:</Text>
                    <Text style={{ marginLeft: 10 }}>${cartTotal.toFixed(2)}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10,marginBottom:10 }}>
                      <Text style={{ fontWeight: 'bold' }}>Taxes (16%):</Text>
                      <Text style={{ marginLeft: 10 }}>${(cartTotal * 0.16).toFixed(2)}</Text>
                  </View>
                  <Divider width={2}/>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                      <Text style={{ fontWeight: 'bold' }}>Total:</Text>
                      <Text style={{ marginLeft: 10 }}>${(cartTotal + (cartTotal * 0.16)).toFixed(2)}</Text>
                  </View>
                  <TouchableOpacity
                    style={[styles.checkoutButton, { opacity: cartItems.length === 0 ? 0.5 : 1 }]}
                    onPress={() => {
                      navigation.navigate('Checkout', { cartItems: cartItems });
                      setModalVisible(false); }}
                    disabled={cartItems.length === 0}
                  >
                    <Text style={{ color: '#fff', fontWeight: 'bold' }}>Checkout</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                      style={[styles.checkoutButton, { backgroundColor: '#404343', borderWidth: 1, borderColor: '#404343' }]}
                      onPress={() => setModalVisible(false)}
                  >
                      <Text style={{ color: '#fff', fontWeight: 'bold' }}>Continue Shopping</Text>
                  </TouchableOpacity>
                </>
              }
            />
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles=StyleSheet.create({
    cartText:{
        marginBottom: 10,
        fontWeight:"bold",
        fontSize:13
    },
    checkoutButton: {
        backgroundColor: '#94BF17',
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
        alignItems: 'center',
        marginTop: 20,
        
      },
})

export default CartModal;
