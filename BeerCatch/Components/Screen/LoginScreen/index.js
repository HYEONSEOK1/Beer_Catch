import React, { Component } from 'react'
import { Text, StyleSheet, View } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack';
import SingInScreen from './SignInScreen';
import SingUpScreen from './SingUpScreen';


const Stack = createStackNavigator();

export default class LoginScreen extends Component {
    render() {
        return (
            <Stack.Navigator>
                {/* <Stack.Screen name="SingIn" component={SingInScreen} /> */}
                <Stack.Screen
                 options={{
                    headerShown: false
                }}
                name="SingUp" component={SingUpScreen} />
            </Stack.Navigator>              
        )
    }
}

const styles = StyleSheet.create({})
