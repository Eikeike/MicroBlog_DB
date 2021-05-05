import React, {useState} from 'react'
import DateTimePicker from '@react-native-community/datetimepicker'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {theme} from '../core/theme'
import CustomButton from '../components/Button'
import TextInput from '../components/TextInput'
import AuthContext from '../context/AuthContext'
import { StyleSheet, Text, ScrollView, View, KeyboardAvoidingView, TouchableOpacity, Platform, Alert } from 'react-native'
import {HelperText} from 'react-native-paper'

const SignUpScreen = ({navigation}) => {
    const [userName, setUserName] = useState('');
    const [showUserNameError, setUserNameError] = useState(false);
    const [displayName, setDisplayName] = useState('');
    const [showDisplayNameError, setDisplayNameError] = useState(false);
    const [password, setPassword] = useState({firstTry: '', secondTry: ''});
    const {signUp} = React.useContext(AuthContext);

    const onSignUpPressed = async () =>{
        if(userName == '')
        {
            setUserNameError(true);
            return;
        }
        if(displayName == '')
        {
            setDisplayNameError(true);
            return;
        }
        if(!passwordNotMatching())
        {
            const response = await signUp({name: displayName, userName: userName, password: password.firstTry});
            if(response.success)
            {
                if(Platform.OS ==='web')
                {
                    alert(`Hello ${displayName}, you have been registered successfully!`);
                    navigation.navigate("Login");
                }
                else{
                    Alert.alert(
                        "Successful",
                        "You have been registered as a user for this app!",
                        [
                            {
                            text: "Thanks",
                            style: "default",
                            onPress: () => {
                                navigation.navigate("Login");
                                }
                            }
                        ]
                    )
                }
            }
            else
            {
                if(Platform.OS ==='web')
                {
                    alert(`That did not work. Server responded with ${response.message}`);
                }
                Alert.alert(
                    "Oh no",
                    response.message,
                    [
                      {
                        text: ":(",
                        style: "default"
                      }]
                )
            }
        }
    };

    const passwordNotMatching = () =>
    {
        return (password.secondTry !== '') && (password.firstTry !== password.secondTry);
    }

    return (
        <KeyboardAvoidingView style={styles.container} behavior='padding' keyboardVerticalOffset={100}>
            <ScrollView style={{width: '100%', top: 100}} contentContainerStyle={{alignItems: 'center', justifyContent: 'center'}}>
                <View style={{width: '80%'}}>
                    <TextInput 
                    label="Username (must be unique)"
                    onChangeText={text => setUserName(text)}
                    value={userName}
                    />
                    <HelperText type="error" visible={showUserNameError}>
                        Please enter a valid username
                    </HelperText>
    
                    <TextInput 
                    label="Real name"
                    onChangeText={text => setDisplayName(text)}
                    value={displayName}
                    />
                    <HelperText type="error" visible={showDisplayNameError}>
                        Please enter a valid Name
                    </HelperText>
    
                    <TextInput
                    label="Password"
                    onChangeText={text => setPassword({...password, firstTry: text})}
                    value={password.firstTry}
                    secureTextEntry
                    />
                    <TextInput
                    label="Repeat Password"
                    onChangeText={text => setPassword({...password, secondTry: text})}
                    value={password.secondTry}
                    secureTextEntry
                    />
    
                    <HelperText type="error" visible={passwordNotMatching()}>
                        Passwords do not match!
                    </HelperText>
                    <CustomButton
                    onPress={onSignUpPressed}>
                        Sign up
                    </CustomButton>
                </View>
            </ScrollView>
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
    signUp: {
        color: theme.colors.accent,
        marginLeft: 6
    }
})
