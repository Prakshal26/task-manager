
// //Working with npm brcrypt module to encrypt the password.
// const bcrypt = require('bcrypt')
//
// const myFunction = async() =>{
//     const password ='Red1234'
//     const hashedPassword = await bcrypt.hash(password,8)
//
//     console.log(password)
//     console.log(hashedPassword)
//
//     const isMatch = await bcrypt.compare('Red1234',hashedPassword)
//     console.log(isMatch)
// }
// myFunction()