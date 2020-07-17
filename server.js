var express = require("express");
var proxy = require("express-http-proxy");
var app = express();

app.use("/roblox", proxy("https://www.roblox.com", {
	forwardPath: function(req, res) {
		return require("url").parse(req.url).path;
	}
}));

app.use("/robloxapi", proxy("https://api.roblox.com", {
	forwardPath: function(req, res) {
		return require("url").parse(req.url).path;
	}
}));
app.use("/group", proxy("https://groups.roblox.com", {
	forwardPath: function(req, res) {
		return require("url").parse(req.url).path;
	}
}));

var port = process.env.port || 80;
app.listen(port);