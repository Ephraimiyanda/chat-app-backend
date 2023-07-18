const uri = 'mongodb+srv://iyandaephraim:qwerty12345@cluster0.3jjosx9.mongodb.net/Social'
const mongoose = require('mongoose')
const Db = ()=>{
    mongoose.connect(uri,{
        useNewUrlParser:true,
        useUnifiedTopology:true
    })
    .then(()=>{
        console.log('mongodb connected')
    })
    .catch((err)=>{
        console.log('an error occurred',err);
    })
}

module.exports  = Db