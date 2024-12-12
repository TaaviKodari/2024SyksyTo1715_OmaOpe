import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import multer from 'multer';
import vision from '@google-cloud/vision';

dotenv.config();

const app = express();
const port = 3000;

const upload = multer({dest:'uploads/'})

app.use(bodyParser.json());
app.use(express.static('public'));

const client = new vision.ImageAnnotatorClient({keyFilename:'omaope-vision.json'});

let koealueTekstina = '';
let contex = [];
let currentQuestion = '';
let correctAnswer = '';

app.post('/upload-Images',upload.array('images',10), async(req,res)=>{
    const files = req.files;
    if(!files || files.length === 0){
        return res.status(400).json({error:'No files uploaded.'});
    }

    try{
        const texts = await Promise.all(files.map(async file =>{
            const imagePath = file.path;
            const [result] = await client.textDetection(imagePath);
            const detections = result.textAnnotations;
            return detections.length > 0 ? detections[0].description : '';
        }));
        koealueTekstina = texts.join('');
        console.log('ocr combined text: ', koealueTekstina);
        contex = [{role:'user', content: koealueTekstina}];
        const response = await fetch('https://api.openai.com/v1/chat/completions',{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
                'Authorization':`Bearer ${process.env.OPENAI_API_KEY}`
            },
            body:JSON.stringify({
                model:'gpt-4o-mini',
                messages:contex.concat([
                    {role:'user',content: 'Luo yksinkertainen ja selkeä koetehtävä ja sen vastaus ylläolevasta tekstistä suomeksi. Kysy vain yksiasia kerrallaan.'}
                ]),
                max_tokens: 150
            })
        });
        const data = await response.json();
        console.log(data.choices[0].message.content.trim());
        const responseText = data.choices[0].message.content.trim();
        const [question, answer] = responseText.includes('Vastaus') 
        ? responseText.split('Vastaus') : [responseText,null];
        
        if(!question || !answer){
            return res.status(400).json({error:'Model could not generate a valid question.'});
        }

        currentQuestion = question.trim();
        correctAnswer = answer.trim();

        contex.push({role:'assistant', content:`Kysymys: ${currentQuestion}`});
        contex.push({role:'assistant', content:`Vastaus: ${correctAnswer}`});

        res.json({question: currentQuestion, answer:correctAnswer});
    }catch(error){
        console.log(error);
    }

    //console.log(files);
});

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