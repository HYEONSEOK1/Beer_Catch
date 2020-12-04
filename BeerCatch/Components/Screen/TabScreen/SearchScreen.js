import React, { Component, Fragment } from "react";
import { SafeAreaView, View, StyleSheet, StatusBar, FlatList, Platform, Text, Image } from "react-native";
import SearchBar from "react-native-dynamic-search-bar";
import staticData from "../../../assets/staticData"
import Ionicons from 'react-native-vector-icons/Ionicons';
import Flag from 'react-native-flags';
import axios from 'axios';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import LinearGradient from "react-native-linear-gradient";
import { TouchableOpacity } from "react-native-gesture-handler";
const PARALLAX_HEADER_HEIGHT = hp('20%');
export default class SearchScreen extends Component {

  state = {
    query: "",
    isLoading: true,
    refreshing: false,
    dataBackup: [],
    dataSource: [],
    spinnerVisibility: false,
  };
  componentDidMount() {
    let url = 'http://13.125.90.172/api/beer_search/';
    axios
      .get(url)
      .then(({ data }) => {
        this.setState({
          loading: true,
          dataBackup: data,
          dataSource: data
        });
      })
      .catch(e => {  // API 호출이 실패한 경우
        console.error(e);  // 에러표시
        this.setState({
          loading: false
        });
      });
  }
  filterList = (text) => {
    var newData = this.state.dataBackup;
    newData = this.state.dataBackup.filter((item) => {
      const itemkorData = item.kor_name.toLowerCase();
      const itemengData = item.eng_name.toLowerCase();
      const textData = text.toLowerCase();
      return (itemkorData.indexOf(textData) > -1 || itemengData.indexOf(textData) > -1);
    });
    this.setState({
      query: text,
      dataSource: newData,
    });
  };

  renderItem(item) {
    // return (
    //   <GradientCard
    //     key={item.name}
    //     title={item.name}
    //     style={styles.cardStyle}
    //     imageSource={item.image}
    //     centerTitle={item.value}
    //     subtitle={item.shortName}
    //     width={wp("30%")}
    //     centerSubtitle={item.change}
    //     shadowStyle={styles.cardShadowStyle}
    //     centerSubtitleStyle={this.centerSubtitleStyle(item)}

    //   />
    // );
    let BeerInfo = [];
    BeerInfo.push({ "beer_id": item.beer_id, "bToggle": 1 })
    return (
      <TouchableOpacity
        onPress={() => this.props.navigation.navigate("InfoScreen", { "BeerInfo": BeerInfo })}
      >
        <View
          style={styles.cardStyle}>
          <Image source={{ uri: item.image_url }} style={styles.imageStyle} />
          <View style={{ flexDirection: 'column', flex: 1, paddingLeft:wp('2%'),}}>

            <View style={{ flex: 1, paddingTop: 10 }}>
              <Text style={styles.txtNamefont}>{item.kor_name} ( {item.eng_name} )</Text>
            </View>

            <View style={{ flex: 1, }}>
              <Text style={styles.txtBreweryfont}>{item.kor_company_name} | {item.eng_company_name}</Text>
            </View>

            <View style={{ flex: 1, flexDirection: "row" }} >
              <Flag code={item.country_code} size={16} />
              <Text style={styles.txtBreweryfont}> {item.country_name} </Text>
            </View>

            <View style={{ flex: 1, flexDirection: "row", marginBottom: 10 }}>
              <Ionicons name="star" style={{ fontSize: 13, height: 13, color: '#FEB82B', }} />
              <Text style={styles.txtBreweryfont}>{item.total_rate}</Text>
            </View>
          </View>
          </View>
   
      </TouchableOpacity>
    );
  }

  render() {
    const { spinnerVisibility } = this.state;
    return (
      <SafeAreaView style={styles.safeAreaViewStyle}>
        <View style={styles.container}>
          <View style={styles.header}>
            <LinearGradient
              style={styles.Linearheader}
              colors={['#FED52B', '#FEB82B']}
              start={{ x: 0.0, y: 0.25 }}
              end={{ x: 0.5, y: 1.0 }}
            />
            <Image source={require('../../../assets/images/backgroundCircle.png')}
              style={{
                width: wp('100%'),
                height: PARALLAX_HEADER_HEIGHT,
                tintColor: 'white',
                position: "absolute"
              }}
            />
            

            <SearchBar
              placeholder="Search"
              spinnerVisibility={spinnerVisibility}
              
              
              searchIconImageStyle={{tintColor:"gray"}}
              clearIconImageStyle={{tintColor:"gray"}}
              onChangeText={(text) => {
                if (text.length === 0)
                  this.setState({ spinnerVisibility: false });
                else this.setState({ spinnerVisibility: true });
                this.filterList(text);
              }}
              onClearPress={() => {
                this.setState({ spinnerVisibility: false });
                this.filterList("");
              }}
            />
          </View>
        
          <View style={styles.flatListStyle}>
            
            <FlatList
              data={this.state.dataSource}
              renderItem={({ item }) => this.renderItem(item)}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  safeAreaViewStyle: {
    flex: 1,
    backgroundColor: "white",
  },
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  imageStyle: {
    resizeMode: "contain",
    width: wp('10%'),
    height: hp('10%'),
    margin: wp('1%'),
    // shadowColor: '#000',
    // shadowOffset: { width: 5, height: 5 },
    // shadowOpacity: 0.2,
    // shadowRadius: 4,
  },
  flatListStyle: {
    marginTop: hp("2%"),
    marginBottom: hp("20%"),
    alignItems: "center",
    justifyContent: "center",

  },
  cardStyle: {
    width: wp("90%"),
        flex: 1,
        paddingLeft: 5,
        paddingRight: 10,
        shadowColor: 'black',
        shadowOpacity: 0.7,
        shadowOffset: { width: 20, height: 20 },
        shadowRadius: 10,
        elevation: 3,
        borderRadius: 1,
        backgroundColor: "white",
        flexDirection:"row",

  
        margin: 2,
        shadowColor: 'black',
        shadowOpacity: 0.7,
        shadowOffset: { width: 20, height: 20 },
        shadowRadius: 10,
        elevation: 3,
        borderRadius: 10,
        backgroundColor: "white",

        
  },

  welcome: {
    margin: 10,
    fontSize: 20,
    textAlign: "center",
  },
  instructions: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5,
  },
  chartStyle: {
    height: 100,
    width: 100,
  },
  chartContentInset: {
    top: 30,
    bottom: 30,
  },
  txtNamefont: {
    fontSize: 16,
    color: '#111',
    fontFamily: 'NanumSquareRoundEB',
    marginBottom: 5,
  },
  txtBreweryfont: {
    fontSize: 12,
    color: '#444',
    fontFamily: 'BMYEONSUNG'
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
    backgroundColor: "yellow",
    justifyContent: 'center',
  },
})
