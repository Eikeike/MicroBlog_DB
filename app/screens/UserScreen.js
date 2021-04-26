import React from 'react'
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs'
import { Avatar, Button } from 'react-native-paper'
import UserInfoCard from '../components/UserInfoCard'
import FeedList from '../components/FeedList'
import { theme } from '../core/theme'
import {user} from '../dataHelpers/user'
import {feed} from '../dataHelpers/feed'
import {comments} from '../dataHelpers/comments'
import { TabBarIndicator } from 'react-native-tab-view'
import UserTabNav from '../components/userTabNav'
import AuthContext from '../context/AuthContext'


const UserScreen = ({route, navigation}) => {
    
    const userContext = React.useContext(AuthContext);

    const [currUser, setCurrUser] = React.useState();
    const [userPosts, setUserPosts] = React.useState([]);
    const [userLikes, setUserLikes] = React.useState([]);
    const [userComments, setUserComments] = React.useState([]);

    React.useEffect(
        () => {
            setCurrUser(user);
            if(!route.params)
            {
                console.log(userContext.userName);
            }
            setUserPosts(feed);
            setUserLikes(feed);
            setUserComments(comments);
            //normally fetch from route.params.userName here
        },[currUser]
    );


    return (
        !currUser ? <ActivityIndicator/> : 
        <>
        <View style={styles.userInfo}>
            <UserInfoCard user={currUser}/>
        </View>
        <View style={styles.tabNav}>
            <UserTabNav posts={userPosts} likes={userLikes} comments={userComments}/>
        </View>
        </>
    )
}

export default UserScreen

const styles = StyleSheet.create({
    userInfo: {
        flex: 0.35
    },
    tabNav: {
        flex: 0.75
    }
})
