import { useNavigation } from '@react-navigation/core'
import React from 'react'
import { StyleSheet, Text, View, Dimensions } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Avatar, Button } from 'react-native-paper'
import { theme } from '../core/theme'

const getFollowing = (user, navigation) => {
    let following = user.following;
    navigation.navigate("UsersDisplay", {title: "Following", users: following});
}

const getFollowers = (user, navigation) => {
    let followers = user.followers;
    navigation.navigate("UsersDisplay", {title: "Followers", users: followers});
}

const UserInfoCard = (props) => {

    const [user, setUser] = React.useState({});
    React.useLayoutEffect(
        () => {
            setUser(props.user);
        }
    );

    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <View style={styles.headerImg}/>
                <View style={styles.topRowContainer}>
                    <View style={styles.pictureContainer}>
                        <Avatar.Icon size={72} icon="account" style={styles.userPicture} color={'#000'} />
                    </View>
                    <View style={styles.buttonContainer}>
                        <Button style={styles.followButton} mode='outlined'
                        labelStyle={{color: theme.colors.primary, fontSize: 14}}
                        contentStyle={{height: 30, width: 80}}
                        uppercase={false}
                        >Follow</Button>
                    </View>
                </View>
                <View>
                    <Text style={styles.name}>{user.name}</Text>
                    <Text style={styles.userName}>{`@${user.userName}`}</Text>
                    <Text style={styles.bioText}>{user.bioText}</Text>
                </View>
                <View style={styles.followers}>
                    <TouchableOpacity style={{flexDirection: 'row'}} onPress={() => {getFollowing(user,navigation)}}>
                        <Text style={{fontSize: 13, paddingRight: 5}}>Following:</Text>
                        <Text style={{fontSize: 13, paddingRight: 10, fontWeight: 'bold'}}>{user.followingCount}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{flexDirection: 'row'}} onPress={() => {getFollowers(user, navigation)}}>
                        <Text style={{fontSize: 13, paddingRight: 5}}>Followers:</Text>
                        <Text style={{fontSize: 13, fontWeight: 'bold'}}>{user.followersCount}</Text>
                    </TouchableOpacity>
                </View>
        </View>
    )
}

export default UserInfoCard

const styles = StyleSheet.create({
    container:{
        flexDirection: 'column',
        alignItems: 'flex-start',
        backgroundColor: theme.colors.background,
        paddingHorizontal: 10,

    },
    headerImg: {
        height: 120,
        width: Dimensions.get('window').width,
        backgroundColor: theme.colors.primary,
        position: 'absolute',
        right: 0

    },
    topRowContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 84,
        width: '100%'
    },
    pictureContainer:{
        flex: 0.3,
        alignItems: 'flex-start',
        height: 72,
        width: 72,
    },
    buttonContainer:{
        flex: 0.7,
        alignItems: 'flex-end',
        justifyContent: 'flex-end'
    },
    followButton: {
        marginTop: 40,
        borderRadius: 37
    },
    userPicture: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor:'#000',
    },
    name: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    userName: {
        fontSize: 14,
        color: theme.colors.secondary
    },
    bioText:{
        paddingVertical: 10,
        fontSize: 14
    },
    followers: {
        flexDirection: 'row'
    }
})
