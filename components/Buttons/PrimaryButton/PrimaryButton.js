import React from 'react';
import { Button } from "@rneui/themed";
import { StyleSheet, View } from 'react-native';

const PrimaryButton = (props) => 
<Button 
  {...props} 
  size={"lg"}
  buttonStyle={style.button}
/>;

const style = StyleSheet.create({
  button: {
    backgroundColor: "#46D17E",
    borderRadius: 24
  }
});

export default PrimaryButton;