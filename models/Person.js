const mongoose = require('mongoose')

mongoose.set('strictQuery', false)
const url = process.env.MONGODB_URI
console.log('connection to', url)
console.log(typeof url);

mongoose.connect(url)
    .then(result => {
        console.log('connected to MongoDB');
    })
    .catch( error =>{
        console.log('error connecting to MongoDB:', error.message);
    })



const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
    },
    number:{
        type:String,
        validate:{
            validator: function(number){
                return /^\d{2,3}-\d+$/.test(number)
            },
            message: props =>`${props.value} is not a valid phone number`
        }
    }
})
personSchema.set('toJSON',{
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
      }
    })

    module.exports = mongoose.model('Person', personSchema)
