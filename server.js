import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

app.post('/chat', async (req,res) =>{
    const question = req.body.question;
    console.log(question);
    
    try{
        const response = await fetch('https://api.openai.com/v1/chat/completions',{});
    }catch(error){

    }
    
    // if(question){
    //     res.json({question: `Käyttäjä kysyi ${question}`});
    // }else{
    //     res.status(400).json({error:'Kysymys puuttui.'})
    // }
});

app.listen(port,()=>{
    console.log(`Server running at http://localhost:${port}`);
});