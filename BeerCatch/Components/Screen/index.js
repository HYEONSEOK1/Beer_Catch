import React, { Component } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import InfoScreen from './InfoScreen';
import TabScreen from "./TabScreen"
import LoginScreen from './LoginScreen';
import { Fragment } from 'react';
import SingUpScreen from './LoginScreen/SingUpScreen';
import CameraScreen from './CameraScreen';

const Stack = createStackNavigator();

// export default function Screen() {
//     return (
//         <NavigationContainer>
//              {/* <LoginScreen/> */}
//             <Stack.Navigator>

//                 {/* <Stack.Screen 
//                  options={{
//                     headerShown: false
//                 }}
//                 name="InfoScreen" component={InfoScreen} 
//                 /> */}
//                 <Stack.Screen name="TabScreen" component={TabScreen} />
//             </Stack.Navigator>        

//        {/* <TabScreen/>  */}
//       </NavigationContainer>
//     )
// }

export default class index extends Component {
    state = {
        _isLogin: true,
    };
    changeLoginStatus = (ss) => {
        this.setState({
            _isLogin: ss
        });
    }

    render() {
        return (
            <NavigationContainer>
                <Stack.Navigator>
                    {this.state._isLogin ?
                        (
                            <Fragment>
                                <Stack.Screen name="TabScreen" 
                                   options={{
                                    headerShown: false
                                }}
                                component={TabScreen} />
                                <Stack.Screen name="CameraScreen" 
                                options={{
                                    headerShown: false
                                }}
                                component={CameraScreen} />
                                <Stack.Screen name="InfoScreen" 
                                options={{
                                    headerShown: false
                                }}
                                component={InfoScreen} />
                
                            </Fragment>
                        ) :
                        (
                            <Stack.Screen name="SinpUpScreen" component={SingUpScreen}
                                options={{
                                    headerShown: false
                                }}
                                initialParams={{ changeLoginStatus: this.changeLoginStatus }} />
                        )}
                </Stack.Navigator>
            </NavigationContainer>

        )
    }
}

const styles = StyleSheet.create({})
