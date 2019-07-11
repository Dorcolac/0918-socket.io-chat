var socket;
var usernameColor = "white";
var output = document.getElementById('output');
var message = document.getElementById('message');
var username = prompt('Please pick your username');


if (username && username !== '' && username.length <= 15) {
    socket = io.connect('http://localhost:3000');
    // CHANGE TO INTERNAL IP ADRESS (IPV4)
    // TO BE ABLE TO COMMUNICATE ON LOCAL NETWORK
    
    socket.emit('userJoined', username);
    message.focus;
    
    socket.on('newUser', function(data) {
        output.innerHTML += '<p class="newUserMessage">' + data + ' has joined the chat.</p>';
    })
    
    function keyboardSend(event) {
        
        if (event.key == "Enter") {
            if (message.value.indexOf('/') === 0) {
                
                var spaceIndex = message.value.indexOf(' ');
                if (spaceIndex !== -1) {
                    var command = message.value.substring(1, spaceIndex);
                    
                    var parameter = message.value.substring(spaceIndex + 1, message.value.length);
                    
                    if (command == 'color') {
                        usernameColor = parameter;
                    }
                    message.value = '';
                    message.focus;
                }
            } else {
                sendMessage();
            }
        } else {
            socket.emit('typing', username);
        }
    }
    
    function sendMessage() {
        socket.emit('globalMessage', {user: username, msg: message.value, color: usernameColor});
        message.value = '';
        message.focus;
    }
    
    socket.on('userText', function(data) {
        output.innerHTML += '<p class="message"><strong style="color:' + data.color + '">' + data.user + '</strong>: ' + data.msg + '</p>';
        var chat = document.getElementById('chat-window');
        if (chat.scrollTop > chat.scrollHeight - chat.clientHeight - 400) {
            chat.scrollTop = chat.scrollHeight;
        } else {
            console.log('imagine a button');
        }
    })

    socket.on('writing', function(data) {
        var allTyping = document.querySelectorAll('#typing .people-typing span');
        var isCurrentlyTyping = false;
        for (let i = 0; i < allTyping.length; i++) {            
            if (allTyping[i].innerHTML === data) {
                isCurrentlyTyping = true;
            }
        }
        if (isCurrentlyTyping === false) {
            var ele = document.createElement('span');
            var text = document.createTextNode(data);
            ele.appendChild(text);
            document.querySelector('#typing .people-typing').appendChild(ele);
            setTimeout(() => {
                document.querySelector('#typing .people-typing').innerHTML = "";
            }, 3000);
        }
    })
} else {
    output.innerHTML = '<p class="error">Please refresh and enter appropriate username.</p>'
}