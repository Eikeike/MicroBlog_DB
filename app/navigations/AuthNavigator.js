import { createStackNavigator } from '@react-navigation/stack'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import LoginScreen from '../screens/LoginScreen'
import SignUpScreen from '../screens/SignUpScreen'
import AuthContext from '../context/AuthContext'
import { theme } from '../core/theme'
import RootNavigator from './RootNavigator';

const AuthNavigator = () => {

    //Used whenever the state changes. A state change means that a token has been assigned or designed, meaning the user has logged in or logged off
    const [state, dispatch] = React.useReducer(
        (prevState, action) => {
            switch(action.type){
                case 'SIGN_IN_RELOAD':
                    return{
                        ...prevState,
                        userToken: action.token,
                        isLoading: false
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
            isLoading: true,
            isSignOut: false,
            userToken: null
        }
    );
    
    //Used to fetch the user data on startup/re-rendering, so that a user does not hve to log in every time
    React.useEffect(
        () => {
            let tokenReceived = null;
            const getToken = async () => {
                //Get token from async storage. Not implemented yet. But we can pretend :)
                try{
                    tokenReceived = 'jwt-mock';
                }
                catch(e){
                    console.log(e);
                }
                //Re-sign in
                dispatch({type: 'SIGN_IN_RELOAD', token: tokenReceived});
            };
            getToken();
        }, []
    )

    //Provides functionality for the authContext. Components within the AuthContext can call either of these functions.
    //Calling one of these functions triggers a dispatch, meaning the reducer is called. That causes a re-render of the main component, which then again checks 
    //If the token is still valid. Depending on that, the correct screen is shown.
    const authContext = React.useMemo(
        () => ({
            signIn: async userData => {
                //Do something with the userData (signing in, of course)
                console.log("Sign in called")
                dispatch({type: 'SIGN_IN', token: 'dummy token'});
            },
            signUp: async userData => {
                //Do something with the userData (signing in, of course)

                dispatch({type: 'SIGN_IN', token: 'dummy token'});
            },
            signOut: async () => {
                //Do something with the userData (signing in, of course)

                dispatch({type: 'SIGN_OUT'});
            },
            userName: 'eikewobken'
        }),
        []
    )
    const AuthStack = createStackNavigator();
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
                    options={{headerShown: false}}/>
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
