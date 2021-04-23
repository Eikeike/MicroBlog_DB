import { createStackNavigator } from '@react-navigation/stack';
import React from 'react'
import { StyleSheet, SafeAreaView, Platform, StatusBar, FlatList, View, Text, TouchableOpacity } from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FeedList from '../components/FeedList'
import PostDetails from '../screens/PostDetails'
import { theme } from '../core/theme'
import {feed} from '../dataHelpers/feed'
import {CreatePost, submitPost} from '../screens/CreatePost';
import TabNavigator from './TabNavigator';

const RootStack = createStackNavigator();

const RootNavigator = () => {

    //contains two screens: The main screen containing the feed and the post details
    //and the modal/screen for writing a new post
    return (
        <RootStack.Navigator mode="modal">
            <RootStack.Screen name={"Main"} options={{headerShown: false}} component={TabNavigator}  />
            <RootStack.Screen name={"CreatePost"} 
                options={{
                    headerShown: true,
                    headerTitle: "What's happening?",
                    headerRight: submitPost
                    }} 
                component={CreatePost} />
        </RootStack.Navigator>
        
    )
}

export default RootNavigator
