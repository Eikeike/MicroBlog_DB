import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/core';
import {API_URI} from '../core/config';

async function callApi(endpoint, body)
{
    let token;
    try
    {
        token = await AsyncStorage.getItem('token');
    }
    catch(e){
        console.log("Cannot access Async storage");
        token = null;
    };

    const headers = {"Content-Type": "application/json"};

    //Add a JWT to the request to authorize
    if(token)
    {
        headers.Authorization = `Bearer ${token}`;
        console.log(token);
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
    return fetch(`${API_URI}${endpoint}`, request).then(
        async (res) => {
            console.log(res);
            response = await res.json();
            if(res.status === 401)
            {
                if(response.message.includes('Token'))
                {
                    //invalid token request
                    useNavigation().navigate("Login");
                }
            }
            return response; //TODO: check if OK and implement promise handler
        }
    )
}

export default callApi
