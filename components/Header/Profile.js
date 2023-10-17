import React, { useEffect,useState } from 'react';
import { View, StyleSheet,TouchableOpacity } from 'react-native';
import { Text,  ListItem, Input, Avatar, Icon, } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';

const Profile = () => {
    const navigation = useNavigation();
    
    return(
        <View>
            <TouchableOpacity>
                <Icon type='material-community' name='account-circle-outline' size={35} />
            </TouchableOpacity>
            <TouchableOpacity>
                <Text style={styles.profileText}>Profile</Text>
            </TouchableOpacity>
        </View>
      
    )};
  
    const styles = StyleSheet.create({
      
      profileText: {
        marginLeft: 5,
        fontSize: 16,
        fontWeight: 'bold',
      },
    });
    
    export default Profile;