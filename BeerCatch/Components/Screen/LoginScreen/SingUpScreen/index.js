import React, { useState } from 'react';
import { Platform, StyleSheet, Text, View, Image, YellowBox, TouchableOpacity } from 'react-native';

import KakaoLogins, { KAKAO_AUTH_TYPES } from '@react-native-seoul/kakao-login';
import NativeButton from 'apsl-react-native-button';
import { Fonts } from '../../../../assets/fonts'
import axios from 'axios';

if (!KakaoLogins) {
    console.error('Module is Not Linked');
}

const logCallback = (log, callback) => {
    console.log(log);
    callback;
};

const TOKEN_EMPTY = 'token has not fetched';
const PROFILE_EMPTY = {
    id: 'profile has not fetched',
    email: 'profile has not fetched',
    profile_image_url: '',
};

export default function SingUpScreen({ navigation, route }) {
    const [loginLoading, setLoginLoading] = useState(false);
    const [logoutLoading, setLogoutLoading] = useState(false);
    const [profileLoading, setProfileLoading] = useState(false);
    const [unlinkLoading, setUnlinkLoading] = useState(false);

    const [token, setToken] = useState(TOKEN_EMPTY);
    const [profile, setProfile] = useState(PROFILE_EMPTY);

    const kakaoLogin = () => {
        logCallback('Login Start', setLoginLoading(true));

        KakaoLogins.login([KAKAO_AUTH_TYPES.Talk, KAKAO_AUTH_TYPES.Account])
            .then(result => {
                setToken(result.accessToken);
                logCallback(
                    `Login Finished:${JSON.stringify(result)}`,
                    setLoginLoading(false),
                );
                KakaoLogins.getProfile()
                .then(result => {
                    setProfile(result);
                    console.warn(result);
                    logCallback(
                        `Get Profile Finished:${JSON.stringify(result)}`,
                        setProfileLoading(false),
                    );
                })
                .catch(err => {
                    logCallback(
                        `Get Profile Failed:${err.code} ${err.message}`,
                        setProfileLoading(false),
                    );
                });
            })
            .catch(err => {
                if (err.code === 'E_CANCELLED_OPERATION') {
                    logCallback(`Login Cancelled:${err.message}`, setLoginLoading(false));
                } else {
                    logCallback(
                        `Login Failed:${err.code} ${err.message}`,
                        setLoginLoading(false),
                    );
                }
            });
    };

    // const kakaoLogout = () => {
    //     logCallback('Logout Start', setLogoutLoading(true));

    //     KakaoLogins.logout()
    //         .then(result => {
    //             setToken(TOKEN_EMPTY);
    //             setProfile(PROFILE_EMPTY);
    //             logCallback(`Logout Finished:${result}`, setLogoutLoading(false));
    //         })
    //         .catch(err => {
    //             logCallback(
    //                 `Logout Failed:${err.code} ${err.message}`,
    //                 setLogoutLoading(false),
    //             );
    //         });
    // };

    // async function getProfile() {
    //     logCallback('Get Profile Start', setProfileLoading(true));

    //     KakaoLogins.getProfile()
    //         .then(result => {
    //             setProfile(result);
    //             console.warn(result);
    //             logCallback(
    //                 `Get Profile Finished:${JSON.stringify(result)}`,
    //                 setProfileLoading(false),
    //             );
    //         })
    //         .catch(err => {
    //             logCallback(
    //                 `Get Profile Failed:${err.code} ${err.message}`,
    //                 setProfileLoading(false),
    //             );
    //         });
    //     let url = 'http://ec2-13-125-90-172.ap-northeast-2.compute.amazonaws.com/api/user/';
    //     let options = {
    //         method: 'POST',
    //         url: url,
    //         headers: {
    //             'Accept': 'application/json',
    //             'Content-Type': 'application/json;charset=UTF-8'
    //         },
    //         data: {
    //             user_id: (JSON.stringify(profile.id).replace(/^"+|"+$/g, '')),
    //             name: (JSON.stringify(profile.nickname).replace(/^"+|"+$/g, '')),
    //             email: (JSON.stringify(profile.email).replace(/^"+|"+$/g, '')),
    //             gender: (JSON.stringify(profile.gender).replace(/^"+|"+$/g, '')),
    //             type: "kakao"
    //         }
    //     };
    //     let response = await axios(options);
    //     console.warn(response);
    // };

    // const unlinkKakao = () => {
    //     logCallback('Unlink Start', setUnlinkLoading(true));

    //     KakaoLogins.unlink()
    //         .then(result => {
    //             setToken(TOKEN_EMPTY);
    //             setProfile(PROFILE_EMPTY);
    //             logCallback(`Unlink Finished:${result}`, setUnlinkLoading(false));
    //         })
    //         .catch(err => {
    //             logCallback(
    //                 `Unlink Failed:${err.code} ${err.message}`,
    //                 setUnlinkLoading(false),
    //             );
    //         });
    // };

    const { id, email, profile_image_url: photo } = profile;

    return (
        <View style={styles.container}>
            <View style ={styles.profile}>
                    <Image source={require('../../../../assets/images/logo.png')}
                        style={{
                           resizeMode:"contain",
                            width:40,
                            height: 40,
                        }}
                    />
                    <Text
                        style={{
                            fontFamily: 'BMYEONSUNG',
                            fontSize: 30,
                            paddingLeft:10
                        }}
                    >BeerCatch</Text>
            </View>
                {/* <Image style={styles.profilePhoto} source={{uri: photo}} /> */}
                {/* <Text>{`id : ${id}`}</Text>
        <Text>{`email : ${email}`}</Text> */}
       
            <View style={styles.content}>
               
                {/* <Text style={styles.token}>{token}</Text> */}
                <NativeButton
                    isLoading={loginLoading}
                    onPress={kakaoLogin}
                    activeOpacity={0.5}
                    style={{  width: 190,
                        height: 44,
                        //justifyContent: 'center',
                        color: "#783c00",
                        alignSelf: 'center',
                        backgroundColor: "#FFEB00",
                        //border: 1px solid transparent,
                        borderColor: "#783c00",
                        borderRadius: 3,
                        fontSize: 16,
                        fontWeight: "bold",}}
                    textStyle={styles.txtKakaoLogin}>
                    카카오톡 로그인
        </NativeButton>
        <NativeButton
                    isLoading={loginLoading}
                    onPress={kakaoLogin}
                    activeOpacity={0.5}
                    style={{  width: 190,
                        height: 44,
                        //justifyContent: 'center',
                        alignSelf: 'center',
                        backgroundColor: "#ea4435",
                        //border: 1px solid transparent,
                        borderColor: "#783c00",
                        borderRadius: 3,
                        fontSize: 16,
                        fontWeight: "bold",}}
                    textStyle={styles.txtKakaoLogin}>
                    구글 로그인
        </NativeButton>
        <NativeButton
                    isLoading={loginLoading}
                    onPress={kakaoLogin}
                    activeOpacity={0.5}
                    style={{  width: 190,
                        height: 44,
                        //justifyContent: 'center',
                        alignSelf: 'center',
                        backgroundColor: "#3b5998",
                        //border: 1px solid transparent,
                        borderColor: "#783c00",
                        borderRadius: 3,
                        fontSize: 16,
                        fontWeight: "bold",}}
                    textStyle={styles.txtKakaoLogin}>
                    페이스북 로그인
        </NativeButton>
                {/* <NativeButton
          isLoading={logoutLoading}
          onPress={kakaoLogout}
          activeOpacity={0.5}
          style={styles.btnKakaoLogin}
          textStyle={styles.txtKakaoLogin}>
          Logout
        </NativeButton> */}
                {/* <NativeButton
                    isLoading={profileLoading}
                    onPress={getProfile}
                    activeOpacity={0.5}
                    style={styles.btnKakaoLogin}
                    textStyle={styles.txtKakaoLogin}>
                    getProfile
        </NativeButton>
            */}
            <TouchableOpacity
            onPress={() => route.params.changeLoginStatus(1)}
            >
                <Text
                    style={{
                        fontFamily: 'BMYEONSUNG',
                        fontSize: 13,
                        color: 'black'
                    }}
                >                        
                로그인 없이 사용하기</Text>
                </TouchableOpacity>
                <View
                style={{
                    flexDirection: 'row',
                    paddingTop:10
                }}>
                 <Text
                    style={{
                        fontFamily: 'BMYEONSUNG',
                        fontSize: 11,
                        color: 'gray'
                    }}
                >회원가입 없이 이용 가능하며 첫 로그인시</Text>
                <Text
                    style={{
                        fontFamily: 'BMYEONSUNG',
                        fontSize: 11,
                        color: '#0645AD'
                    }}
                > 이용약관</Text>
                   <Text
                    style={{
                        fontFamily: 'BMYEONSUNG',
                        fontSize: 11,
                        color: 'gray'
                    }}
                > 및</Text>
                </View>

                <View
                style={{
                    flexDirection: 'row',
                    paddingTop:0
                }}>
                 <Text
                    style={{
                        fontFamily: 'BMYEONSUNG',
                        fontSize: 11,
                        color: '#0645AD'
                    }}
                >개인정보처리방침 </Text>
                <Text
                    style={{
                        fontFamily: 'BMYEONSUNG',
                        fontSize: 11,
                        color: 'gray'
                    }}
                >동의로 간주됩니다.</Text>
                </View>
                {/* <NativeButton
          isLoading={unlinkLoading}
          onPress={unlinkKakao}
          activeOpacity={0.5}
          style={styles.btnKakaoLogin}
          textStyle={styles.txtKakaoLogin}>
          unlink
        </NativeButton> */}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
       
        backgroundColor: 'white',
    },
    profile: {
        flex:1,
        flexDirection: 'row',
        alignItems: 'flex-end',
       // justifyContent: 'center',
        
        justifyContent: 'center',
    },
    profilePhoto: {
        width: 120,
        height: 120,
        borderWidth: 1,
        borderColor: 'black',
    },
    content: {
        flex:2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    token: {
        width: 200,
        fontSize: 12,
        padding: 5,
        borderRadius: 8,
        marginVertical: 20,
        backgroundColor: 'grey',
        color: 'white',
        textAlign: 'center',
    },
    btnKakaoLogin: {

        width: 190,
        height: 44,
        //justifyContent: 'center',
        color: "#783c00",
        alignSelf: 'center',
        backgroundColor: "#FFEB00",
        //border: 1px solid transparent,
        borderColor: "#783c00",
        borderRadius: 3,
        fontSize: 16,
        fontWeight: "bold",
        //textAlign: "center",

    },
    txtKakaoLogin: {
        fontSize: 16,
        color: '#111',
        fontFamily: 'BMYEONSUNG'
    },
});

YellowBox.ignoreWarnings(['source.uri']);