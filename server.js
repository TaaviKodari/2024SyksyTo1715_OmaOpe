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
        const response = await fetch('https://api.openai.com/v1/chat/completions',{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
                'Authorization':`Bearer ${process.env.OPENAI_API_KEY}`
            },
            body:JSON.stringify({
                model:'gpt-4o-mini',
                messages:[
                    {role:'user',content: question}
                ],
                max_tokens: 150
            })
        });
        const data = await response.json();
        console.log(data.choices[0].message.content);
        const reply = data.choices[0].message.content;
        res.json({reply});
        
    }catch(error){
        console.error('Virheviesti:',error.message);
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