import { createStackNavigator } from '@react-navigation/stack';
import React from 'react'
import { StyleSheet, SafeAreaView, Platform, StatusBar, FlatList, View, Text, TouchableOpacity } from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FeedList from '../components/FeedList'
import PostDetails from './PostDetails'
import { theme } from '../core/theme'
import {feed} from '../dataHelpers/feed'
import { Appbar, Divider } from 'react-native-paper';

const FeedStack = createStackNavigator();

const FeedListWithIcon = ({route, navigation}) => {
    return(
    <>
    <FeedList feed={feed}/>
        <TouchableOpacity style={styles.addPostButton} onPress={() => {
            navigation.navigate("CreatePost");
        }}>
                <MaterialCommunityIcons name="pencil-plus" color={'#fff'} size={35} />
        </TouchableOpacity>
    </>
    )
}

const FeedStackScreen = () => {
    return(
        <>
        <Appbar.Header style={styles.appBar}>
            <Appbar.Content title={<MaterialCommunityIcons name="email" color={theme.colors.primary} size={35}/>} titleStyle={{alignSelf: 'center'}}/>
        </Appbar.Header>
        <Divider/>
        <FeedList feed={feed}/>
        <TouchableOpacity style={styles.addPostButton} onPress={() => {
            navigation.navigate("CreatePost");
        }}>
                <MaterialCommunityIcons name="pencil-plus" color={'#fff'} size={35} />
        </TouchableOpacity>
        </>
    )
}

const styles = StyleSheet.create({
    appBar: {
        backgroundColor: theme.colors.background
    },
    addPostButton: {
        height: 60,
        width: 60,
        borderRadius: 50,
        backgroundColor: theme.colors.primary,
        right: 30,
        bottom: 30,
        elevation: 5,
        shadowColor: '#000',
        shadowOpacity: 0.7,
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center'
    }
})

export default FeedStackScreen