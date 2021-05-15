import {data} from './postData'

let keys = [...Array(10).keys()];

const originalPost = {...data};
originalPost.postText = "Hello World"

const comments = keys.map((key) => { //This is just for testing purposes. Normally, you'd send a request to the server
let post = {...data};
post._id = key.toString();
post.name += key.toString();
post.postText = "I am a comment";
post.originalPost = originalPost;
post.type = ["comment"]
return post;
})

export {comments};