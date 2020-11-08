import React, { Component } from 'react'
import { Text, StyleSheet, View, ScrollView } from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
export default class CommunityScreen extends Component{
    render(){
        return (
            // <ScrollView style={styles.container}>
            //     <View style={styles.wrapContent}>
            //         <View style={styles.content}></View>
            //     </View>
            //     <View style={styles.wrapContent}>
            //         <View style={styles.content}></View>
            //     </View>
            //     <View style={styles.wrapContent}>
            //         <View style={styles.content}></View>
            //     </View>
            // </ScrollView>
            <View style={styles.container}>
            <Text>미구현</Text>
           </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
      },
    wrapContent: {
        width: wp('90%'),
        height: wp('90%'),
        paddingBottom: wp('5%'),
        
    },
    content: {
        width: "100%",
        height: "100%",
        backgroundColor: "#46c3ad",
    }
})