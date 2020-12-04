import React, { Component } from 'react'
import { Text, StyleSheet, View, StatusBar } from 'react-native'
import Swiper from 'react-native-swiper'
import Infofo from './info'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
// export default class index extends Component {
//   state = {
//     currentPage : 0
//   }
//   onStepPress = (position) => {
//     this.setState({
//       currentPage:position
//     })
//   }
//   renderLabel = (
//     position,
//     stepStatus,
//     label,
//     currentPosition,
//   ) => {
//     return (
//       <Text
//         style={
//           position === currentPosition
//             ? styles.stepLabelSelected
//             : styles.stepLabel
//         }
//       >
//         {label}
//       </Text>
//     );
//   };
//   renderViewPagerPage = (data) => {
//     return (
//       <View key={data} style={styles.page}>
//         <Text>{data}</Text>
//       </View>
//     );
//   };

//   render() {
//     return (
//       <View style={styles.container}>
//       <View style={styles.stepIndicator}>
//         <StepIndicator
//           customStyles={firstIndicatorStyles}
//           currentPosition={this.state.currentPage}
//           labels={['Account', 'Profile', 'Band', 'Membership', 'Dashboard']}
//           // renderLabel={this.renderLabel()}
//           onPress={this.onStepPress}
//         />
//       </View>
//       <Swiper
//         style={{ flexGrow: 1 }}
//         loop={false}
//         index={currentPage}
//         autoplay={false}
//         showsButtons
//         onIndexChanged={(page) => {
//           setCurrentPage(page);
//         }}
//       >
//         {PAGES.map((page) => renderViewPagerPage(page))}
//       </Swiper>
//       </View>
//     )
//   }
// }

// const styles = StyleSheet.create({
// container: {
//   flex: 1,
//   backgroundColor: '#ffffff',
// },
// stepIndicator: {
//   marginVertical: 50,
// },
// stepLabel: {
//   fontSize: 12,
//   textAlign: 'center',
//   fontWeight: '500',
//   color: '#999999',
// },
// stepLabelSelected: {
//   fontSize: 12,
//   textAlign: 'center',
//   fontWeight: '500',
//   color: '#4aae4f',
// },
// })



export default class index extends Component {
  renderItem = (item) => {
    console.warn(item);
      if(item.bToggle == true){
      return(
        // <View style={styles.slide}>
        //   <Infofo id={item.id}/>
        //   </View> 
        <View style={styles.slide}>
      <Infofo beer_id={item.beer_id} navigation = {this.props.navigation}/>
      </View>
          )
      }
  
  }
  render() {
    const BeerInfo = this.props.route.params.BeerInfo;
    console.warn(BeerInfo);
    return (
      <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Swiper
        style={styles.wrapper}
        height={100}
        dot={
          <View
          style={{
            backgroundColor: '#CBA21A',
            width: hp("1.5%"),
            height: hp("1.5%"),
            borderRadius: hp("1.5%")/2,
            marginLeft: hp("1.5%")/2,
            marginRight: hp("1.5%")/2
          }}
        />
        }
        activeDot={
          <View
            style={{
              backgroundColor: '#FED52B',
              width: hp("1.5%"),
              height: hp("1.5%"),
              borderRadius: hp("1.5%")/2,
              marginLeft: hp("1.5%")/2,
              marginRight: hp("1.5%")/2
            }}
          />
        }
        paginationStyle={{
          bottom: hp("0.7%"),
        }}
        loop
      >
        {BeerInfo.map((item,key) => (this.renderItem(item)))}
      </Swiper>
    </View>
    )
  }
}
const styles = {
  wrapper: {
    
  },

  slide: {
    height:hp("94%"),
    backgroundColor: 'transparent',
    
  },
  container: {
    flex: 1
  },

}