import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/core';
import {API_URI} from '../core/config';
import {Button, Alert, Platform} from 'react-native'

async function callApi(endpoint, body)
{
    let token;
    try
    {
        token = await AsyncStorage.getItem('token');
    }
    catch(e){
        
        token = null;
    };

    const headers = {"Content-Type": "application/json"};

    //Add a JWT to the request to authorize
    if(token)
    {
        headers.Authorization = `Bearer ${token}`;
        (token);
    }

    const request = {
        "method": body ? "POST" : "GET",
        "headers": {
            ...headers,
        }
    }
    if(body)
    {
        request.body = JSON.stringify(body);
    }
    
    //actually fetch here
    let response = null;
    return Promise.race([
        fetch(`${API_URI}${endpoint}`, request),
        new Promise((_r, reject) => setTimeout(() => reject('timeout'), 3000)) //Time out after 3 seconds
    ])
    .then(
        async (res) => {
            response = await res.json();
            console.log(res.status);
            if(res.status === 401)
            {
                    useNavigation().navigate("Login");
            }
            if(response || res.status === 201)
            {
                return response;
            }
            else
            {
                throw Error("BAD_CALL")
            } //TODO: check if OK and implement promise handler
        }
    ).catch(error => {
        if(Platform.OS === 'web')
        {
            alert("No internet connection");
        }
        else
        {
            Alert.alert(
                "No internet connection",
                "I can not reach the server at the moment. Please try again later.",
                [
                {
                    text: "Ok :(",
                    style: "cancel"
                }
                ]
            );
        }
        response = {success: false, message: 'No internet connection'};
        return response;
    })
}

export default callApi
