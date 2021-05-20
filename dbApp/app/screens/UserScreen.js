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
import {AuthContext} from '../context/AuthContext'
import callApi from '../hooks/callApi'
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem} from '@react-navigation/drawer';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Drawer = createDrawerNavigator();

const CustomDrawerComponent = (props) => {
    const {signOut} = React.useContext(AuthContext)
    //creates a custom draweritemlist with all the components that are in the original list (passed with ...props) and adds drawerItem
    return(
        <DrawerContentScrollView{...props}>
            <DrawerItemList {...props} />
            <DrawerItem label="Log out" onPress={() => signOut()} />
        </DrawerContentScrollView>
    )
}

const UserScreen = ({route, navigation}) => {

    const {userName, signIn} = React.useContext(AuthContext);

    const [currUser, setCurrUser] = React.useState();

    React.useEffect( () => {
       async function getUser(){ 
                const userToGet = route.params?.userName ?? userName;
                const response = await callApi(`/user/getInfo/${userToGet}`);
                if(response)
                {
                    const user = response.user;
                    setCurrUser(user);
                }
            }
            const unsubscribe = navigation.addListener('focus', () => {
                getUser();
              });
              return unsubscribe;
            
        },[navigation]
    );

    return (
        !currUser ? <ActivityIndicator/> : 
        <Drawer.Navigator drawerPosition='right' drawerType='front' drawerContent={props => <CustomDrawerComponent {...props}/>}>
            <Drawer.Screen name="UserDrawer"
            options={{
                drawerLabel: () => null,
                title: null,
                drawerIcon: () => null
            }}>
                {(props) => (
                    <>
                    <View style={styles.userInfo}>
                        <UserInfoCard user={currUser}/>
                    </View>
                    <View style={styles.tabNav}>
                        <UserTabNav user={currUser}/>
                    </View>
                    <MaterialCommunityIcons  style={styles.burgerMenu} name={"menu"} size={35} color={theme.colors.secondary}
                    onPress={() => {props.navigation.toggleDrawer()}}/>
                </>)}
                </Drawer.Screen>
        </Drawer.Navigator>
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
    },
    burgerMenu: {
        position:'absolute',
        zIndex: 100,
        top: 40,
        right: 20,
        bottom: 0
    }
})
