import React from 'react';
import { Button, Icon } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet } from 'react-native';


const BackButton = (props) => {
  const navigation = useNavigation();
  
  return (
    <Button 
      {...props}
      onPress={() => navigation.goBack()}
      type={"clear"}
      raised
      icon={<Icon type={"material-community"} size={30} name={"arrow-left"}/>}
      titleStyle={styles.Title}
      />
  );
}

const styles = StyleSheet.create({
  Title:{
    fontFamily:'Arial',
    fontSize:32,
    fontWeight:'600',
    color: "black"
  }
})


export default BackButton;