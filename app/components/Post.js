import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity} from 'react-native'
import { Avatar } from 'react-native-paper'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { theme } from '../core/theme';

const Post = (props) => {
    const {name, userName, avatarURL, likeCount, repostCount, comments, isLiked, isReposted, postText, type, originalPost} = props.post; 
    const [displayedLikes, setLikes] = React.useState(likeCount);
    const [liked, setLiked] = React.useState(isLiked);
    const [displayedReposts, setReposts] = React.useState(repostCount);
    const [reposted, setReposted] = React.useState(isReposted);

    const toggleLike = () => {
        if(liked){
            setLikes(displayedLikes - 1);
        }else{
            setLikes(displayedLikes + 1);
        }
        setLiked(!liked);
    }

    const toggleRepost = () => {
        if(reposted){
            setReposts(displayedReposts - 1);
        }else{
            setReposts(displayedReposts + 1);
        }
        setReposted(!reposted);
    }

    const toggleComment = () => {
        //open new Screen tweet. Coming soon, i promise
        console.log("You are trying to write a comment")
    }

    return (
        <View style={styles.container}>
                <View style={styles.avatarContainer}>
                    <Avatar.Image size={60} style={styles.avatar} source={require('../assets/accountPic.png')}/>
                </View>
                <View style={styles.rightFromAvatar}>
                    <View style={styles.userAndPost}>
                        {type.includes("repost") && (<Text style={styles.topRowText}>Repost by xxx</Text>)}
                        <View style={styles.userNameContainer}>
                            <Text style={styles.name} numberOfLines={1}>{name}</Text>
                            <Text style={styles.userName}>{userName}</Text>
                        </View>
                        {type.includes("comment") && (<Text style={styles.topRowText}>Answer to ydfxx</Text>)}
                        <Text style={styles.text}>{postText}</Text>
                    </View>
                        <View style={styles.bottomRow}>
                            <TouchableOpacity style={styles.iconWithText} onPress={toggleComment}>
                                <MaterialCommunityIcons name={"comment"} size={20} color={theme.colors.secondary}/>
                                <Text style={styles.number}>{comments.length}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.iconWithText} onPress={toggleRepost}>
                                <MaterialCommunityIcons name={"repeat"} size={20} color={reposted ? theme.colors.repost : theme.colors.secondary}/>
                                <Text style={styles.number}>{displayedReposts}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.iconWithText} onPress={toggleLike}>
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
