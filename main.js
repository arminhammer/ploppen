/**
 * Main.js
 */

// Define the class for networked peers
function Peer(name) {

	var _name = name;
	
	return {

		// Define a sync function
		getName : function() {
			return _name;
		},

		setName : function (newName) {
			_name = newName;
		},

		//name : peerName,

		// Define a function with async internals
		slowGreet : function slowGreet() {
			setTimeout(function() {
				console.log(message);
			}, 1000);
		}

	};
}

var peer = Peer("Person1");

console.log("Here is " + peer.getName());
peer.setName("Person2");
console.log("Here is 2 " + peer.getName());
// console.log("Peer peer's name is " + peer.name);
