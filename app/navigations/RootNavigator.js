import { createStackNavigator } from '@react-navigation/stack';
import React from 'react'
import { StyleSheet, SafeAreaView, Platform, StatusBar, FlatList, View, Text, TouchableOpacity } from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FeedList from '../components/FeedList'
import PostDetails from '../screens/PostDetails'
import { theme } from '../core/theme'
import {feed} from '../dataHelpers/feed'
import {CreatePost} from '../screens/CreatePost';
import TabNavigator from './TabNavigator';
import UserScreen from '../screens/UserScreen';
import UsersList from '../components/UsersList'
import UserListScreen from '../screens/UserListScreen';

const RootStack = createStackNavigator();

const RootNavigator = () => {

    //contains two screens: The main screen containing the feed and the post details
    //and the modal/screen for writing a new post
    return (
        <RootStack.Navigator mode="modal">
            <RootStack.Screen name={"Main"} options={{headerShown: false}} component={TabNavigator} />
            <RootStack.Screen name={"UserInfo"}
                options={{headerShown: true, headerTransparent: true, headerTitle: ''}} 
                component={UserScreen}
                />
            <RootStack.Screen name={"PostDetails"} component={PostDetails}
            options={{headerTintColor: theme.colors.primary,
            headerTitleStyle: {color: '#000'},
            headerTitle: "Post"}}/>
            <RootStack.Screen name={"CreatePost"} 
                options={{
                    headerShown: true,
                    headerTitle: "What's happening?"
                    }} 
                component={CreatePost} />
            <RootStack.Screen name="UsersDisplay" component={UserListScreen} /> 
        </RootStack.Navigator>
        
    )
}

export default RootNavigator
