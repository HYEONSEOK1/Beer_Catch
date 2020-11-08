/*
 * This example demonstrates how to use ParallaxScrollView within a ScrollView component.
 */
import React, { Component, Fragment } from 'react';
import {
  Image,
  TouchableOpacity,
  PixelRatio,
  StyleSheet,
  Text,
  View,
  FlatList,
  LogBox
} from 'react-native';

import axios from 'axios';
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Stars from 'react-native-stars';
import { Rating, AirbnbRating } from 'react-native-ratings';
import tvShowContent from '../../../assets/tvShowContent';
import LinearGradient from 'react-native-linear-gradient';
import Flag from 'react-native-flags';
import Ionicons from 'react-native-vector-icons/Ionicons';
const Gradationcolor = () => {
  return (
    <LinearGradient
      style={styles.header}
      colors={['#FED52B', '#FEB82B']}
      start={{ x: 0.0, y: 0.25 }}
      end={{ x: 0.5, y: 1.0 }}
    />
  );
}
class InfoScreen extends Component {
  constructor(props) {
    super(props);

  }
  state = {
    BeerInfo: [],
    BeerRate: 0,
  }
  componentDidMount() {
    console.warn(this.props.id); 
    //this.props.route.params.BeerInfo.id;
    let url = 'http://13.125.90.172/api/beer_info/' + this.props.id
    axios
      .get(url)
      .then(({ data }) => {

        this.setState({
          BeerInfo: data,
          BeerRate: 3.3,
        });
      })
      .catch(e => {  // API 호출이 실패한 경우
        console.error(e);  // 에러표시
        this.setState({
        });
      });

  }
  renderIngredient = (Ingredient) => {
    if (!Ingredient)
      return;
    return (
      Ingredient.map((item, key) => (
        <Text key={key} style={styles.ContentIngredientText}> - { item}</Text>)
      )
    );
  }
  renderReview(item) {
    return (
      <Fragment>
        <View style={{
          borderBottomWidth: 1,
          borderBottomColor: '#cccccc', paddingLeft: 5
        }}>
          <View style={{ flexDirection: "row", }}>
            <Ionicons name="person-circle-outline" style={{ fontSize: 35, height: 35, color: 'orange', }} />
            <View style={{ paddingLeft: 5 }}>
              <Text>{item.nickname}</Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Stars
                  default={Number(item.rate)}
                  spacing={2}
                  count={5}
                  starSize={10}
                  fullStar={require('../../../assets/images/fullstar.png')}
                  emptyStar={require('../../../assets/images/nonstar.png')} />

                <Text style={{ paddingLeft: 20 }}>{item.rate}</Text>

              </View>
            </View>
          </View>
          <Text>{item.content}</Text>
          <View style={{ alignItems: "flex-end", margin: 20 }}>
            <Ionicons name="thumbs-up-outline" style={{ fontSize: 20, height: 20, color: '#aaa' }} />

          </View>
        </View>

      </Fragment>
    );
  }

  render() {
    const { onScroll = () => { } } = this.props;
    const BeerInfo = this.state.BeerInfo;
    //const BeerInfo = Object.assign({}, ...this.state.BeerInfo)
    return (

      <ParallaxScrollView
        onScroll={onScroll}

        backgroundColor="#FED52B"
        stickyHeaderHeight={hp('8%')}
        parallaxHeaderHeight={PARALLAX_HEADER_HEIGHT}
        backgroundScrollSpeed={1}

        renderBackground={() => (
          <View key="background">
            <LinearGradient
              style={styles.header}
              colors={['#FED52B', '#FEB82B']}
              start={{ x: 0.0, y: 0.25 }}
              end={{ x: 0.5, y: 1.0 }}
            />

            <Image source={require('../../../assets/images/backgroundCircle.png')}
              style={{
                width: wp('100%'),
                height: PARALLAX_HEADER_HEIGHT - hp('5%'),
                tintColor: 'white',
              }}
            />
            <View>
              <View style={{
                backgroundColor: 'white',
                width: '100%',
                height: hp('5%'),
                borderWidth: 2,
                borderColor: '#eee',
                borderBottomWidth: 0,
                borderTopStartRadius: hp('5%'),
                borderTopEndRadius: hp('5%')
              }} />

            </View>
          </View>
        )}

        renderForeground={() => (
          <View key="parallax-header" style={styles.parallaxHeader}>
            <Image style={{
              width: wp('35%'),
              height: hp('35%'),
              resizeMode: 'contain',
              position: 'absolute',
              right: wp('10%'),
              bottom: 0,
            }} source={{ uri: BeerInfo.image_url }} />
            <Image style={{
              height: hp('7%'),
              resizeMode: 'contain',
              position: 'absolute',
              left: wp('0%'),
              top: 0,
            }} source={
              require('../../../assets/images/back.png')
            } />
            <Image style={{
              height: hp('7%'),
              resizeMode: 'contain',
              position: 'absolute',
              right: wp('10%'),
              top: 0,
            }} source={
              require('../../../assets/images/addsome.png')
            } />
            <Image style={{
              height: hp('7%'),
              resizeMode: 'contain',
              position: 'absolute',
              right: wp('-3%'),
              top: 0,
            }} source={
              require('../../../assets/images/favorite.png')
            } />
            <View
              style={{
                height: hp('33%'),
                width: wp('47%'),
                resizeMode: 'contain',
                position: 'absolute',
                left: wp('5%'),
                bottom: 0,

              }}
            >
              <Text style={styles.sectionKorText}>{BeerInfo.kor_name} </Text>
              <Text style={styles.sectionEngText}>( {BeerInfo.eng_name} )</Text>

              <Text style={styles.sectionTitleText}>{BeerInfo.description}</Text>
            </View>


          </View>
        )}

      // renderStickyHeader={() => (
      //   <View key="sticky-header" style={styles.stickySection}>
      //     <LinearGradient
      //       style={styles.headerGradient}
      //       colors={['#FED52B', '#FEB82B']}
      //       start={{ x: 0.0, y: 0.25 }}
      //       end={{ x: 0.5, y: 1.0 }}
      //     />
      //     <Image source={require('../../../assets/images/backgroundCircle.png')}
      //       style={{
      //         width: wp('100%'),
      //         height: PARALLAX_HEADER_HEIGHT - hp('5%'),
      //         tintColor: 'white',
      //       }}
      //     />
      //     {/* <Image style={{
      //       height: hp('8%'),
      //       resizeMode: 'contain',
      //       position: 'absolute',
      //       left: wp('-5%'),
      //       top: 0,
      //     }} source={
      //       require('../../../assets/images/back.png')
      //     } /> */}
      //     <Text style={styles.stickySectionText}>테라(Tera)</Text>
      //     {/* <Image style={{
      //       height: hp('8%'),
      //       resizeMode: 'contain',
      //       position: 'absolute',
      //       right: wp('10%'),
      //       top: 0,
      //     }} source={
      //       require('../../../assets/images/addsome.png')
      //     } />
      //       <Image style={{
      //       height: hp('8%'),
      //       resizeMode: 'contain',
      //       position: 'absolute',
      //       right: wp('-6%'),
      //       top: 0,
      //     }} source={
      //       require('../../../assets/images/favorite.png')
      //     } /> */}
      //   </View>
      // )}

      // renderFixedHeader={() => (
      //   <View key="fixed-header" style={styles.fixedSection}>
      //     <Text style={styles.fixedSectionText}
      //           onPress={() => this.refs.ListView.scrollTo({ x: 0, y: 0 })}>
      //       Scroll to top
      //     </Text>
      //   </View>
      // )}
      >

        <View style={styles.section}>
          <Text style={styles.ContentTitleText}>정보</Text>
        </View>
        <View style={styles.section}>
          <View style={{ flexDirection: "row" }}>
            <Text>알코올 : </Text>
            <Text>{BeerInfo.alcohol}도</Text>
          </View>
          <View style={{ flexDirection: "row", paddingTop: 10 }}>
            <Text>원산지 : </Text>
            <Flag code={BeerInfo.country_code} size={16} />
            <Text style={styles.sectionFlagText}> {BeerInfo.country_name}</Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <Text>스타일 : </Text>
            <Text>{BeerInfo.type}</Text>
          </View>

        </View>


        <View style={styles.section}>
          <Text style={styles.ContentTitleText}>성분</Text>
        </View>
        <View style={styles.section}>
          {this.renderIngredient(BeerInfo.ingredient)}
        </View>

        <View style={[styles.section,{ flexDirection:"row", alignItems:"center",justifyContent:"space-between" } ]}>
          <Text style={styles.ContentTitleText}>평점 & 리뷰</Text>
          <TouchableOpacity style={styles.flipButton}>
            <Text style={styles.ContentButtonText}>리뷰 쓰기</Text>
        </TouchableOpacity>
          
        </View>
        <View style={{ alignItems: 'center', paddingTop: 15, paddingBottom: 30 }}>
          <Rating
            type='custom'
            ratingCount={5}
            ratingColor="#fed12f"
            ratingBackgroundColor="#fff3cc"
            readonly="true"
            fractions={0}
            startingValue={BeerInfo.rate}
            imageSize={wp("12%")}
            
            style={{ paddingVertical: 10 }}
          />
          {/* <Stars
            display={this.state.BeerRate}
            update={this.state.BeerRate}
            value={this.state.BeerRate}
            spacing={8}
            count={5}
            starSize={40}
            fullStar={require('../../../assets/images/fullstar.png')}
            emptyStar={require('../../../assets/images/nonstar.png')}
            disabled={true}
          /> */}
          <Text style={styles.ContentTitleText}>{BeerInfo.rate}</Text>
        </View>
        <FlatList
          data={BeerInfo.review}
          renderItem={({ item }) => this.renderReview(item)}
          keyExtractor={(item, index) => index.toString()}
        />
      </ParallaxScrollView>
    )
  }
}

const ROW_HEIGHT = 60;
const PARALLAX_HEADER_HEIGHT = hp('50%');
const STICKY_HEADER_HEIGHT = 70;

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',

  },
  sectionContent: {
    fontSize: 16,
    textAlign: 'justify',
  },
  section: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
    backgroundColor: 'white',

  },

  container: {
    flex: 1,
    backgroundColor: 'black'
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: wp('100%'),
    height: PARALLAX_HEADER_HEIGHT
  },
  stickySection: {
    height: hp('8%'),
    width: wp('100%'),
    justifyContent: 'center',
    backgroundColor: '#FED52B'
  },
  stickySectionText: {
    color: 'black',
    fontSize: 20,
    position: 'absolute',
    left: wp('5%'),
    top: hp('2.5%'),

  },
  fixedSection: {
    position: 'absolute',
    bottom: 10,
    right: 10
  },
  fixedSectionText: {
    color: '#999',
    fontSize: 20
  },

  parallaxHeader: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'column',
    paddingTop: 50,
  },
  sectionKorText: {
    color: 'black',
    fontSize: wp('8%'),
  },
  sectionEngText: {
    color: 'black',
    fontSize: wp('5%'),
    color: '#222',
  },
  sectionFlagText: {
    color: 'black',
    fontSize: wp('4%'),
    justifyContent: 'center',
    alignItems: 'center',
    color: 'black',
    fontFamily: 'BMYEONSUNG'
  },
  sectionTitleText: {
    color: 'black',
    fontSize: wp('3%'),
    paddingVertical: 10
  },
  ContentTitleText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  ContentButtonText: {
    fontSize: 15,
    color:"#555"
  },
  ContentIngredientText: {
    color: 'black',
    fontSize: wp('5%'),
    paddingVertical: hp('0.3%'),
  },
  ContentStar: {
    paddingTop: wp("10%"),
    justifyContent: 'center',
    backgroundColor: 'white',
    flexDirection: "row",
    alignItems: 'center',
    textAlign: 'justify',
  },
  header: {
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
  headerGradient: {
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
  flipButton: {
    flex: 0.3,
    height: 30,
    width:20,
    marginHorizontal: 2,
    borderRadius: 8,
    borderColor: '#ddd',
    borderWidth: 1,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
},
});
LogBox.ignoreAllLogs();
export default InfoScreen;