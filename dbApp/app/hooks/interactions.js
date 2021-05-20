import { useNavigation } from '@react-navigation/core';
import React from 'react'
import callApi from './callApi'


const useLike = (likeCount, isLiked) => {
    const [displayedLikes, setLikes] = React.useState(likeCount);
    const [liked, setLiked] = React.useState(isLiked);

    const like = async(id) => {
        if(liked){
            setLikes(displayedLikes - 1);
        }else{
            setLikes(displayedLikes + 1);
        }
        await callApi(`/posts/toggleLike/${id}`)
        setLiked(!liked);
    }

    return [liked, displayedLikes, like]
}

const useRepost = (repostCount, isReposted) => {
    const [displayedReposts, setReposts] = React.useState(repostCount);
    const [reposted, setReposted] = React.useState(isReposted);

    const repost = async (id) => {
        if(reposted){
            return;
        }else{
            setReposts(displayedReposts + 1);
            await callApi(`/posts/toggleRepost/${id}`);
            setReposted(true);
        }
    }

    return [reposted, displayedReposts, repost];
}

const toggleComment = (post, navigation) => {
    navigation.navigate("CreatePost", {originalPost: post})
}

export {useLike, useRepost, toggleComment}
