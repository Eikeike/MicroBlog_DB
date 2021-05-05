import { StyleSheet, Text, View, TextInput, Button, Dimensions, KeyboardAvoidingView } from 'react-native'
import React from 'react'
import {Divider, Avatar} from 'react-native-paper'
import {theme} from '../core/theme'
import {comments} from '../dataHelpers/comments'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FeedList from '../components/FeedList'
import Post from '../components/Post'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { user } from '../dataHelpers/user'

//TODO: top component auslagern

const PostDetails = ({route, navigation}) => {
    const post = route.params.postClicked;
    
    const [answer, setAnswer] = React.useState('');
    const [liked, setLiked] = React.useState(post.isLiked);
    const [reposted, setReposted] = React.useState(post.isReposted);

    const toggleComment = () => {
        console.log(answer);
        //logic yet to come
    }

    const toggleLike = () => {
        setLiked(!liked);
        //logic yet to come
    }

    const toggleRepost = () => {
        setReposted(!reposted);
        //logic yet to come
    }

    const getLikes = () => {
        let likedBy = post.likedBy;
        likedBy = [];
        likedBy.push(user);
        navigation.navigate("UsersDisplay", {title: "Liked by", users: likedBy});
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
                <TouchableOpacity onPress={getLikes} style={{flexDirection: 'row'}}>
                    <Text style={[styles.number, {paddingLeft: 10}]}>{post.likeCount.toString()}</Text>
                    <Text style={{fontWeight: '200'}}>Likes</Text>
                </TouchableOpacity>
            </View>

            <Divider/>
            <View style={styles.bottomRow}>

                <TouchableOpacity onPress={toggleComment}>
                    <MaterialCommunityIcons name={"comment"} size={20} color={theme.colors.secondary}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={toggleRepost}>
                    <MaterialCommunityIcons name={"repeat"} size={20} color={reposted ? theme.colors.repost : theme.colors.secondary}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={toggleLike}>
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
        <>
        <KeyboardAvoidingView style={{flex:1}}>
            <View style={{flex: 0.92, backgroundColor: theme.colors.background}}>
                <FeedList feed={comments} ListHeaderComponent={originalPost}></FeedList>
            </View>
            <View style={{flex:0.08}}>
                <Divider/>
                <TouchableOpacity style={styles.textIn} onPress={() => navigation.navigate("CreatePost", {originalPost: post})}>
                    <Text style={styles.answerInputText}>
                        write your answer here...
                        </Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
        </>
    )
}

export default PostDetails

const styles = StyleSheet.create({
    reply: {
        paddingLeft: (Dimensions.get('window').width) * 0.21,
        color: theme.colors.secondary
    },
    textIn:{
        width: '100%',
        height: '100%',
        zIndex: 2 ,
        backgroundColor: theme.colors.background,
        alignItems: 'flex-start',
        justifyContent: 'center'
    },
    answerInputText: {
        color: theme.colors.secondary,
        paddingLeft: 10,
        height: '100%',
        width: '100%',
        textAlignVertical: 'center'
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
