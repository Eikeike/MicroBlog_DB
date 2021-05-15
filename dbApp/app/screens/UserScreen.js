import React from 'react'
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs'
import { Avatar, Button } from 'react-native-paper'
import UserInfoCard from '../components/UserInfoCard'
import FeedList from '../components/FeedList'
import { theme } from '../core/theme'
import {comments} from '../dataHelpers/comments'
import { TabBarIndicator } from 'react-native-tab-view'
import UserTabNav from '../components/UserTabNav'
import AuthContext from '../context/AuthContext'
import callApi from '../hooks/callApi'


const UserScreen = ({route, navigation}) => {

    const {userName, signIn} = React.useContext(AuthContext);

    const [currUser, setCurrUser] = React.useState();
    const [userPosts, setUserPosts] = React.useState([]);
    const [userLikes, setUserLikes] = React.useState([]);
    const [userComments, setUserComments] = React.useState([]);
    React.useEffect( () => {
       async function getUser(){ 
                const userToGet = route.params?.userName ?? userName;
                const response = await callApi(`/user/getInfo/${userToGet}`);
                const user = response.user;
                const feed = response.user.posts;
                setCurrUser(user);
                setUserPosts(feed);
                setUserLikes(feed);
                setUserComments(comments);
            }
            const unsubscribe = navigation.addListener('focus', () => {
                getUser();
              });
              return unsubscribe;
            
        },[navigation]
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
        paddingBottom: 10,
        backgroundColor: theme.colors.background
    },
    tabNav: {
        flex: 1
    }
})
