import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import UsersList from '../components/UsersList'
import { theme } from '../core/theme'
import { Appbar, } from 'react-native-paper';

const UserListScreen = ({route, navigation}) => {

    React.useLayoutEffect(() => {
        navigation.setOptions({
          title: route.params.title || "User List",
        });
      }, [route, navigation]);

    return (  
        <UsersList users={route.params.users || []} />
    )
}

export default UserListScreen

const styles = StyleSheet.create({
    appBar: {
        backgroundColor: theme.colors.background
    }
})
