import React,{Component} from 'react';
import { View, StyleSheet, Dimensions, Text, Image,TouchableOpacity, FlatList } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { FlatGrid } from 'react-native-super-grid';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Flag from 'react-native-flags';
import { FocusScrollView } from 'react-native-focus-scroll';
import LinearGradient from "react-native-linear-gradient";
const SecondRoute = () => (
  <View style={[styles.scene, { backgroundColor: '#673ab7' }]} />
);

const initialLayout = { width: Dimensions.get('window').width };
class BeerComponent extends Component {
  render() {
      let focusText;
      let opacity;
      if (this.props.isFocused) {
          focusText = (<Text style={{color: "#ff0"}}>Focused!</Text>);
          opacity = {opacity: 0.78};

      } else {
          focusText = (<Text style={{color: "#fff"}}>Not Focused!</Text>);
          opacity = {opacity: 0.05};
      }

      return (
          <View style={[styles.square, styles.wrapper, {backgroundColor:"black"}]} onLayout={this.props.onLayout}>
              <Image style={[styles.square, opacity, {position: "absolute"}]} source={this.props.imageUrl} />
              <View style={styles.textWrapper}>
                  <Text style={styles.text}>{this.props.name}</Text>
                  <Text style={{color: "#fff", fontStyle:"italic",fontWeight:"bold"}}>{this.props.content}</Text>
                  <Text style={{color: "#fff", fontStyle:"italic",fontWeight:"bold"}}>{this.props.content2}</Text>
                  <Text style={{color: "#fff", fontStyle:"italic",fontWeight:"bold"}}>{this.props.content3}</Text>
                  {/* {focusText} */}
              </View>
          </View>
      )
  }
}
export default function RankingTabScreen({navigation}) {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'first', title: 'TYPE' },
    { key: 'second', title: 'COUNTRY' },
  ]);


  const [items, setItems] = React.useState([
    { name: 'Korea', code: 'KR' },
    { name: 'Belgium', code: 'BE' },
    { name: 'Germany', code: 'DE' },
    { name: 'Denmark', code: 'DK' },
    { name: 'China', code: 'CN' },
    { name: 'France', code: 'FR' },
    { name: 'Czech Republic', code: 'CZ' },
    { name: 'Ireland', code: 'IE' },
  ]); 
  const beers = [
    {name: "라거", imageUrl:  require('../../../../../assets/images/Lager.png'),
  content:"9~15'C의 저온에서 발효시켜 만든 맥주",
  content2:"알코올 도수가 낮은 편이며 색깔이 밝고",
  content3:"맛도 깔끔하고 청량하며 담백한 편"
  },
    {name: "에일", imageUrl:  require('../../../../../assets/images/Ale.png'),
    content:"9~15'C의 저온에서 발효시켜 만든 맥주",
    content2:"알코올 도수가 낮은 편이며 색깔이 밝고",
    content3:"맛도 깔끔하고 청량하며 담백한 편"},
    {name: "ETC", imageUrl:  require('../../../../../assets/images/etc.png'),
    content:"9~15'C의 저온에서 발효시켜 만든 맥주",
    content2:"알코올 도수가 낮은 편이며 색깔이 밝고",
    content3:"맛도 깔끔하고 청량하며 담백한 편"},
    ];
  const renderitemView = (item) => {
      let ttt = require('../../../../../assets/images/country/belgium.png');
        if(item.code == 'BE'){
        ttt=require('../../../../../assets/images/country/belgium.png');
        }
        else if(item.code == 'KR'){
            ttt=require('../../../../../assets/images/country/korea.png');
        }
        else if(item.code == 'DE'){
            ttt=require('../../../../../assets/images/country/germany.png');
        }
        else if(item.code == 'KR'){
            ttt=require('../../../../../assets/images/country/korea.png');
        }
        else if(item.code == 'CN'){
            ttt=require('../../../../../assets/images/country/china.png');
        }
        else if(item.code == 'FR'){
            ttt=require('../../../../../assets/images/country/france.png');
        }
        else if(item.code == 'CZ'){
            ttt=require('../../../../../assets/images/country/czech.png');
        }
        else if(item.code == 'IE'){
            ttt=require('../../../../../assets/images/country/ireland.png');
        }
        
    return(
     
        <TouchableOpacity style={styles.itemContainer} 
        onPress={()=>navigation.navigate("RankingInfoScreen")}
        >
        <Image style={{
        width: '100%',
        height: undefined,
        aspectRatio: 1.33,
        position:"absolute",
        opacity: 0.5
      }} source={ttt} />
       <View style={{ flexDirection: "row", alignItems:"center"}}>
            <Flag code={item.code} size={16} />
            <Text style={styles.itemName}> {item.name}</Text>
          </View>
      </TouchableOpacity>
   
     
)
  }
  const renderReview = (item) => {
    console.warn(item);
    return(
    <Image style={{
      width: 200,
      height: 200,
      opacity: 1
    }} source={{uri:item}} />
    )
  }
  const FirstRoute = () => (

    <FocusScrollView style={{backgroundColor:"#eeeeee"}} threshold={wp("100%") / 2}>
                    {beers.map((beer, index) => <BeerComponent key={index} name={beer.name} imageUrl={beer.imageUrl} 
                    content={beer.content} content2={beer.content2} content3={beer.content3} 
                    />)}
                </FocusScrollView>



  );
  const SecondRoute = () => (
    <FlatGrid
    itemDimension={wp("48%")}
    data={items}
    style={styles.gridView}
    // staticDimension={300}
    // fixed
    spacing={wp("1%")}
    renderItem={({ item }) => (
        renderitemView(item)
    )}
  /> 
  );

  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
  });
  const renderTabBar = props => (
    <TabBar
    {...props}
    indicatorStyle={{ backgroundColor: "pink",}}
    style={{ backgroundColor: "white", shadowOpacity: 0,}}
    activeColor={"black"}
    inactiveColor={"gray"}
    renderLabel={({ route, focused, color }) => (
        <Text style={{ color, margin: 8, fontWeight:"bold" }}>
          {route.title}
        </Text>
      )}
    />
  );
  return (
    <TabView
    swipeEnabled={false}
    renderTabBar={renderTabBar}
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={initialLayout}
    />
  );
}

const styles = StyleSheet.create({
  scene: {
    flex: 1,
    
  },
  itemContainer: {
    justifyContent: 'center',
    alignItems:'center',
    borderRadius: 5,
    height: wp("36%"),
    backgroundColor:"black"
  },
  itemName: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  itemCode: {
    fontWeight: '600',
    fontSize: 12,
    color: '#fff',
  },
  container: {
    top: 20,
},
square: {
    width: wp("96%"),
    height: wp("96%"),
    borderRadius: 15,
    marginBottom:10
},
wrapper: {
    justifyContent: "center",
    alignItems: "center",
    alignSelf:"center",
    backgroundColor: "black",
},
textWrapper: {
    position: "absolute",
    padding: 20,
    alignItems: "center",
},
text: {
    color: "white",
    fontSize: 32,
    fontWeight: "bold",
    alignContent: "center",
    alignSelf: "center",
    fontFamily:"NanumSquareRoundEB"
},
});