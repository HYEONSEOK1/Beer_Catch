import * as React from 'react';
import { View, StyleSheet, Dimensions, Text, Image } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { FlatGrid } from 'react-native-super-grid';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Flag from 'react-native-flags';

const SecondRoute = () => (
  <View style={[styles.scene, { backgroundColor: '#673ab7' }]} />
);

const initialLayout = { width: Dimensions.get('window').width };

export default function RankingTabScreen() {
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
        <View style={[styles.itemContainer,{ backgroundColor: "black" } ]}>
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
    </View>
)
  }
  const FirstRoute = () => (
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
    second: FirstRoute,
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
});