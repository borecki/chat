(function() {
	new WOW().init();
	
	var chat = {
		generateRow: function(responseMessage) {
			var chatRow = document.createElement("div"),
			date = new Date(),
			hours,
			minutes,
			seconds,
			time;
				
			if(date.getHours() <= 9) { hours = "0"+date.getHours();
			} else {
				hours = date.getHours();
			}
			if(date.getMinutes() <= 9) {
				minutes = "0"+date.getMinutes();
			} else {
				minutes = date.getMinutes();
			}
			if(date.getSeconds() <= 9) {
				seconds = "0"+date.getSeconds();
			} else {
				seconds = date.getSeconds();
			}
			
			time = hours + ":" + minutes + ":" + seconds;
			message;
					
			chatRow.classList.add("chatRow");
			
			if(responseMessage.type == "status") {
				message = "<span class='status'><strong>" + responseMessage.message + "</strong> has just joined to the chat - <strong>" + time + "</strong>.</span>";			
			} else if(responseMessage.type == "logOut") { 
				message = "<span class='status'><strong>" + responseMessage.message + "</strong> has left the chat - <strong>" + time + "</strong>.</span>";
			} else {
				message = "<div class='messageAuthor'><span class='name'>" + responseMessage.name + "</span><span class='time'>at " + time + "</span></div> <div class='triangle-right'></div><span class='message'>" + responseMessage.message + "</span>";
			}
			
			chatRow.innerHTML = message;
			chatWindow.appendChild(chatRow);
			chatWindow.scrollTop = chatWindow.scrollHeight;
		},
		sendMessage: function(){
			message = messageInput.value;
			
			if(message !=="") {
				chat.sendData({
						type: 'message',
						message: message
					});
				messageInput.value = "";
			}
		},
		sendData: function(msgObject) {
			var data = JSON.stringify(msgObject);
			socket.send(data);	
		},
		displayMessage: function(e) {
			var responseMessage = JSON.parse(e.data);
			chat.generateRow(responseMessage);	
		},
		joinToChat: function() {
			name = nameInput.value;
			if(name == "" || name.length>8 ) {
				alert('Your name can not be empty and  should contains max 8 characters.'); 
				return false;
			}
			
			socket = new WebSocket("ws://localhost:8000");
			socket.onmessage = chat.displayMessage;	
			socket.onopen = function() {
				
				logAsNick.innerHTML = name;
				chat.sendData({
					type: "join",
					name: name	
				})
				jQueryActions();
				nameInput.setAttribute("readonly", "readonly");	
				joinButton.onclick = null;
				submitButton.removeAttribute("disabled");
				submitButton.onclick = chat.sendMessage;
				logoutButton.onclick = chat.logOut;
			}
		},
		logOut: function() {	
			socket.close();
			nameInput.removeAttribute("readonly");
			nameInput.value = "";	
			joinButton.onclick =  chat.joinToChat;
			submitButton.onclick = null;
			
			while (chatWindow.firstChild) {
				chatWindow.removeChild(chatWindow.firstChild);
			}	
		},
		init: function() {
			nameInput = document.querySelector("#yourName");
			joinButton = document.querySelector("#join");
			chatWindow = document.querySelector("#chatWindow");
			messageInput = document.querySelector("#message");
			submitButton = document.querySelector("#submit");
			logoutButton = document.querySelector("#logOut");
			logAsNick = document.querySelector("#logAsValue");
			
			joinButton.onclick = chat.joinToChat;
			
			textarea = document.querySelector("textarea");
			
			textarea.onkeydown = function(e) {
				if(e.keyCode === 13) {
					e.preventDefault();
					chat.sendMessage();	
				}
			}
		}	
	}
	chat.init();
	
})();

function jQueryActions() {
	console.log("test"); 
	$("#home").fadeOut(450);
	$("#chat").delay(450).fadeIn();
}

$("#logOut").click(function() {
	$("#chat").fadeOut(300); 
	$("#home").delay(300).fadeIn();
});