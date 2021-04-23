import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import React, {useState} from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Feed from '../screens/Feed'
import { theme } from '../core/theme'


const Posts = () =>{
    return (
        <View>
            <Text>Posts</Text>
        </View>
    )
}
const Search = () =>{
    return (
        <View>
            <Text>Search</Text>
        </View>
    )
}
const UserDetail = () =>{
    return (
        <View>
            <Text>UserDetail</Text>
        </View>
    )
}
const TabNavigator = () => {

    const Tab = createMaterialBottomTabNavigator();


    return (
        <Tab.Navigator
        initialRouteName="Posts"
        activeColor={theme.colors.primary}
        barStyle={{backgroundColor: theme.colors.background,
                    borderTopWidth: 0.1,
                    borderTopColor: theme.colors.secondary,
                position: 'relative'}}
        
    >
        <Tab.Screen
        name="Home"
        component={Feed}
        options={{
            tabBarLabel: 'Home',
            tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="home" color={color} size={26} />
          ),
        }}
        />
        <Tab.Screen
        name="Search"
        component={Search}
        options={{
            tabBarLabel: 'Search',
            tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="magnify" color={color} size={26} />
          ),
        
        }}
        />
        <Tab.Screen
        name="User"
        component={UserDetail}
        options={{
            tabBarLabel: 'Search',
            tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="account" color={color} size={26} />
          ),
        }}
        />
        </Tab.Navigator>
    );
}

export default TabNavigator

const styles = StyleSheet.create({})
