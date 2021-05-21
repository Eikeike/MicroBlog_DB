import React, {useState} from 'react'
import { KeyboardAvoidingView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import CustomButton from '../components/Button'
import TextInput from '../components/TextInput'
import {theme} from '../core/theme'
import {AuthContext} from '../context/AuthContext'
import {HelperText} from 'react-native-paper'

const LoginScreen = ({navigation}) => {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const {signIn} = React.useContext(AuthContext);
    const [userNameError, setUserNameError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const onLoginPressed = async () =>{
        
        setPasswordError('');
        setUserNameError('');
        if(userName == '')
        {
            setUserNameError("Please insert a username");
        }
        else if(password == '')
        {
            setPasswordError("Please insert a password");
        }
        else
        {
            const response = await signIn({userName: userName, password: password});
            if(response) //This does not mean we succeeded, just saying-
            {
                if(response.message.includes('password'))
                {
                    setPasswordError(response.message);
                }
                else{
                    setPasswordError('');
                    setUserNameError(response.message);
                }
            }
        }
    };

    return (
        <KeyboardAvoidingView style={styles.container} behavior='padding' keyboardVerticalOffset={100} >
            <View style={{width: '80%'}}>
                <TextInput 
                label="Username"
                onChangeText={text => setUserName(text)}
                value={userName}
                />
                <HelperText type="error" visible={() =>{ return userNameError != ''}}>
                    {userNameError}
                </HelperText>

                <TextInput
                label="Password"
                onChangeText={text => setPassword(text)}
                value={password}
                secureTextEntry
                />
                <HelperText type="error" visible={() =>{return passwordError != ''}}>
                    {passwordError}
                </HelperText>

                <CustomButton
                onPress={onLoginPressed}>
                    Login
                </CustomButton>
                <View style={styles.textRow}>
                    <Text>
                        Not logged in yet?
                    </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                        <Text style={styles.signUp}>Sign in</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    )
}

export default LoginScreen

const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.background
    },
    textRow:{
        flexDirection: 'row',
        marginTop: 10,
        justifyContent: 'center'
    },
    signUp: {
        color: theme.colors.accent,
        marginLeft: 6
    }
})
