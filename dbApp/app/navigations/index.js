import { NavigationContainer } from '@react-navigation/native'
import React from 'react'
import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import TabNavigator from './TabNavigator'
import AuthNavigator from './AuthNavigator'

const AppNavContainer = () => {
    return (
        <NavigationContainer>
            <AuthNavigator/>
        </NavigationContainer>
    )
}

export default AppNavContainer

const styles = StyleSheet.create({})
