import React from 'react'
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs'
import FeedList from './FeedList'
import { theme } from '../core/theme'
import {user} from '../dataHelpers/user'
import {feed} from '../dataHelpers/feed'
import {comments} from '../dataHelpers/comments'

const ValueContext = React.createContext();

const Posts = () => {
    
    const props = React.useContext(ValueContext);

    return React.useMemo(
        () => {
        return (<FeedList feed={props.posts}/>)
        }, [props]
        )
}

const Comments = () => {

    const props = React.useContext(ValueContext);

    return React.useMemo(
        () => {
            return (<FeedList feed={props.comments}/>)
        }, [props]
        )
    }

const Likes = () => {

    const props = React.useContext(ValueContext);

    return React.useMemo(
        () => {
            return (<FeedList feed={props.likes}/>)
        }, [props]
        )
}

const UserTabNav = (props) => {
        const TabNav = createMaterialTopTabNavigator();

        return(
            <ValueContext.Provider value={props}>
                <TabNav.Navigator>
                    <TabNav.Screen name="Posts" component={Posts} />
                    <TabNav.Screen name="Comments" component={Comments}/>
                    <TabNav.Screen name="Liked" component={Likes}/>
                </TabNav.Navigator>
            </ValueContext.Provider>
        )
}

export default UserTabNav