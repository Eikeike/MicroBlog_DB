import React, {useState} from 'react'
import { KeyboardAvoidingView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import CustomButton from '../components/Button'
import SignUpScreen from './SignUpScreen'
import TextInput from '../components/TextInput'
import {theme} from '../core/theme'
import AuthContext from '../context/AuthContext'

const LoginScreen = ({navigation}) => {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const {signIn} = React.useContext(AuthContext);

    const onLoginPressed = () =>{
        alert(`got ${userName} and ${password}`);
        signIn({name: userName, password: password});
        //This function automatically switches to home screen
    };

    return (
        <KeyboardAvoidingView style={styles.container}>
            <View style={{width: '80%'}}>
                <TextInput 
                label="Username"
                onChangeText={text => setUserName(text)}
                value={userName}
                />
                <TextInput
                label="Password"
                onChangeText={text => setPassword(text)}
                value={password}
                secureTextEntry
                />
                <CustomButton
                onPress={onLoginPressed}>
                    Login
                </CustomButton>
                <View style={styles.textRow}>
                    <Text>
                        Not logged in yet?
                    </Text>
                    <TouchableOpacity onPress={() => navigation.replace('SignUp')}>
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
