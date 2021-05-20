import { createStackNavigator } from '@react-navigation/stack'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import LoginScreen from '../screens/LoginScreen'
import SignUpScreen from '../screens/SignUpScreen'
import {AuthContext, createFunctions} from '../context/AuthContext'
import { theme } from '../core/theme'
import {API_URI} from '../core/config'
import RootNavigator from './RootNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from 'jwt-decode'

const AuthNavigator = () => {

    //Used whenever the state changes. A state change means that a token has been assigned or designed, meaning the user has logged in or logged off
    const [state, dispatch] = React.useReducer(
        (prevState, action) => {
            switch(action.type){
                case 'SIGN_IN_RELOAD':
                    return{
                        ...prevState,
                        userToken: action.token,
                        isLoading: false,
                        userName: action.userName
                    };
                case 'SIGN_IN': 
                    return{
                        ...prevState,
                        isSignOut: false,
                        userToken: action.token
                    };
                case 'SIGN_OUT':
                    return{
                        ...prevState,
                        isSignOut: true,
                        userToken: null
                    }
            }
        },
        {
            //defaults
            isLoading: true,
            isSignOut: false,
            userToken: null,
            userName: 'a'
        }
    );
    
    //Used to fetch the user data on startup/re-rendering, so that a user does not hve to log in every time
    React.useEffect(
    () => {
        let tokenReceived, decodedToken = null;
        const getToken = async () => {
            try
            {
                tokenReceived = await AsyncStorage.getItem('token');
                
                if (tokenReceived)
                {
                    await fetch(`${API_URI}/auth/validate`, {
                        "method": "GET",
                        "headers": {
                            Authorization: `Bearer ${tokenReceived}`
                                }
                            }
                        )
                        .then(res => {return res.json()})
                        .then(responseJSON => 
                            {
                                if(responseJSON.success)
                                {
                                    decodedToken = jwt_decode(tokenReceived);
                                }
                                else
                                {
                                    tokenReceived = null;
                                }
                            });
                }
                else
                {
                    tokenReceived = null;
                }
            }
            catch(e)
            {
                tokenReceived = null;
            };
            console.log("token:" + tokenReceived);
            dispatch({type: 'SIGN_IN_RELOAD', token: tokenReceived, userName: decodedToken?.userName || ''});

        };
        getToken();
    }, [] ) //this means only use on mount, not on rerender

    
    const AuthStack = createStackNavigator();
    const authContext = createFunctions([state, dispatch]);

    return (
        <AuthContext.Provider value={authContext}>
            <AuthStack.Navigator>
                {state.userToken == null ?
                (<>
                <AuthStack.Screen name="Login" 
                    component={LoginScreen}
                    options={{headerShown: false}}/>
                <AuthStack.Screen name="SignUp" 
                    component={SignUpScreen}
                    options={{headerShown: true}}/>
                </>
                ) : (
                <AuthStack.Screen name="Home" 
                    component={RootNavigator}
                    options={{
                        headerShown: false}
                    }/>
                )}
            </AuthStack.Navigator>
        </AuthContext.Provider>
    )
}

export default AuthNavigator

const styles = StyleSheet.create({})
