/*
 * This example demonstrates how to use ParallaxScrollView within a ScrollView component.
 */
import React, { Component } from 'react';
import {
    Image,
    PixelRatio,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import ParallaxScrollView from 'react-native-parallax-scroll-view';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import tvShowContent from '../../../assets/tvShowContent';
import LinearGradient from 'react-native-linear-gradient'
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
class TestScreen extends Component {
    constructor(props) {
        super(props);

    }

    render() {
        const { onScroll = () => { } } = this.props;
        return (

            <ParallaxScrollView
                onScroll={onScroll}

                backgroundColor="#FED52B"
                stickyHeaderHeight={hp('10%')}
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
                            height: hp('35%'),
                            resizeMode: 'contain',
                            position: 'absolute',
                            left: wp('15%'),
                            bottom: 0,
                        }} source={
                            require('../../../assets/images/tera.png')
                        } />
                        <View
                        style={{
                            
                            height: hp('35%'),
                            width:wp('50%'),
                            resizeMode: 'contain',
                            position: 'absolute',
                            left: wp('5%'),
                            bottom: 0,
                        }}
                        >
   <Text style={styles.sectionSpeakerText}>
                            Tera(테라)
                        </Text>
                        <Text style={ styles.sectionTitleText }>
                테라(Terra)는 하이트진로에서 발매하는 맥주 브랜드이다. 2019년 3월 처음 발매되었다. 2019년 7월과 8월에 2억병을 판매하였다.[1]

미쉐린 가이드 서울의 공식 맥주 파트너이다
                </Text>
                        </View>
                     
                        
                    </View>
                )}

                renderStickyHeader={() => (
                    <View key="sticky-header" style={styles.stickySection}>
                        <Text style={styles.stickySectionText}>Tera</Text>
                    </View>
                )}

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
                    <Text style={styles.title}>
                        <Text style={styles.name}>정보</Text>
                    </Text>
                </View>
                <View style={styles.section}>
                    <Text style={styles.sectionContent}>{tvShowContent.overview}</Text>
                </View>
                <View style={styles.section}>
                    <Text style={styles.title}>
                        <Text style={styles.name}>{tvShowContent.title}</Text>
                    </Text>
                </View>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Overview</Text>
                    <Text style={styles.sectionContent}>{tvShowContent.overview}</Text>
                </View>

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
    title: {
        fontSize: 20,
    },
    name: {
        fontWeight: 'bold',
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
        height: hp('10%'),
        width: wp('100%'),
        justifyContent: 'center',
        backgroundColor: '#FED52B'
    },
    stickySectionText: {
        color: 'white',
        fontSize: 20,
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
    sectionSpeakerText: {
        color: 'black',
        fontSize: wp('8%'),
        paddingVertical: 5
    },
    sectionTitleText: {
        color: 'black',
        fontSize: wp('3%'),
        paddingVertical: 5
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
});

export default TestScreen;