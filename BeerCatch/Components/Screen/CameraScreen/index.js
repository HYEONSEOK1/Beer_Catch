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
    };

    takePicture = async function () {
        const options = { quality: 0.5, base64: true };
        const data = await this.camera.takePictureAsync(options);
        //  eslint-disable-next-line
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
                    item => ({ ...item, bToggle: 0 })
                )
            })
            this.setState({ isCamera: true })
        }
    };

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
            VideoData:[]
          }));
    }
    navigatePage = () => {
        this.props.navigation.navigate("InfoScreen", { "BeerInfo": this.state.content });
    }
    renderCheckBox = (item, key) => {
        const BeerInfo = Object.assign({}, this.state.content[key]);
        return (
            <TouchableOpacity
                key={key}
                onPress={() => this.changeToggleState(BeerInfo.id)}
                style={{
                    position: 'absolute', top: wp("100%") / 3 * 4 * BeerInfo.y1 / 4032, left: wp("100%") * BeerInfo.x1 / 3024, width: wp("100%") * (BeerInfo.x2 - BeerInfo.x1) / 3024, height: wp("100%") / 3 * 4 * (BeerInfo.y2 - BeerInfo.y1) / 4032,
                    borderWidth: wp("1%"),
                    borderColor: '#FED52B'
                }}>
                {
                    this.state.content[key].bToggle
                        ?
                        <Ionicons name="checkmark-circle-outline"
                            size={25}
                            style={{
                                color: '#FED52B',
                            }}
                        />
                        :
                        <Ionicons name="ellipse-outline"
                            size={25}
                            style={{
                                color: '#FED52B',
                            }}
                        />
                }

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
                        <View style={{ flex: 1, backgroundColor: "#FED52B", alignItems: "center", justifyContent: "space-around" }}>
                            <TouchableOpacity
                                style={[styles.flipButton, styles.picButton]}
                                onPress={() => this.navigatePage()}
                            >
                                <Text style={styles.flipText}> 찾기 </Text>

                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.flipButton, styles.picButton]}
                                onPress={() => this.changeCameraState()}
                            >
                                <Text style={styles.flipText}> 다시 찍기 </Text>
                            </TouchableOpacity>

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
                            <TouchableOpacity onPress={() => this.takePicture(camera)}>
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
        paddingTop: 10,
        backgroundColor: '#000',
    },
    flipButton: {
        flex: 0.3,
        height: 15,
        width:300,
        marginHorizontal: 2,
        borderRadius: 8,
        borderColor: 'white',
        borderWidth: 1,
        padding: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },

    flipText: {
        color: 'white',
        fontSize: 15,
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