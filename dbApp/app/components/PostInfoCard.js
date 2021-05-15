import { StyleSheet, Text, View, Dimensions, KeyboardAvoidingView } from 'react-native'
import React from 'react'
import {Divider, Avatar} from 'react-native-paper'
import {theme} from '../core/theme'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Post from '../components/Post'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { user } from '../dataHelpers/user'

const PostInfoCard = (props) =>
{
    console.log(props.post.author);
    const {_id, author, likeCount, repostCount, comments, isLiked, isReposted, postText, originalPost} = props.post;
    const [answer, setAnswer] = React.useState('');
    const [liked, setLiked] = React.useState(isLiked);
    const [reposted, setReposted] = React.useState(isReposted);

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
        let likedBy = likedBy;
        likedBy.push(user);
        navigation.navigate("UsersDisplay", {title: "Liked by", users: likedBy});
    }
    console.log(props.post);
    //This is shown on top of the list with the comments
        return(
            <>
            {originalPost && (
            <>
                <Post post={originalPost}/>
                <Divider/>
            </>
            )}
            <View style={styles.ownPost}>
            {originalPost && (<Text style={styles.reply}>{`reply to @${originalPost.author.userName}`}</Text>)}
            <View style={styles.userInfo}>
                <View style={styles.avatarContainer}>
                    <TouchableOpacity
                    onPress={() => {navigation.navigate("UserInfo", {userName: author.userName})}}>
                        <Avatar.Image size={60} style={styles.avatar} source={require('../assets/accountPic.png')}/>
                    </TouchableOpacity>
                </View>
                <View style={styles.names}>
                    <TouchableOpacity 
                    onPress={() => {navigation.navigate("UserInfo", {userName: author.userName})}}>
                        <Text style={{fontWeight: 'bold'}}>{author.name}</Text>
                        <Text>{`@${author.userName}`}</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.post}>
                <Text style={styles.postText}>{postText}</Text>
            </View>

            <Divider/>

            <View style={styles.likesContainer}>
                <Text style={styles.number}>{repostCount.toString()}</Text>
                <Text style={{fontWeight: '200'}}>Reposts</Text>
                <TouchableOpacity onPress={getLikes} style={{flexDirection: 'row'}}>
                    <Text style={[styles.number, {paddingLeft: 10}]}>{likeCount.toString()}</Text>
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

const styles = StyleSheet.create({
    reply: {
        paddingLeft: (Dimensions.get('window').width) * 0.21,
        color: theme.colors.secondary
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

export default PostInfoCard;
