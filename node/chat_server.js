var ws = require("nodejs-websocket");
var userArr = [];

var server = ws.createServer(function(conn) {
	
	conn.on("text", function(data) {
		var dataObj = JSON.parse(data);
		if(dataObj.type == "join") {
			var i = 2;
			conn.nickName = dataObj.name;
			while(userArr.indexOf(conn.nickName) != -1) {
				conn.nickName = dataObj.name + "(" + i + ")" ;
				i++;
			}
			userArr.push(conn.nickName);
		
			sendToAll({
				type: "status",
				message: conn.nickName	
			});
		} else if(dataObj.type == "message") {
			sendToAll({
				type: "message",
				name: conn.nickName,
				message: dataObj.message,
				clients: userArr
			})	
		}
	});
		
	conn.on("close", function() {
		if(conn.nickName !== "") {
			sendToAll({
				type: "logOut",
				message: conn.nickName
			})
			userArr.splice(userArr.indexOf(conn.nickName), 1);
		}	
	});
		
}).listen(8000, "localhost", function() {
	console.log("server activated");
});

function sendToAll(data) {
	var msg = JSON.stringify(data);
	
	server.connections.forEach(function(conn){
		conn.sendText(msg);	
	})	
}