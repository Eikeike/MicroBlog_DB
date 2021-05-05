import {user} from './user'

let keys = [...Array(10).keys()];

const users = keys.map((key) => { //This is just for testing purposes. Normally, you'd send a request to the server
let newUser = {...user};
newUser.userName = user.userName + key.toString();
return newUser;
})

export {users};