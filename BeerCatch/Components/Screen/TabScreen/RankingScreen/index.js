import React, { Component } from 'react'
import { Text, StyleSheet, View, SafeAreaView, StatusBar, Image } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import { FlatGrid } from 'react-native-super-grid';
import RankingTabScreen from './RankingTabScreen';

const PARALLAX_HEADER_HEIGHT = hp('20%');


export default function RankingScreen() {
  
    return (
      <SafeAreaView style={styles.safeAreaViewStyle}>
        <StatusBar barStyle={"light-content"} />
        <View style={styles.header}>
            <LinearGradient
              style={styles.Linearheader}
              colors={['#FED52B', '#FEB82B']}
              start={{ x: 0.0, y: 0.25 }}
              end={{ x: 0.5, y: 1.0 }}
            />
            <Image source={require('../../../../assets/images/backgroundCircle.png')}
              style={{
                width: wp('100%'),
                height: PARALLAX_HEADER_HEIGHT + hp('20%'),
                tintColor: 'white',
                position:"absolute"
              }}
            />
            <Image style={{
              marginTop:hp('5%'),
              height: PARALLAX_HEADER_HEIGHT+ hp('9%'),
              resizeMode: 'contain',
            }} source={
              require('../../../../assets/images/Beers.png')
            } />
          </View>
       
        <View style={styles.container}>
        <Text style={{fontSize:20, fontWeight:"bold",color:"#333"}}>Beer's Ranking</Text>
        
        </View>
        <RankingTabScreen/>
      </SafeAreaView>

    );
}

const styles = StyleSheet.create({
  safeAreaViewStyle: {
    flex: 1,
    backgroundColor: "white",
  },
  container: {
    ...Platform.select({
      android: {
        top: 30,
      },
    }),
    height: hp('8%'),

    alignItems: 'center',
  },
  Linearheader: {
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
    height: PARALLAX_HEADER_HEIGHT,
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    height: PARALLAX_HEADER_HEIGHT,
    backgroundColor:"yellow",
    flexDirection: 'row',
    justifyContent: 'center',
  },
  gridView: {
    marginTop: 10,
    flex: 1,
  },
  
})
