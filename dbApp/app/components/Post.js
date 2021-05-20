import { useNavigation } from '@react-navigation/core';
import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity} from 'react-native'
import { Avatar } from 'react-native-paper'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { theme } from '../core/theme';
import callApi from '../hooks/callApi';
import {toggleComment, useLike, useRepost} from '../hooks/interactions';

const Post = (props) => {
    const {_id, author, likeCount, repostCount, comments, isLiked, isReposted, postText, originalPost, repostingUser} = props.post;
    let {postType}  = props.post; //so i can change it later. Don't want it to be const for legacy reasons

    const [liked, displayedLikes, like] = useLike(likeCount, isLiked);
    const [reposted, displayedReposts, repost] = useRepost(repostCount, isReposted);

    const navigation = useNavigation();

    //For legacy reasons. Some older posts contain the "type" property instead of the postType property
    if(!postType)
    {
        postType = ["post"];
    }

    return (
        <View style={styles.container}>
                <TouchableOpacity style={styles.avatarContainer} onPress={
                        () => {navigation.navigate("UserInfo", {userName: author.userName})}
                    }>
                    <Avatar.Image size={60} style={styles.avatar} source={require('../assets/accountPic.png')}/>
                </TouchableOpacity>
                <View style={styles.rightFromAvatar}>
                    <View style={styles.userAndPost}>
                        {postType.includes("repost") && (<Text style={styles.topRowText}>{`${repostingUser || ''} reposted: `}</Text>)}
                        <TouchableOpacity style={styles.userNameContainer} onPress={
                            () => {
                                navigation.navigate("UserInfo", {userName: author.userName})}
                            }>
                            <Text style={styles.name} numberOfLines={1}>{author.name}</Text>
                            <Text style={styles.userName}>{`@${author.userName}`}</Text>
                        </TouchableOpacity>
                        {postType.includes("comment") && (<Text style={styles.topRowText}>{`Answer to ${originalPost?.author?.name}`}</Text>)}
                        <Text style={styles.text}>{postText}</Text>
                    </View>
                        <View style={styles.bottomRow}>
                            <TouchableOpacity style={styles.iconWithText} onPress={() => toggleComment(props.post, navigation)}>
                                <MaterialCommunityIcons name={"comment"} size={20} color={theme.colors.secondary}/>
                                <Text style={styles.number}>{comments.length}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.iconWithText} onPress={() => repost(_id)}>
                                <MaterialCommunityIcons name={"repeat"} size={20} color={reposted ? theme.colors.repost : theme.colors.secondary}/>
                                <Text style={styles.number}>{displayedReposts}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.iconWithText} onPress={() => like(_id)}>
                                <MaterialCommunityIcons name={"heart-outline"} size={20} color={liked ? theme.colors.like : theme.colors.secondary}/>
                                <Text style={styles.number}>{displayedLikes}</Text>
                            </TouchableOpacity>
                        </View>            
                </View>
        </View>
    )
}

export default Post

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
    topRowText:{
        fontSize: 14,
        fontWeight: '100'
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
        flex: 0.75
    },
    userAndPost:{
        flexDirection: 'column'
    },
    userNameContainer:{
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center'
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
    },
    text:{
        paddingTop: 5,
        color: theme.colors.text,
        fontSize: 17
    },
    iconWithText:{
        flexDirection: 'row',
        justifyContent: 'center'
    },
    bottomRow:{
        flexDirection: 'row',
        paddingTop: 15,
        paddingBottom: 5,
        justifyContent: 'space-between',
        width: '85%',
    },
    number: {
        paddingLeft: 2
    }
})
