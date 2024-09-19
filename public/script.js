document.getElementById('send-button').addEventListener('click',sendMessage);
document.getElementById('user-input').addEventListener('keypress',function(e){
    if(e.key === 'Enter'){
        sendMessage();
    }
});
function sendMessage(){
    console.log('klikattu');
}