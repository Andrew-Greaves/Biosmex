import React, { useEffect,useState } from 'react';
import { View, StyleSheet,Image,TouchableOpacity } from 'react-native';
import { Text,  ListItem, Input, Avatar, Icon, } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import { Menu, MenuItem, MenuDivider } from 'react-native-material-menu';

const Header = () => {
  const navigation = useNavigation();
  const [visible, setVisible] = useState(false);

  const hideMenu = () => setVisible(false);

  const showMenu = () => setVisible(true);
  return(
    <Menu
        visible={visible}
        anchor={
          <View style={styles.menuIconContainer}>
          <TouchableOpacity onPress={showMenu}>
            <Icon type='material-community' name='view-headline' />
          </TouchableOpacity>
          <TouchableOpacity onPress={showMenu}>
            <Text style={styles.menuText}>Menu</Text>
          </TouchableOpacity>
        </View>}
            onRequestClose={hideMenu}
        >
        <MenuItem onPress={() => { hideMenu(); navigation.navigate("Home")}}>Home</MenuItem>
        <MenuDivider />
        <MenuItem onPress={() => { hideMenu(); navigation.navigate("BuyInputs")}}>Buy Inputs</MenuItem>
        <MenuDivider />
        <MenuItem onPress={hideMenu}>Buy Agroinsurance</MenuItem>
        <MenuDivider />
        <MenuItem onPress={hideMenu}>Government Programs</MenuItem>
        <MenuDivider />
        <MenuItem onPress={hideMenu}>Sell Products</MenuItem>
        <MenuDivider />
        <MenuItem onPress={hideMenu}>Rent Machinery</MenuItem>
        <MenuDivider />
        <MenuItem onPress={hideMenu}>Financial Products</MenuItem>
        <MenuDivider />
        <MenuItem onPress={hideMenu}>Regenerative Agriculture</MenuItem>
        <MenuDivider />
        <MenuItem onPress={hideMenu}>Agricultural Information</MenuItem>
        <MenuDivider />
        <MenuItem onPress={() => { hideMenu(); navigation.navigate("Profile")}}>Profile</MenuItem>
        <MenuDivider />
        <MenuItem onPress={() => { hideMenu(); navigation.navigate("Login")}}>Log Out</MenuItem>
    </Menu>
    
  )};

  const styles = StyleSheet.create({
    menuIconContainer: {
      alignItems: 'center',
    },
    menuText: {
      marginLeft: 5,
      fontSize: 16,
      fontWeight: 'bold',
    },
  });
  
  export default Header;