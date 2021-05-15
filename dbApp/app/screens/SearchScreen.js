import React from 'react'
import { StyleSheet, Text, View, Platform, TextInput, StatusBar} from 'react-native'
import UsersList from '../components/UsersList'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { Appbar, Button, Divider } from 'react-native-paper';
import {theme} from '../core/theme'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import FeedList from '../components/FeedList'
import { feed } from '../dataHelpers/feed'
import callApi from '../hooks/callApi'

const UserPostTab = createMaterialTopTabNavigator();

const TabNavigator = (props) => {
    const userList = props.userList || [];
    const feedList = feed
    return(
        <UserPostTab.Navigator>
            <UserPostTab.Screen name="UserResults">
                {() => (<UsersList users={userList}/>)}
            </UserPostTab.Screen>
            <UserPostTab.Screen name="PostResults">
            {() => (<FeedList feed={feedList}/>)}
            </UserPostTab.Screen>
        </UserPostTab.Navigator>
    )
}

const InputInHeader = (props) => {
    const [search, setSearch] = React.useState('');
    return(
    <View style={styles.headerContainer}>
        <TextInput placeholder="Search..." value={search} onChangeText={(text) => setSearch(text)} style={styles.search}/>
        <Button mode='contained' onPress={() => {props.searchFnc(search)}} color={theme.colors.primary} style={styles.button} labelStyle={{color:theme.colors.background}}>Go</Button>
    </View>
    )
}

const SearchScreen = ({route, navigation}) => {
    
    const search = async(query) => {
        const response = await callApi(`/user/search/${query}`);
        setUserList(response.users);
    }   

    const [userList, setUserList] = React.useState([]);

    return (
        <>
        <View style={styles.container}>
            <Appbar.Header style={styles.appBar}>
                <InputInHeader searchFnc={search}/>
            </Appbar.Header>
            <Divider/>
            <TabNavigator userList={userList}/>
        </View>
        </>
    )
}

export default SearchScreen

const styles = StyleSheet.create({
    appBar: {
        backgroundColor: theme.colors.background,
        marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
    },
    headerContainer: {
        flexDirection:'row',
        flex: 1, 
        height: '100%', 
        alignItems: 'center', 
        paddingHorizontal: 10
    },
    container: {
        flex: 1,
        backgroundColor: theme.colors.background
    },
    search:{
        height: '50%',
        flex: 0.7,
        borderWidth: 0.2,
        borderColor: theme.colors.secondary,
        borderRadius: 15,
        paddingLeft: 10
    },
    button: {flex: 0.3, marginLeft: 10, height: '50%', justifyContent: 'center'}

})
