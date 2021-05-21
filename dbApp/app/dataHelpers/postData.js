let data = {
    _id: '1',
    author:{
        name: "Eike",
        userName: "eikewobken",
        avatarURL: "../assets/accountPic.png", //materialDesign avatar
    },
    likeCount: 10,
    likedBy: [],
    repostCount: 6,
    comments: [
        'CommentID_01', 'CommentID_02', 'CommentID03'
    ],
    isLiked: false,
    isReposted: true,
    postText: "Hello World.",
    postType: ["comment"], //can be post, comment or repost,
    originalPost: null
    
};
export {data};