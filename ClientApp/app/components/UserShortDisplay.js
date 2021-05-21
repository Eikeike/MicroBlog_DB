import { useNavigation } from '@react-navigation/core';
import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity} from 'react-native'
import { Avatar } from 'react-native-paper'
import { theme } from '../core/theme';

const UserShortDisplay = (props) => {
    const {name, userName, avatarURL} = props.user;

    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <View style={styles.avatarContainer}>
                <Avatar.Image size={50} style={styles.avatar} source={require('../assets/accountPic.png')}/>
            </View>
            <View style={styles.rightFromAvatar}>
                    <Text style={styles.name} numberOfLines={1}>{name}</Text>
                    <Text style={styles.userName}>{`@${userName}`}</Text>
            </View>
        </View>
    )
}

export default UserShortDisplay

const styles = StyleSheet.create({
    container: {
        backgroundColor: theme.colors.background,
        width: '100%',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        flexDirection: 'row',
        paddingTop: 5,
        paddingBottom: 5
    },
    avatarContainer: {
        flex: 0.25,
        alignItems: 'center'
    },
    avatar: {
        backgroundColor: 'transparent',
        maxHeight: 60,
        maxWidth: 60,
        borderWidth: 0.2,
        borderRadius: 40,
    },
    rightFromAvatar: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        flex: 0.75,
        flexWrap: 'wrap',
        justifyContent: 'center'
    },
    name:{
        fontSize: 16,
        fontWeight: 'bold',
        color: theme.colors.text,
        paddingRight: 10
    },
    userName:{
        fontSize: 14,
        fontWeight: '100',
        color: theme.colors.secondary,
    }
})
