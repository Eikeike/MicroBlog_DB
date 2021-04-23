import React, {useState} from 'react'
import DateTimePicker from '@react-native-community/datetimepicker'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {theme} from '../core/theme'
import CustomButton from '../components/Button'
import TextInput from '../components/TextInput'
import AuthContext from '../context/AuthContext'
import { StyleSheet, Text, View, KeyboardAvoidingView, TouchableOpacity, Platform } from 'react-native'


const SignUpScreen = ({navigation}) => {
    const [userName, setUserName] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [dateOfBirth, setDoB] = useState({date: new Date(), picked: false});
    const [password, setPassword] = useState({firstTry: '', secondTry: ''});
    const [showDatePicker, setSDP] = useState(false);
    const {signUp} = React.useContext(AuthContext);

    const onSignUpPressed = () =>{
        alert(`got ${userName} and ${password.firstTry} with ${dateOfBirth.date.toDateString()}`);

        signUp({userName: userName, password: password});
        //This function automatically switches to home screen
    };

    const onDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || dateOfBirth.date;
        setSDP(Platform.OS === 'ios');
        setDoB({date: currentDate, picked: true});
    }

    const chooseDateString = () => {
        //show birthday or prompt to pick birthday if it has not been picked yet
        return dateOfBirth.picked ? 
        `${dateOfBirth.date.getDate()}/${dateOfBirth.date.getMonth()}/${dateOfBirth.date.getFullYear()}`
        : "Pick Birthday";
    }

    return (
        <KeyboardAvoidingView style={styles.container}>
            <View style={{width: '80%'}}>
                <TextInput 
                label="Username (must be unique)"
                onChangeText={text => setUserName(text)}
                value={userName}
                />
                <TextInput 
                label="Real name"
                onChangeText={text => setDisplayName(text)}
                value={displayName}
                />
                <TextInput
                label="Password"
                onChangeText={text => setPassword({firstTry: text, ...password})}
                value={password.password}
                secureTextEntry
                />
                <TextInput
                label="Repeat Password"
                onChangeText={text => setPassword({...password, secondTry: text})}
                value={password.secondTry}
                secureTextEntry
                />
                <View style={styles.datePickRow}>
                    <MaterialCommunityIcons name="cake-variant" color={theme.colors.secondary} size={26} />
                    <TouchableOpacity
                        style={styles.dateTime}
                        onPress={() => setSDP(true)}>
                            <Text style={{color: theme.colors.text, fontSize: 17}}>
                                {chooseDateString()}
                                </Text>
                    </TouchableOpacity>
                </View>
                {
                showDatePicker && (
                    <DateTimePicker 
                        mode='date'
                        maximumDate={new Date()}
                        value={dateOfBirth.date}
                        onChange={onDateChange}/>
                    )}
                <CustomButton
                onPress={onSignUpPressed}>
                    Sign up
                </CustomButton>
            </View>
        </KeyboardAvoidingView>
    )
}

export default SignUpScreen

const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.background
    },
    dateTime: {
        padding: 20,
        marginLeft: 20,
        backgroundColor: theme.colors.background,
        borderWidth: 1,
        borderRadius: 5,
        width: '60%'
    },
    signUp: {
        color: theme.colors.accent,
        marginLeft: 6
    },
    datePickRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingLeft: 15
    }
})
