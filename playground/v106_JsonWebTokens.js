const jwt =require('jsonwebtoken')

/*
Suppose user logs in then we want to maintain it's session. If it is a authentic user then only
he should be allowed to create task or view task that he has created.
For this purpose we give a token to a user to maintain all his operations.
 */
const myFunction = async()=>{

    /*
    Now id is the parameter on basis of which we are giving token. Suppose user logged in with id:abc123
    then it will get a unique token.
    Every token is generated based on certain key. Now 'thisisthekey is the value based on which we are
    generating token to user having id:abc123. We can specify any key.

    ExpiresIn is the duration after which token will expire.
     */

    const token = jwt.sign({_id:'abc123'},'thisisthekey',{expiresIn:'1d'})
    console.log(token)

    /*
    This will again decrypt token back. We are decrypting token we have just created and we need to pass
    same key that we used while creating token.
     */
    const data = jwt.verify(token,'thisisthekey')

    console.log(data)
}

myFunction()