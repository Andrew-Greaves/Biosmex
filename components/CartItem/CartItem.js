import React, { useState,useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, Image, StyleSheet } from 'react-native';
import { Icon, Divider } from '@rneui/themed';

const CartItem = ({ item }) => {
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
        <Image source={{ uri: item.product.image_128 }} style={{ width: 50, height: 50 }} />
        <View style={{ marginLeft: 10 }}>
          <Text style={styles.cartText}>{item.product.name}</Text>
          <Text style={styles.cartText}>Quantity: {item.quantity}</Text>
          <Text style={styles.cartText}>Price: ${item.product.list_price}</Text>
          <Divider />
        </View>
      </View>
    );
  };

const styles=StyleSheet.create({
    cartText: {
        marginBottom: 10,
        fontWeight: 'bold',
        fontSize: 13
    },

})


export default CartItem;