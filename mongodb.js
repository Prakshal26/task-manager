// //CRUD OPERATIONS. Create Read Update Delete
//
// //We have installed npm i mongodb to connect to mongodb drivers.
// const mongodb = require('mongodb')
//
// const MongoClient = mongodb.MongoClient
//
// const ObjectID = mongodb.ObjectID
//
// /*
// Id in Mondgodb. The id generated in Mysql was 1,2,3 etc. It was specific to a table and has
// auto increment feature i,e 1 then 2 then 3 like this. But in MongoDb the id generated is globally unique.
// It prevents the conflict globally. It is 12 byte id looking like : 5f129be19067be07f8a4d58f.
// 4 Bytes: number of seconds passed since January 1970.
// 5 Bytes: Random Value.
// 3 Byte: Counter Starting with a random value.
//  */
// //Id is generated automatically, but still we can generate id like this and print it.
// // const id = new ObjectID()
// // console.log(id)
// // console.log(id.getTimestamp()) // To get time stamp from the id.
//
//
// /*
// How i have installed mongo db and proceeded.
//
// Step 1: Download MongoDB installer. (311 MB zip file present in download-spring folder.
// Step 2: Unzip it and put it anywhere. I have placed it in /Users/praksjai/mongodb.
// Step 3: Create new folder in same directory to store the databases we will create. Name it as mongodb-data.
// Step 4: Open the root of project in cmd and run the DB. BY giving below command:
//         /Users/praksjai/mongodb/bin/mongod.exe --dbpath=/Users/praksjai/mongodb-data
//
//         By default MongoDB will start on port 22017.
//
// Step 5: Install and GUI based Client to view the DB. I am using Robo 3T.
//         Open it create a new connection. Give ip as localhost or 127.0.0.1 and port as 27017.
//
// Step 6:  Follow this file to create the connection.
//  */
//
// //This is the URL where our mongodb is running. By defualt  mongodb runs on localhost port 27017
//
// const connectionURL = 'mongodb://127.0.0.1:27017'
//
// //This is the new database name that we want to create.
// const databaseName = 'task-manager'
//
// /*
// Making the connection with the DB. ConnectionURL we have specified above i.e where we want to create connection.
// After connection this callback method will be called, with two param error and clint.
//  */
//
// MongoClient.connect(connectionURL, {useNewUrlParser:true},(error,client)=>{
//
//     if(error) {
//         return console.log('Unable to connect to DB')
//     }
//
//     //Connection was created successfully now create the DB with name databaseName.
//     const db =client.db(databaseName)
//
//     /*
//     Mongodb in NoSQL based. Here we have document instead of tables. So creating a document(table) with name
//     users and having two fields name and age.
//     id will be automatically created by mongo.
//      */
//     // db.collection('users').insertOne({
//     //     name: 'Prakshal',
//     //     age: 27
//     // }, (error, result)=>{ //Check if data is inserted correctly or not.
//     //     if(error) {
//     //         return console.log('Unable to Insert User')
//     //     }
//     //     console.log(result.ops) //It will print all the data that we have inserted.
//     // })
//
//     //To insert multiple record at once.
//     // db.collection('users').insertMany([
//     //     {
//     //         name:'Jen',
//     //         age:28
//     //     }, {
//     //         name:'Gunther',
//     //         age: 27
//     //     }
//     // ], (error,result)=>{
//     //
//     //     if(error) {
//     //         return console.log('Unable to Insert Documents')
//     //     }
//     //     console.log(result.ops)
//     // })
//
//     // db.collection('tasks').insertMany([
//     //     {
//     //         description: 'Clean The house',
//     //         completed: true
//     //     }, {
//     //         description: 'Renew Inspection',
//     //         completed: false
//     //     }, {
//     //         description: 'Pot Plants',
//     //         completed: false
//     //     }
//     // ], (error,result)=>{
//     //
//     //     if(error) {
//     //         return console.log('Unable to insert tasks')
//     //     }
//     //
//     //     console.log(result.ops)
//     // })
//
//
//     // db.collection('users').insertOne({
//     //
//     //     _id:id, //If we want to store id manually we can use this.
//     //     name: 'Vikram',
//     //     age: 24
//     // }, (error, result)=>{ //Check if data is inserted correctly or not.
//     //     if(error) {
//     //         return console.log('Unable to Insert User')
//     //     }
//     //     console.log(result.ops) //It will print all the data that we have inserted.
//     // })
//
//
//     //************************R: Read Operation**********************************************
//
//     /*
//     To find the data from users document. We need to find which is having property name and value Jen. After finding it will
//     call a callback function with error or the user is found successfully.
//      */
//     db.collection('users').findOne({name: 'Jen'},(error,user)=>{
//
//         if(error) {
//             return console.log('Unable to Fetch')
//         }
//         //If there is two users with name Jen it will always return the first one.
//         console.log(user)
//
//     })
//
//     /*
//     findOne will only find the top most element is we have multiple element with name Jen. to find multiple use find(). As
//     it can return multiple value so use toArray().
//      */
//     db.collection('users').find({age:27}).toArray((error,users)=>{
//         console.log(users)
//     })
//     //Print number of records in users table with age =27.
//     db.collection('users').find({age:27}).count((error,count)=>{
//         console.log(count)
//     })
//
// //**************U: Update*************************************************************
//
//     /*
//     We are taking one object id and and changing the name stored at that object id in users document.
//      */
//     const updatePromiese= db.collection('users').updateOne({_id: new ObjectID("5f12922f0e05cf4b34d2cae8")},
//         {
//             $set: {
//                 name: 'Mike'
//             }
//         })
// //updateOne function has inbuild promise capbility. If Automatically it returns resolve or reject based on if data is updated or not.
// // To learn promises check playground v79
//     updatePromiese.then((result)=>{
//         console.log(result)
//     }).catch((error)=>{
//         console.log(error)
//     })
//
//
//     /*
//     Some Different Operators availabe for update. Above we have used #set: it will fetch and change the value.
//
//     $inc: {  //It will increment the age already stored by 1.
//         age: 1
//     }
//      */
//
//     db.collection('tasks').updateMany({
//         completed: false
//     },{
//         $set: {
//             completed: true
//         }
//     }).then((result)=>{
//         console.log(result.modifiedCount)
//     }).catch((error)=>{
//         console.log(error)
//     })
//
//
// //*********************D: Delete**********************************************************
//
//     db.collection('users').deleteMany({
//         age:27
//     }).then((result)=>{
//         console.log(result)
//     }).catch((error)=>{
//         console.log(eror)
//     })
//
//     db.collection('tasks').deleteOne({
//         description: 'Clean the house'
//     }).then((result)=>{
//         console.log(result)
//     }).catch((error)=>{
//         console.log(error)
//     })
//
// })