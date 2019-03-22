const express = require("express");
const session = require("express-session");
const passport = require("passport");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const port = 8200;

const Tail = require("tail").Tail;

const config = require("./config.js");

app.use(session({
	secret: config.SESSION_SECRET,
	resave: false,
	saveUninitialized: false
}));
app.use(express.static("public"));
app.use(passport.initialize());
app.use(passport.session());

server.listen(port, () => {
	console.log("Server listening at port %d", port);
});

let clients = {};

let tokenToOptions = {};

//console.log(util.inspect(clientDB, false, null));

function Client(socket) {
	this.socket = socket;
	this.id = socket.id;
	this.ip = this.socket.handshake.headers["x-real-ip"];
	this.port = this.socket.handshake.headers["x-real-port"];
	return this;
}

io.set("transports", [
	"polling",
	"websocket",
	"xhr-polling",
	"jsonp-polling"
]);

io.on("connection", (socket) => {

	clients[socket.id] = new Client(socket);
	console.log("#clients: " + Object.keys(clients).length);

	socket.on("disconnect", () => {
		// console.log("disconnected");
		delete clients[socket.id];
		console.log("#clients: " + Object.keys(clients).length);
	});

	socket.on("createReadReceipt", (data) => {
		let token = crypto.randomBytes(64).toString("hex");
		let src = "emailreadreceipts.com/" + token + ".png";
		socket.emit("readReceipt", src);
		// tokenToOptions[token] = socket.id;
		tokenToOptions[token] = {email: data.email, count: 0};
	});

	/* ROOMS @@@@@@@@@@@@@@@@@@@@@@@@ */

	socket.on("leave", (room) => {
		socket.leave(room);
	});

	socket.on("join", (room) => {
		let client = clients[socket.id];
		socket.join(room);
	});

});


// mail:
let transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: "emailreadreceipts@gmail.com",
		pass: "QWERTY1234!@",
	},
});

let mailOptions = {
	from: "emailreadreceipts@gmail.com",
	to: null,
	subject: "Your email was read!",
	text: "Your email was read!",
};

// transporter.sendMail(mailOptions, (error, info) => {
// 	// if (error) {
// 	// 	console.log(error);
// 	// } else {
// 	// 	console.log("Email sent: " + info.response);
// 	// }
// });



let tail = new Tail("/srv/www/emailreadreceipts.com/logs/access.log");

tail.on("line", (data) => {

	// console.log(data);

	// let testString = "GET /images/myUniqueHex.png";
	let regex = /\/([A-z0-9]{128})\.png/g;
	let res = regex.exec(data);
	if (res == null) {
		return;
	}
	let token = res[1];
	if (token == null) {
		return;
	}
	// console.log("token: " + token);
	// let socketid = tokenToOptions[token];
	// // console.log("sid: " + socketid);
	// // console.log(tokenToOptions);
	// if (socketid == null) {
	// 	return;
	// }
	// io.to(socketid).emit("messageRead");

	let options = tokenToOptions[token];

	if (options == null) {
		return;
	}

	if (options.count < 1) {
		options.count += 1;
		return;
	}

	if (options.count > 2) {
		return;
	}

	mailOptions.to = options.email;

	transporter.sendMail(mailOptions, (error, info) => {
		// if (error) {
		// 	console.log(error);
		// } else {
		// 	console.log("Email sent: " + info.response);
		// }
	});

});

// process.on("exit", (code) => {
// 	console.log("about to exit");
// 	// tail.unwatch();
// });
//
// process.on("SIGINT", () => {
//     console.log("about to exit");
// 	// tail.unwatch();
// 	process.exit();
// });
