import React from 'react'
import { StyleSheet, Text, View, ScrollView, TouchableHighlight, Dimensions } from 'react-native'
import {Divider, Avatar, TextInput} from 'react-native-paper'
import {theme} from '../core/theme'
import {comments} from '../dataHelpers/comments'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FeedList from '../components/FeedList'
import Post from '../components/Post'
import { TouchableOpacity } from 'react-native-gesture-handler'

const PostDetails = ({route, navigation}) => {
    const post = route.params.postClicked;
    
    const [liked, setLiked] = React.useState(post.isLiked);
    const [reposted, setReposted] = React.useState(post.isReposted);

    const toggleLike = () => {
        setLiked(!liked);
        //logic yet to come
    }

    const toggleRepost = () => {
        setReposted(!reposted);
        //logic yet to come
    }

    React.useEffect(
        () => {
            //fetch comments. for this purpose, just use the feed as a mockup
            const comments = comments;
        }, [post.comments]
    )

    //This is shown on top of the list with the comments
    const originalPost = () => {
        return(
            <>
            {post.originalPost !== null && (
            <>
                <Post post={post.originalPost}/>
                <Divider/>
            </>
            )}
            <View style={styles.ownPost}>
            {post.originalPost !== null && (<Text style={styles.reply}>{`reply to @${post.originalPost.userName}`}</Text>)}
            <View style={styles.userInfo}>
                <View style={styles.avatarContainer}>
                    <TouchableOpacity
                    onPress={() => {navigation.navigate("UserInfo", {userName: post.userName})}}>
                        <Avatar.Image size={60} style={styles.avatar} source={require('../assets/accountPic.png')}/>
                    </TouchableOpacity>
                </View>
                <View style={styles.names}>
                    <TouchableOpacity 
                    onPress={() => {navigation.navigate("UserInfo", {userName: post.userName})}}>
                        <Text style={{fontWeight: 'bold'}}>{post.name}</Text>
                        <Text>{`@${post.userName}`}</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.post}>
                <Text style={styles.postText}>{post.postText}</Text>
            </View>

            <Divider/>

            <View style={styles.likesContainer}>
                <Text style={styles.number}>{post.repostCount.toString()}</Text>
                <Text style={{fontWeight: '200'}}>Reposts</Text>
                <Text style={[styles.number, {paddingLeft: 10}]}>{post.likeCount.toString()}</Text>
                <Text style={{fontWeight: '200'}}>Likes</Text>
            </View>

            <Divider/>
            <View style={styles.bottomRow}>
                <MaterialCommunityIcons name={"comment"} size={20} color={theme.colors.secondary}/>
                <TouchableOpacity style={styles.iconWithText} onPress={toggleRepost}>
                    <MaterialCommunityIcons name={"repeat"} size={20} color={reposted ? theme.colors.repost : theme.colors.secondary}/>
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconWithText} onPress={toggleLike}>
                    <MaterialCommunityIcons name={"heart-outline"} size={20} color={liked ? theme.colors.like : theme.colors.secondary}/>
                </TouchableOpacity>
            </View>
        </View>
        <Divider/>
            {/*extra divider: */}
            <View style={{height:10, backgroundColor: theme.colors.background}}></View>
        <Divider/>
        </>
        )
    }

    return (
        <View style={styles.comments}>
            <FeedList feed={comments} ListHeaderComponent={originalPost}></FeedList>
        </View>
        //TODO: Antworten von hier aus ermöglichen
    )
}

export default PostDetails

const styles = StyleSheet.create({
    reply: {
        paddingLeft: (Dimensions.get('window').width) * 0.21,
        color: theme.colors.secondary
    },
    ownPost:{
        flexDirection: 'column',
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 10,
        backgroundColor: theme.colors.background
    },
    userInfo:{
        flexDirection: 'row',
        flex: 0.7,
    },
    avatarContainer: {
        flex: 0.3,
        justifyContent: 'center',
        alignItems: 'flex-start'
    },
    avatar:{
        backgroundColor: 'transparent',
        borderWidth: 0.5
    },
    names:{
        flexDirection: 'column',
        justifyContent: 'center'
    },
    post: {
        alignItems: 'flex-start',
        paddingTop: 15,
        paddingBottom: 10
    },
    postText: {
        fontSize: 18
    },
    likesContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingBottom: 10,
        paddingTop: 10
    },
    number: {
        fontWeight: 'bold',
        paddingRight: 5
    },
    bottomRow:{
        flexDirection: 'row',
        paddingTop: 15,
        paddingBottom: 5,
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingBottom: 10
    }
})
