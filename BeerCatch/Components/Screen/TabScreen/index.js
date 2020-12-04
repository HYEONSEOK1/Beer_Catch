import React, { Fragment } from 'react'
import { StyleSheet, Text, View, YellowBox } from 'react-native'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ActionButton from "react-native-action-button";

import SearchScreen from './SearchScreen';
import CommunityScreen from './CommunityScreen';
import InfoScreen from './../InfoScreen'
import TestScreen from './TestScreen'
import RankingScreen from './RankingScreen/index';

import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AccountScreen from './AccountScreen';


const Tab = createMaterialTopTabNavigator();

const tabBarIcon = (focused, name) => {

    let iconName;
    if (name === 'Search') {
        iconName = 'search'
    }
    else if (name === 'Community') {
        iconName = 'people-outline'
    }
    else if (name === 'Account') {
        iconName = 'person-outline'
    }
    else if (name === 'Ranking') {
        iconName = 'trophy-outline'
    }
    let color = focused ? "#fff" : "#888";

    return (
        <Ionicons
            name={iconName}
            color={color}
            style={{
                fontSize: wp('6%'),
            }}
        />

    )
}
MainScreen = (navigation) => {
    return (
        <Fragment>
            <Tab.Navigator
                initialRouteName="Search"
                tabBarPosition='bottom'
                tabBarOptions={{
                    showIcon: true,
                    activeTintColor: 'white',
                    inactiveTintColor: '#888',
                    style: {
                        backgroundColor: '#FED52B',
                    },
                    indicatorStyle: {
                        backgroundColor: 'white',
                    },
                    showLabel: false,
                }}
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ focused }) => (
                        tabBarIcon(focused, route.name)
                    )
                })}
            >
                <Tab.Screen name="Search" component={SearchScreen} />
                <Tab.Screen name="Ranking" component={RankingScreen} />
                <Tab.Screen name="Community" component={CommunityScreen} />
                <Tab.Screen name="Account" component={AccountScreen} />
            </Tab.Navigator>
            <ActionButton
                buttonColor="#FED52B"
                offsetX={20}
                offsetY={70}
                hideShadow={false} fixNativeFeedbackRadius={true}
                shadowStyle={{
                    shadowColor: 'black',
                    shadowOpacity: 0.7,
                    shadowOffset: { width: 20, height: 20 },
                    shadowRadius: 10,
                    elevation: 7,
                    }}
                renderIcon={active => active ?
                    (<Ionicons name="camera-outline"
                        style={{
                            fontSize: 20,
                            height: 22,
                            color: 'white',
                        }}
                    />)
                    :
                    (<Ionicons name="camera"
                        style={{
                            fontSize: 30,
                            height: 35,
                            color: 'white',
                        }}
                    />)
                }
                onPress={() => navigation.navigate('CameraScreen')}
            >
            </ActionButton>
        </Fragment>
    )
}
export default function TabScreen({navigation}) {
    return (
        MainScreen(navigation)
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: wp('5%'),
        backgroundColor: 'white',
    },
})
YellowBox.ignoreWarnings([
    'Non-serializable values were found in the navigation state',
]);