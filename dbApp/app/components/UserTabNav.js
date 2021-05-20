import React from 'react'
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs'
import FeedList from './FeedList'
import { theme } from '../core/theme'
import {user} from '../dataHelpers/user'
import {feed} from '../dataHelpers/feed'
import {comments} from '../dataHelpers/comments'
import {AuthContext} from '../context/AuthContext'
import callApi from '../hooks/callApi'
import { useNavigation } from '@react-navigation/core'

const Posts = (props) => {
    
    return React.useMemo(
        () => {
        return (<FeedList feed={props.user.posts}/>)
        }, [props.user]
        )
}

const Comments = (props) => {

    const navigation = useNavigation();
    const [comments, setComments] = React.useState([]);
    React.useEffect(
        () => {
            const getComments = async () => {
                const response = await callApi(`/user/getUserComments/${props.user.userName}`);
                setComments(response.comments);

            };
            const unsubscribe = navigation.addListener('focus', () => {
                getComments();
              });
              return unsubscribe;
        }, [navigation]
    )

    return React.useMemo(
        () => {
            return (<FeedList feed={comments}/>)
        }, [comments]
        )
    }

const Likes = (props) => {

    const [likes, setLikes] = React.useState([]);
    const navigation = useNavigation();
    React.useEffect(
        () => {
            const getLikes = async () => {
                const response = await callApi(`/user/getUserLikes/${props.user._id}`);
                setLikes(response.likes);

            };
            const unsubscribe = navigation.addListener('focus', () => {
                getLikes();
              });
              return unsubscribe;
        }, [navigation]
    )

    return React.useMemo(
        () => {
            return (<FeedList feed={likes}/>)
        }, [likes]
        )
    }

const UserTabNav = (props) => {
        const TabNav = createMaterialTopTabNavigator();

        return(
            <TabNav.Navigator>
                <TabNav.Screen name="Posts">
                    {() => {return <Posts user={props.user}/>}}
                    </TabNav.Screen>
                <TabNav.Screen name="Comments">
                {() => {return <Comments user={props.user}/>}}
                    </TabNav.Screen>
                <TabNav.Screen name="Liked">
                {() => {return <Likes user={props.user}/>}}
                    </TabNav.Screen>
            </TabNav.Navigator>
        )
}

export default UserTabNav