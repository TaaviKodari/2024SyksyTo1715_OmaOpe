let currentQuestion = '';
let correctAnswer = '';

document.getElementById('send-button').addEventListener('click',sendMessage);
document.getElementById('send-images-button').addEventListener('click', sendImages);
document.getElementById('user-input').addEventListener('keypress',function(e){
    if(e.key === 'Enter'){
        sendMessage();
    }
});

 async function sendImages(){
    //console.log("Kuvia lähetetty");
    const imageInput = document.getElementById('image-input');
    const files = imageInput.files;
    
    if(files.length === 0){
        alert('Valitse kuvia ensin.');
        return;
    }
    
    const formData = new FormData();

    for(let i = 0; i< files.length; i++){
        formData.append('images',files[i]);
    }

    console.log(formData);

    try{
        //luodaan rajapinta kutsu
        const response = await fetch('/upload-Images',{
            method:'POST',
            body:formData
        });
        const data = await response.json();
        currentQuestion = data.question;
        correctAnswer = data.answer;
        addMessageToChatbox('OmaOpe: ' + currentQuestion,'bot-message', 'omaopebox');
    }catch(error){
        console.log('Error:',error);
    }

}

async function sendMessage(){
    //luetaan käyttäjän antama teksti ja tallennetaan muuttujaan
    const userInput = document.getElementById('user-input').value;
    //tarkistetaan, että viesti ei ole tyhjä
    if(userInput.trim() === '') return;
    console.log(userInput);
    //lisätään viesti chatboxiin
    addMessageToChatbox('Sinä: ' + userInput, 'user-message','chatbox');
 
    try{
        //Tähän tulee POST-rajapinnan pyyntö! Tästä jatketaan
      const response = await fetch('/chat',{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify({question: userInput})
        });
        const data = await response.json();
        console.log(data.reply);
        addMessageToChatbox('ChatGPT: ' + data.reply,'bot-message','chatbox');

    }catch(error){
        console.error('Error:', error);
        addMessageToChatbox('Jotain meni pieleen. Yritä uudelleen myöhemmin.', 'bot-message','chatbox');
    }

    //tyhjennetää tekstikenttä
    document.getElementById('user-input').value = '';
}

function addMessageToChatbox(message,className,box){
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', className);
    messageElement.textContent = message;
    document.getElementById(box).appendChild(messageElement);
    console.log(messageElement);
}