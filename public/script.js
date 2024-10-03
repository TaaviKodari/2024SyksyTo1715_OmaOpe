document.getElementById('send-button').addEventListener('click',sendMessage);
document.getElementById('user-input').addEventListener('keypress',function(e){
    if(e.key === 'Enter'){
        sendMessage();
    }
});
async function sendMessage(){
    //luetaan käyttäjän antama teksti ja tallennetaan muuttujaan
    const userInput = document.getElementById('user-input').value;
    //tarkistetaan, että viesti ei ole tyhjä
    if(userInput.trim() === '') return;
    console.log(userInput);
    //lisätään viesti chatboxiin
    addMessageToChatbox(userInput);

    //Tähän tulee POST-rajapinnan pyyntö! Tästä jatketaan
  const response = await fetch('/get-question',{
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body: JSON.stringify({question: userInput})
    });
    const data = await response.json();
    console.log(data);

    //tyhjennetää tekstikenttä
    document.getElementById('user-input').value = '';
}

function addMessageToChatbox(message){
    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    document.getElementById('chatbox').appendChild(messageElement);
    console.log(messageElement);
}