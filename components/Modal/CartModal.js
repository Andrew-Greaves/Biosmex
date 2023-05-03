import React, { useState,useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, Image, StyleSheet } from 'react-native';
import { Icon, Divider } from '@rneui/themed';

const cartItems=[];

const CartModal = ({ cartItems, removeFromCart, modalVisible, setModalVisible }) => {
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
    removeFromCart(item.product.id);
  };

  const renderItem = ({ item }) => {
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
        <Image source={{ uri: item.product.image_128 }} style={{ width: 50, height: 50 }} />
        <View style={{ marginLeft: 10 }}>
          <Text style={styles.cartText}>{item.product.name}</Text>
          <Text style={styles.cartText}>Quantity: {item.quantity}</Text>
          <Text style={styles.cartText}>Price: ${item.product.list_price}</Text>
          <Divider />
        </View>
        <TouchableOpacity style={{ marginLeft: 'auto' }} onPress={() => handleRemoveItem(item)}>
          <Icon name="trash-can-outline" type="material-community" size={24} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Modal animationType="slide" transparent={true} visible={modalVisible}>
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
                  <Text style={{ fontWeight: 'bold' }}>Total:</Text>
                  <Text style={{ marginLeft: 10 }}>${cartTotal.toFixed(2)}</Text>
                </View>
                <TouchableOpacity
                  style={[styles.checkoutButton, { opacity: cartItems.length === 0 ? 0.5 : 1 }]}
                  onPress={() => alert('Checkout button pressed!')}
                  disabled={cartItems.length === 0}
                >
                  <Text style={{ color: '#fff', fontWeight: 'bold' }}>Checkout</Text>
                </TouchableOpacity>
              </>
            }
          />
        </View>
      </View>
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
        backgroundColor: '#46D17E',
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
        alignItems: 'center',
        marginTop: 20,
        
      },
})

export default CartModal;
