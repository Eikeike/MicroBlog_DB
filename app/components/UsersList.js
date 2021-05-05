import React from 'react'
import { StyleSheet, SafeAreaView, FlatList, TouchableOpacity } from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Divider} from 'react-native-paper'
import Post from './Post'
import { theme } from '../core/theme'
import { useNavigation } from '@react-navigation/core';
import UserShortDisplay from './UserShortDisplay';

/**
 * Takes an array of Post objects and creates a FlatList containing those objects
 * @param {*} props Pass the feed to props.feed in order to generate a feed list. Styling props can be passed after that 
 * @returns A FlatList JSX-component with the feed that is passed as an array of posts
 */
const UsersList = (props) => {

const navigation = useNavigation();

    const renderPost = ({item}) => {
            return (
                //calls the navigateCallback function described in RootNavigator, where the List is instanciated for the RootNavigator
                <TouchableOpacity onPress={() => {navigation.navigate("UserInfo", {user: item})}}>
                    <UserShortDisplay user={item}/>
                </TouchableOpacity>
            );
            
        };
    //feed list and absolute positioning of pencil-plus

        const users = props.users ?  Object.values(props.users) : [];

    return(
        <SafeAreaView style={styles.safeContainer}>
            <FlatList
            data={users}
            renderItem={renderPost}
            keyExtractor={item => {return item.userName}}
            ItemSeparatorComponent={Divider}
            {...props}/>            
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safeContainer: {
        backgroundColor: theme.colors.background,
        flex: 1
    }
})

export default UsersList