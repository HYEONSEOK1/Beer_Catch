/* eslint-disable no-console */
import React, { Fragment } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Dimensions,
    Image
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Ionicons from 'react-native-vector-icons/Ionicons';
// eslint-disable-next-line import/no-unresolved
import { RNCamera } from 'react-native-camera';
import ImagePicker from 'react-native-image-picker';
const flashModeOrder = {
    off: 'on',
    on: 'auto',
    auto: 'torch',
    torch: 'off',
};

const wbOrder = {
    auto: 'sunny',
    sunny: 'cloudy',
    cloudy: 'shadow',
    shadow: 'fluorescent',
    fluorescent: 'incandescent',
    incandescent: 'auto',
};

const landmarkSize = 2;

export default class CameraScreen extends React.Component {
    state = {
        flash: 'off',
        type: 'back',
        whiteBalance: 'auto',
        ratio: '4:3',
        isCamera: false,
        VideoData: [],
        content: [],
        height:0,
        width:0,
    };

    takePicture = async function () {
        const options = { quality: 0.5, base64: true };
        const data = await this.camera.takePictureAsync(options);
        //  eslint-disable-next-line
        const width= data.height;
        const height= data.width;
        data.width =width;
        data.height =height;
        this.setState({ VideoData: data, });
        let ttt = new FormData();
        let filename = data.uri.split('/').pop();
        ttt.append('file', { uri: data.uri, name: filename, type: 'image/jpg', });

        var sssssss = new FormData();

        sssssss.append('image', { uri: data.uri, name: 'picture.jpg', type: 'image/jpg' });
        sssssss.append('title', "sdgdsg");
        // Create the config object for the POST
        const config = {
            method: 'POST',
            'Accept': 'application/json',

            body: sssssss
        };
        const rawResponse = await fetch('http://35.233.220.25:8000/api/image/', config).then(
        )
            .catch(err => { console.log(err); });
        const content = await rawResponse.json();

        if (content.length === 0) {
            this.setState({ isCamera: false, VideoData: [] });
        }
        else {
            this.setState({ content: content, })
            this.setState({
                content: this.state.content.map(
                    item => ({ ...item, bToggle: 0, beer_id: item.id })
                )
            })
            this.setState({ isCamera: true })
        }
    };
    showPicker = async function () {
        var self = this;
        ImagePicker.launchImageLibrary({ mediaType: 'photo', includeBase64: true, quality: 0.5 }, async function(response) {
            self.setState({ VideoData: response, });
            let ttt = new FormData();
            let filename = response.uri.split('/').pop();
            ttt.append('file', { uri: response.uri, name: filename, type: 'image/jpg', });
            var sssssss = new FormData();

        sssssss.append('image', { uri: response.uri, name: 'picture.jpg', type: 'image/jpg' });
        sssssss.append('title', "sdgdsg");
        // Create the config object for the POST
        const config = {
            method: 'POST',
            'Accept': 'application/json',
            body: sssssss
        };
        const rawResponse = await fetch('http://35.233.220.25:8000/api/image/', config).then(
        )
            .catch(err => { console.log(err); });
        const content = await rawResponse.json();        

        if (content.length === 0) {
            self.setState({ isCamera: false, VideoData: [] });
        }
        else {
            self.setState({ content: content, })
            self.setState({
                content: self.state.content.map(
                    item => ({ ...item, bToggle: 0, beer_id: item.id })
                )
            })
            self.setState({ isCamera: true })
        }
        })
    }
    renderCamera() {
        return (
            <RNCamera
                ref={ref => {
                    this.camera = ref;
                }}
                style={{
                    width: "100%", height: wp("100%") / 3 * 4
                }}
                type={this.state.type}
                flashMode={this.state.flash}
                whiteBalance={this.state.whiteBalance}
                ratio={this.state.ratio}
                androidCameraPermissionOptions={{
                    title: 'Permission to use camera',
                    message: 'We need your permission to use your camera',
                    buttonPositive: 'Ok',
                    buttonNegative: 'Cancel',
                }}
            >
            </RNCamera>
        );
    }
    changeToggleState = (key) => {
        this.setState(prevState => ({
            content: prevState.content.map(item => {
                if (item.id === key) {
                    return {
                        ...item,
                        bToggle: !item.bToggle
                    }
                }
                return item;
            })
        }));
    }
    changeCameraState = () => {
        this.setState(prevState => ({
            isCamera: !prevState.isCamera,
            content: [],
            VideoData: []
        }));
    }
    navigatePage = () => {
        this.props.navigation.navigate("InfoScreen", { "BeerInfo": this.state.content });
    }
    renderCheckBox = (item, key) => {
        const BeerInfo = Object.assign({}, this.state.content[key]);
        console.warn(this.state.content);
        console.warn(this.state.VideoData.width);
        console.warn(this.state.VideoData.height);
        
        return (
            this.state.content[key].bToggle
                ?
                <TouchableOpacity
                    key={key}
                    onPress={() => this.changeToggleState(BeerInfo.id)}
                    style={{
                        position: 'absolute', top: wp("100%") / 3 * 4 * BeerInfo.y1 / this.state.VideoData.height, left: wp("100%") * BeerInfo.x1 / this.state.VideoData.width, width: wp("100%") * (BeerInfo.x2 - BeerInfo.x1) / this.state.VideoData.width, height: wp("100%") / 3 * 4 * (BeerInfo.y2 - BeerInfo.y1) / this.state.VideoData.height,
                        borderWidth: wp("1%"),
                        borderColor: '#6EC93A'
                    }}>
                    <Image
                        source={require("../../../assets/images/check.png")}
                        style={{
                            left: -hp('1.5%'),
                            height: hp('3%'),
                            resizeMode: "contain"
                        }}
                    />
                </TouchableOpacity>
                :
                <TouchableOpacity
                    key={key}
                    onPress={() => this.changeToggleState(BeerInfo.id)}
                    style={{
                        position: 'absolute', top: wp("100%") / 3 * 4 * BeerInfo.y1 / this.state.VideoData.height, left: wp("100%") * BeerInfo.x1 / this.state.VideoData.width, width: wp("100%") * (BeerInfo.x2 - BeerInfo.x1) / this.state.VideoData.width, height: wp("100%") / 3 * 4 * (BeerInfo.y2 - BeerInfo.y1) / this.state.VideoData.height,
                        borderWidth: wp("1%"),
                        borderColor: '#FED52B'
                    }}>

                    <Image
                        source={require("../../../assets/images/uncheck.png")}
                        style={{
                            left: -hp('1.5%'),
                            height: hp('3%'),
                            resizeMode: "contain"
                        }}
                    />
                </TouchableOpacity>




        )
    }
    render() {
        return (
            <View style={styles.container}>
                {this.state.isCamera
                    ?
                    <Fragment>
                        <Image source={{ uri: this.state.VideoData.uri, }}
                            style={{ width: "100%", height: wp("100%") / 3 * 4 }}
                            resizeMode={'stretch'}

                        />
                        {this.state.content.map((item, key) => (this.renderCheckBox(item, key)))}
                        <View style={{ flex: 1, backgroundColor: "white", alignItems: "center", justifyContent: "space-around" }}>
                            <View />
                            <TouchableOpacity
                                style={styles.searchflipButton}
                                onPress={() => this.navigatePage()}
                            >
                                <Image
                                    source={require("../../../assets/images/search.png")}
                                    style={{

                                        height: hp('4%'),
                                        resizeMode: "contain"
                                    }}
                                />
                                <Text style={styles.flipText}> 찾기 </Text>

                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.reloadflipButton}
                                onPress={() => this.changeCameraState()}
                            >
                                <Image
                                    source={require("../../../assets/images/reload.png")}
                                    style={{

                                        height: hp('3.5%'),
                                        resizeMode: "contain"
                                    }}
                                />
                                <Text style={styles.flipText}> 다시 찍기 </Text>
                            </TouchableOpacity>
                            <View />
                        </View>
                    </Fragment>
                    :
                    <Fragment>
                        {this.renderCamera()}
                        <View style={{ flex: 1, backgroundColor: "#FED52B", flexDirection: 'row', alignItems: "center", justifyContent: "space-around" }}>
                            <TouchableOpacity
                                onPress={() => this.props.navigation.goBack()}>
                                <Ionicons name="close"
                                    size={25}
                                    style={{
                                        color: 'black',
                                    }}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={this.takePicture.bind(this)}
                                style={{
                                    shadowColor: 'black',
                                    shadowOpacity: 0.7,
                                    shadowOffset: { width: 20, height: 20 },
                                    shadowRadius: 10,
                                    elevation: 3,
                                    width: 56, height: 56,
                                    borderRadius: 28,
                                    backgroundColor: "white",
                                    alignItems: "center", justifyContent: "center"
                                }}
                            >

                                <Ionicons name="camera"
                                    size={30}
                                    style={{
                                        color: '#FED52B',
                                    }}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.showPicker()}>
                                <Ionicons name="ios-images-outline"
                                    size={25}
                                    style={{
                                        color: 'black',
                                    }}
                                />
                            </TouchableOpacity>
                        </View>
                    </Fragment>
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    searchflipButton: {
        height: hp("5%"),
        width: wp("70%"),
        borderRadius: 30,
        backgroundColor: "#FED52B",
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: "row"
    },
    reloadflipButton: {
        height: hp("5%"),
        width: wp("70%"),
        borderRadius: 30,
        borderColor: 'black',
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: "row"
    },
    flipText: {
        color: 'black',
        fontSize: wp("5%"),
        left: -10
    },

    picButton: {
        backgroundColor: 'gray',
    },
    facesContainer: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        left: 0,
        top: 0,
    },
    face: {
        padding: 10,
        borderWidth: 2,
        borderRadius: 2,
        position: 'absolute',
        borderColor: '#FFD700',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    landmark: {
        width: landmarkSize,
        height: landmarkSize,
        position: 'absolute',
        backgroundColor: 'red',
    },
    faceText: {
        color: '#FFD700',
        fontWeight: 'bold',
        textAlign: 'center',
        margin: 10,
        backgroundColor: 'transparent',
    },
    text: {
        padding: 10,
        borderWidth: 2,
        borderRadius: 2,
        position: 'absolute',
        borderColor: '#F00',
        justifyContent: 'center',
    },
    textBlock: {
        color: '#F00',
        position: 'absolute',
        textAlign: 'center',
        backgroundColor: 'transparent',
    },
});