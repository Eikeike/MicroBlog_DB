import { useNavigation } from '@react-navigation/core'
import React from 'react'
import { StyleSheet, Text, View, Dimensions, TextInput } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Avatar} from 'react-native-paper'
import callApi from '../hooks/callApi'
import { theme } from '../core/theme'
import SwitchButton from './SwitchButton'

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
    const [editMode, setEditMode] = React.useState(false);
    const [editableName, setEditableName] = React.useState(props.user.name);
    const [editableBio, setEditableBio] = React.useState(props.user.bioText);
    const [following, setFollowing] = React.useState(props.user.isFollowed);
    React.useEffect(
        () => {
            setUser(props.user);
        }, [props]
    );

    const navigation = useNavigation();

    const toggleFollow = async () => {
        let success = false;
        if (following)
        {
            success = await callApi(`/user/unfollow/${user._id}`)
        }
        else{
            const success = await callApi(`/user/follow/${user._id}`)
        }
        setFollowing(!following);
    };

    const edit = async () => {
        if(editMode) //if pressed and in edit mode, edit
        {
            const editData = {
                name: editableName,
                bio: editableBio
            }
            callApi('/user/edit', editData);
        }
        setEditMode(!editMode)
    }

    return (
        <View style={styles.container}>
            <View style={styles.headerImg}/>
                <View style={styles.topRowContainer}>
                    <View style={styles.pictureContainer}>
                        <Avatar.Icon size={72} icon="account" style={styles.userPicture} color={'#000'} />
                    </View>
                    <View style={styles.buttonContainer}>
                        {user.isRequestingUser ? (
                        <SwitchButton switchVar={editMode}
                        onPress={edit}
                        >{editMode ? "Done" : "Edit"}</SwitchButton>) : 

                        (<SwitchButton switchVar={following}
                        onPress={toggleFollow}
                        >{following ? "Unfollow" : "Follow"}</SwitchButton>)}

                    </View>
                </View>
                <View>
                    {editMode ? (<>
                    <Text style={{color: theme.colors.secondary}}>New Username:</Text>
                    <View style={{borderWidth: 0.5, borderColor: theme.colors.secondary, borderRadius: 5}}>
                        <TextInput style={styles.name}
                        value={editableName}
                        onChangeText={(text) => {setEditableName(text)}}/>
                    </View>
                    </>) : 
                    (<Text style={styles.name}>{editableName}</Text>)}
                    <Text style={styles.userName}>{`@${user.userName}`}</Text>
                    {editMode ? (
                        <>
                    <Text style={{color: theme.colors.secondary}}>New Bio:</Text>
                    <View style={{borderWidth: 0.5, borderColor: theme.colors.secondary, borderRadius: 5}}>
                        <TextInput multiline={true} style={styles.bioText}
                            value={editableBio}
                            onChangeText={(text) => {setEditableBio(text)}}/>
                    </View>
                    </>) :
                    (<Text style={styles.bioText}>{editableBio}</Text>)}
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
