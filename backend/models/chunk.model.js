import mongoose from 'mongoose';

const chunkSchema = new mongoose.Schema({
    chatbotID:{type:mongoose.Schema.Types.ObjectId,ref:'bot'},
    text:{type:String,required:true},
    embedding:[{type:Number}],
    status:{type:String,required:true,enum:["Pending","Done"],default:"Pending"}
});

const Chunk = mongoose.model('chunk',chunkSchema);


export default Chunk;