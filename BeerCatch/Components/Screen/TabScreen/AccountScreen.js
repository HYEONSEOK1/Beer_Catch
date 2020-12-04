import React, { Component } from 'react'
import { Text, StyleSheet, View, TouchableOpacity } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import * as Animatable from 'react-native-animatable';
import ParallaxScrollView from 'react-native-parallax-scroll-view';
export default class AccountScreen extends Component {

    render() {
        const { onScroll = () => { } } = this.props;
        return (
            <View style={styles.container}>
                <View style={styles.ProfileSection}>
                    {/* <Animatable.Text animation="slideInDown"
                        style={{ fontFamily: "NanumSquareRoundB" }}
                        animation={{
                            from: { translateY: 1 },
                            to: { translateY: -1 },
                        }}
                        iterationCount={"infinite"} direction="alternate">Edit your Profile</Animatable.Text> */}
                    <TouchableOpacity style={styles.ProfileContentSection}>
                        <Ionicons name="person-circle-outline" style={{ fontSize: 85, height: 85, color: 'orange' }} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.ProfileContentSection}>
                        <Text style={[styles.ContentText, { fontSize: 17, paddingTop: 10 }]}>감자의 품격</Text>
                        <Ionicons name="create-outline" style={styles.profileIcon} />
                    </TouchableOpacity>



                </View>
                <ParallaxScrollView
                    onScroll={onScroll}
                    style={styles.Section}
                    stickyHeaderHeight={hp('0%')}
                    parallaxHeaderHeight={hp('0%')}
                    backgroundScrollSpeed={1}>

                    <View style={styles.ContentSection}>
                        <Text style={styles.ContentText}>계정</Text>
                        <TouchableOpacity style={styles.InfoSection}>
                            <Text style={styles.InfoText}>나의 맥주</Text>
                            <Text style={styles.SubInfoText}>1</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.InfoSection}>
                            <Text style={styles.InfoText}>나의 평가</Text>
                            <Text style={styles.SubInfoText}>2</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.InfoSection}>
                            <Text style={styles.InfoText}>공지사항</Text>
                            <Ionicons name="chevron-forward-outline" style={styles.forward} />
                        </TouchableOpacity>


                    </View>

                    <View style={styles.ContentSection}>
                        <Text style={styles.ContentText}>이용 안내</Text>
                        <View style={styles.InfoSection}>
                            <Text style={styles.InfoText}>앱 버전</Text>
                            <Text style={styles.SubInfoText}>0.0.2</Text>
                        </View>
                        <TouchableOpacity style={styles.InfoSection}>
                            <Text style={styles.InfoText}>문의하기</Text>
                            <Ionicons name="chevron-forward-outline" style={styles.forward} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.InfoSection}>
                            <Text style={styles.InfoText}>공지사항</Text>
                            <Ionicons name="chevron-forward-outline" style={styles.forward} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.InfoSection}>
                            <Text style={styles.InfoText}>개인정보 처리방침</Text>
                            <Ionicons name="chevron-forward-outline" style={styles.forward} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.ContentSection}>
                        <Text style={styles.ContentText}>기타</Text>
                        <TouchableOpacity style={styles.InfoSection}>
                            <Text style={styles.InfoText}>회원 탈퇴</Text>
                            <Ionicons name="chevron-forward-outline" style={styles.forward} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.InfoSection}>
                            <Text style={styles.InfoText}>로그아웃</Text>
                            <Ionicons name="chevron-forward-outline" style={styles.forward} />
                        </TouchableOpacity>
                    </View>

                </ParallaxScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    Section: {
        justifyContent: "center",
        alignItems: "center"
    },
    ProfileSection: {
        height: hp("20%"),
        width: wp("100%"),
        alignItems: "center",
        justifyContent: "center",
    },
    ProfileContentSection: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
     
    },
    ContentSection: {
        width: wp("90%"),
        flex: 1,
        paddingLeft: 15,
        paddingRight: 10,
        paddingTop: 20,
        margin: 10,
        shadowColor: 'black',
        shadowOpacity: 0.7,
        shadowOffset: { width: 20, height: 20 },
        shadowRadius: 10,
        elevation: 3,
        borderRadius: 10,
        backgroundColor: "white",

    },
    InfoSection: {
        height: hp("5%"),
        flex: 1,
        paddingLeft: 10,
        paddingRight: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginVertical: 10,
    },
    ContentText: {
        fontSize: 20,
        fontFamily: "NanumSquareRoundB",
        paddingBottom: 10
    },
    InfoText: {
        fontSize: 15,
        fontFamily: "NanumSquareRoundL",
    },
    SubInfoText: {
        fontSize: 12,
        fontFamily: "NanumSquareRoundL",
    },
    infocontainer: {
        paddingTop: 20,
        paddingBottom: 12,
        backgroundColor: '#F4F5F4',
    },
    profileIcon: {
        fontSize: 13,
        height: 13,
        color: 'gray',
        left:5,
        bottom:-5
    },
    forward: {
        fontSize: 20,
        height: 20,
        color: 'orange',
        right: -5
    }


})
