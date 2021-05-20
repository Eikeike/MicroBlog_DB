import React from 'react'
import callApi from '../hooks/callApi'
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = React.createContext();

//Provides functionality for the authContext. Components within the AuthContext can call either of these functions.
    //Calling one of these functions triggers a dispatch, meaning the reducer is called. That causes a re-render of the main component, which then again checks 
    //If the token is still valid. Depending on that, the correct screen is shown.
    const createFunctions = ([state, dispatch]) => {
return  React.useMemo(
    () => {let userFuncs = 
        {
            signIn: async userData => {
                //Do something with the userData (signing in, of course)
                
                const response = await callApi('/auth/login', userData);
                if(!response.success) //notice the NOT
                {
                    return response; //go back inside login Screen and display error message
                }
                else
                {
                    const token = response.token;
                    try
                    {
                        await AsyncStorage.setItem('token', token);
                    }
                    catch(e)
                    {
                        console.log("orr norr, your storage does not work. Cannot save token")
                    }
                    userFuncs.userName = userData.userName;
                    dispatch({type: 'SIGN_IN', token: token});
                    return null;
                }
            },
            signUp: async userData => {
                //Do something with the userData (signing up, of course)
                const response = await callApi('/auth/signup', userData);
                return response;
            },
            signOut: async () => {
                //Do something with the userData (signing out, of course)
                try {
                    await AsyncStorage.removeItem('token')
                  } catch(e) {
                    console.log("orr norr, your storage does not work. Cannot save token")
                  }
                dispatch({type: 'SIGN_OUT'});
            },
            userName: state.userName //to avoid always calling the function
        }
    return userFuncs
    }, [state.userName]
)
    }

export {AuthContext, createFunctions};