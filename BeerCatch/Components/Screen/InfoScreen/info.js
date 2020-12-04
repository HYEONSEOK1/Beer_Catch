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
import Modal from 'react-native-modal';
import axios from 'axios';
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Stars from 'react-native-stars';
import { Rating, AirbnbRating } from 'react-native-ratings';
import tvShowContent from '../../../assets/tvShowContent';
import LinearGradient from 'react-native-linear-gradient';
import Flag from 'react-native-flags';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {AutoGrowingTextInput} from 'react-native-autogrow-textinput';
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
    review:[],
    bReady: 0,
    isReviewModalVisible: false,
    user_id:1122334455,
    user_nickname:"비어캐치",
    textValue:"",
    rateValue:0,
  }
  componentDidMount() {
    //this.props.route.params.BeerInfo.id;
    let url = 'http://13.125.90.172/api/beer_info/' + this.props.beer_id + '?user_id=' + this.state.user_id
    console.warn(url);
    axios
      .get(url)
      .then(({ data }) => {

        this.setState({
          BeerInfo: data,
          review : data.review,
          bReady: 1,
        });
      })
      .catch(e => {  // API 호출이 실패한 경우
        console.error(e);  // 에러표시
        this.setState({
        });
      });

  }
  SendReview  = async function () {
    this.toggleReviewModal();
    let url = 'http://13.125.90.172/api/review/'
        let options = {
            method: 'POST',
            url: url,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8'
            },
            data: {
              content: this.state.textValue,
              rate: this.state.rateValue,
              user_id: this.state.user_id,
              beer_id: this.props.beer_id,
            }
        };
        let response = await axios(options);
        console.warn(response);
        console.warn(this.state.review);
      this.setState({
        review: this.state.review.concat(
        {
          ...response.data,
          nickname:this.state.user_nickname
        }
          )
    })
     
  }
    SendReviewLike = () => {
       //this.props.route.params.BeerInfo.id;
    let url = 'http://13.125.90.172/api/beer_info/' + this.props.beer_id + '?user_id=' + this.state.user_id
    console.warn(url);
    axios
      .get(url)
      .then(({ data }) => {

        this.setState({
          BeerInfo: data,
          bReady: 1,
        });
      })
      .catch(e => {  // API 호출이 실패한 경우
        console.error(e);  // 에러표시
        this.setState({
        });
      });

    };
    _onChange(event) {
      this.setState({ textValue: event.nativeEvent.text || '' });
    }
    toggleReviewModal = () => (
      
      this.setState(prevState => ({
        textValue:"",
        rateValue:0,
        isReviewModalVisible: !prevState.isReviewModalVisible,
      })));
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
    console.warn(item);
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
          <View style={{ margin: 10,flexDirection:"row", justifyContent:"flex-end" }}>
            <TouchableOpacity style={[styles.flipButton,{flexDirection:"row",flex: 0.2,padding: 2,}]}>
            <Text>공감  </Text><Ionicons name="thumbs-up-outline" style={{ fontSize: 15, height: 15, color: '#aaa' }} />
            </TouchableOpacity>
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

        renderForeground={() => {
          if (this.state.bReady == 1) {
            return (
              <View key="parallax-header" style={styles.parallaxHeader}>
                <Image style={{
                  width: wp('35%'),
                  height: hp('35%'),
                  resizeMode: 'contain',
                  position: 'absolute',
                  right: wp('10%'),
                  bottom: 0,
                }} source={{ uri: BeerInfo.image_url }} />
                <TouchableOpacity
                  onPress={() => this.props.navigation.goBack()}
                  style={{
                    height: hp('7%'),
                    position: 'absolute',
                    left: -hp('1.5%'),
                    justifyContent: "flex-end",
                    alignItems: "flex-start"
                  }}>
                  <Image
                    style={{
                      height: hp('7%'),
                      resizeMode: 'contain',
                    }}
                    source={
                      require('../../../assets/images/back.png')
                    } />
                </TouchableOpacity>
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
            )
          }
          else {
            return (
              <View key="parallax-header" style={styles.parallaxHeader}>
                <Image style={{
                  width: wp('35%'),
                  height: hp('35%'),
                  resizeMode: 'contain',
                  position: 'absolute',
                  right: wp('10%'),
                  bottom: 0,
                }} source={{ uri: BeerInfo.image_url }} />
                <TouchableOpacity
                  onPress={() => this.props.navigation.goBack()}
                  style={{
                    height: hp('7%'),
                    position: 'absolute',
                    left: -hp('1.5%'),
                    justifyContent: "flex-end",
                    alignItems: "flex-start"
                  }}>
                  <Image
                    style={{
                      height: hp('7%'),
                      resizeMode: 'contain',
                    }}
                    source={
                      require('../../../assets/images/back.png')
                    } />
                </TouchableOpacity>
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
              </View>
            )
          }
        }}

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
        <Modal
          isVisible={this.state.isReviewModalVisible}
          style={{ justifyContent: "center", alignItems: "center", }}
          onBackdropPress={() => this.toggleReviewModal()}
        >
          <View style={{
            alignItems: "center",
            justifyContent: "flex-start",
            height: hp("50%"),
            width: wp("70%"),
            backgroundColor: "white",
            borderRadius: hp("1%"),
          }
          }>
            <Text style={styles.ModalText}>리뷰를 작성해주세요!</Text>
            <Stars
              default={0}
              spacing={2}
              count={5}
              update={(val)=>{this.setState({rateValue: val})}}
              starSize={hp("5%")}
              fullStar={require('../../../assets/images/fullstar.png')}
              emptyStar={require('../../../assets/images/nonstar.png')}
              style={{paddingTop:50}} />
           
            <AutoGrowingTextInput
        value={this.state.textValue}
        onChange={(event) => this._onChange(event)}
            style={{
              fontSize: 15,
              width:wp("60%"),
              margin:20,
              backgroundColor: 'white',
              borderWidth: 0.2,
            borderColor:"#111",
            }}
            placeholder={'Review'}
            placeholderTextColor='#66737C'
            maxHeight={hp("23%")}
            minHeight={hp("5%")}
            enableScrollToCaret
           
          />
           <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between",}}>
              <TouchableOpacity style={styles.flipButton} onPress={() => this.SendReview()}>
                <Text style={styles.ContentButtonText}>등록</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.flipButton} onPress={() => this.toggleReviewModal()}>
                <Text style={styles.ContentButtonText}>취소</Text>
              </TouchableOpacity>
            </View>

          </View>
        </Modal>

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

        <View style={[styles.section, { flexDirection: "row", alignItems: "center", justifyContent: "space-between" }]}>
          <Text style={styles.ContentTitleText}>평점 & 리뷰</Text>
          <TouchableOpacity style={styles.flipButton} onPress={() => this.toggleReviewModal()}>
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
            startingValue={BeerInfo.total_rate}
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
          <Text style={styles.ContentTitleText}>{BeerInfo.total_rate}</Text>
        </View>
        <FlatList
          data={this.state.review}
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
  ModalText: {
    color: 'black',
    fontSize: wp('6%'),
    justifyContent: 'center',
    alignItems: 'center',
    color: 'black',
    fontFamily: 'NanumSquareRoundL',
    fontWeight: 'bold',
    paddingVertical:20
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
    color: "#555"
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
    width: 20,
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