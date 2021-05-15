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
import PostInfoCard from '../components/PostInfoCard'
import callApi from '../hooks/callApi'

//TODO: top component auslagern

const PostDetails = ({route, navigation}) => {
    const post = route.params.postClicked;
    
    const [answer, setAnswer] = React.useState('');
    const [liked, setLiked] = React.useState(post.isLiked);
    const [reposted, setReposted] = React.useState(post.isReposted);
    const [comments, setComments] = React.useState([]);

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

    React.useEffect( () => {
        async function getComments(){ 
                 const response = await callApi(`/posts/getComments`, {comments: route.params.postClicked.comments });
                 console.log(response.comments);
                 setComments(response.comments);
             }
             const unsubscribe = navigation.addListener('focus', () => {
                 getComments();
               });
               return unsubscribe;
             
         },[navigation]
     );
 


    return (
        <>
        <KeyboardAvoidingView style={{flex:1}}>
            <View style={{flex: 0.92, backgroundColor: theme.colors.background}}>
                <FeedList feed={comments} ListHeaderComponent={() => <PostInfoCard post={post}/>}></FeedList>
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
