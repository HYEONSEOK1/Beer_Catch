import React, { Component, Fragment } from "react";
import { SafeAreaView, View, StyleSheet, StatusBar, FlatList, Platform, Text, Image } from "react-native";
import SearchBar from "react-native-dynamic-search-bar";
import staticData from "../../../assets/staticData"
import Ionicons from 'react-native-vector-icons/Ionicons';
import Flag from 'react-native-flags';
import axios from 'axios';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import LinearGradient from "react-native-linear-gradient";
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
    return (
      <LinearGradient colors={['#FED52B', '#FEB82B']}
        start={{ x: 0.0, y: 0.0 }}
        end={{ x: 1.0, y: 1.0 }}
        style={styles.cardStyle}>
        <Image source = {{uri: item.image_url}} style={styles.imageStyle} />
        <View style={{ flexDirection: 'column', flex: 1, }}>

          <View style={{ flex: 1, paddingTop : 10}}>
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
            <Ionicons name="star" style={{ fontSize: 13, height: 13, color: '#ddd', }} />
            <Text style={styles.txtBreweryfont}>{item.rate}</Text>
          </View>
        </View>

      </LinearGradient>

    );
  }

  render() {
    const { spinnerVisibility } = this.state;
    return (
      <SafeAreaView style={styles.safeAreaViewStyle}>
        <StatusBar barStyle={"light-content"} />
        <View style={styles.container}>
          <SearchBar
            darkMode
            placeholder="Search"
            spinnerVisibility={spinnerVisibility}
            style={{ backgroundColor: "#FED52B" }}
            onChangeText={(text) => {
              if (text.length === 0)
                this.setState({ spinnerVisibility: false });
              else this.setState({ spinnerVisibility: true });
              this.filterList(text);
            }}
            onClearPress={() => {
              this.filterList("");
            }}
          />
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
    backgroundColor: "#ffffcc",
  },
  imageStyle: {
    resizeMode :"contain",
    width: wp('15%'),
    height: hp('15%'),
    margin: wp('3%'),
    shadowColor: '#000',
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  flatListStyle: {
    marginTop: hp("2%"),
    marginBottom: hp("20%"),
    alignItems: "center",
    justifyContent: "center",

  },
  cardShadowStyle: {
    ...Platform.select({
      ios: {
        shadowRadius: 3,
        shadowOpacity: 0.4,
        shadowColor: "#000",
        shadowOffset: {
          width: 3,
          height: 3,
        },
      },
      android: {
        elevation: 3,
      },
    }),
  },
  cardStyle: {
    marginTop: 16,
    width: wp("88%"),
    flexDirection: 'row',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 7,
    backgroundColor: 'white',
    alignItems: "center",
    justifyContent: "center",

  },
  container: {
    ...Platform.select({
      android: {
        top: 24,
      },
    }),
    backgroundColor: "#ffffcc",
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
    fontFamily: 'BMYEONSUNG',
    marginTop: 5,
  },
  txtBreweryfont: {
    fontSize: 12,
    color: '#444',
    fontFamily: 'BMYEONSUNG'
  },

})
