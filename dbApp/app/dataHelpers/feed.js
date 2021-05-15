import {data} from './postData'

let keys = [...Array(10).keys()];

const feed = keys.map((key) => { //This is just for testing purposes. Normally, you'd send a request to the server
let post = {...data};
post._id = key.toString();
post.author.name += key.toString();
return post;
})

export {feed};