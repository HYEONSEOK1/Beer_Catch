import React from 'react'
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet
} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
export default function SingInScreen({ navigation }) {
    return (
        <View style={styles.container}>
        <View style={styles.titleArea}>
            <Text style={styles.title}>Beer Catch</Text>
        </View>
        <View style={styles.formArea}>
            <TextInput 
                style={styles.textForm} 
                placeholder={"ID"}/>
            <TextInput 
                style={styles.textForm} 
                placeholder={"Password"}/>
        </View>
        <View style={styles.buttonArea}>
            <TouchableOpacity 
                style={styles.button}
                onPress={() => navigation.navigate('MainScreen')}>
               
                <Text style={styles.buttonTitle}>Login</Text>
            </TouchableOpacity>
            
        </View>
    </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        paddingLeft: wp('10%'),
        paddingRight: wp('10%'),
        justifyContent: 'center',
    },
    titleArea: {
        width: '100%',
        paddingBottom: wp('20%'),
        alignItems: 'center',
    },
    title: {
            fontFamily: "Cochin",
            fontWeight: "bold",
            color:'#FED52B',
            fontSize:30
    },
    formArea: {
        width: '100%',
        paddingBottom: wp('10%'),
    },
    textForm: {
        borderWidth: 0.5,
        borderColor: '#888',
        width: '100%',
        height: hp('7%'),
        paddingLeft: 5,
        paddingRight: 5,
        marginBottom: 5,
    },
    buttonArea: {
        width: '100%',
        height: hp('5%'),
    },
    button: {
        backgroundColor: "#FED52B",
        width: "100%",
        height: "100%",
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonTitle: {
        color: 'white',
    },
})
