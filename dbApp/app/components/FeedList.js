import React from 'react'
import { StyleSheet, SafeAreaView, FlatList, TouchableOpacity, View, Text} from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Divider} from 'react-native-paper'
import Post from './Post'
import { theme } from '../core/theme'
import { useNavigation } from '@react-navigation/core';

/**
 * Takes an array of Post objects and creates a FlatList containing those objects
 * @param {*} props Pass the feed to props.feed in order to generate a feed list. Styling props can be passed after that 
 * @returns A FlatList JSX-component with the feed that is passed as an array of posts
 */
const FeedList = (props) => {
const navigation = useNavigation();

    const renderPost = ({item}) => {
            return (
                //calls the navigateCallback function described in RootNavigator, where the List is instanciated for the RootNavigator
                <>
            <TouchableOpacity onPress={() => {navigation.push('PostDetails', {postClicked: item})}}>
                <Post post={item}></Post>
            </TouchableOpacity>
            </>
            );
            
        };
    //feed list and absolute positioning of pencil-plus
    const feed = Object.values(props.feed);

    const EmptyFeed = () => {
        return (<View><Text>Nothing to show.</Text></View>)
    }

    return(
        <>
        <SafeAreaView style={styles.safeContainer}>
            <FlatList
            data={feed}
            renderItem={renderPost}
            keyExtractor={item => {return item._id}}
            ItemSeparatorComponent={Divider}
            ListEmptyComponent={EmptyFeed}
            {...props}/>            
        </SafeAreaView>
        </>
    )
}

const styles = StyleSheet.create({
    safeContainer: {
    }
})

export default FeedList
