const httpProxy = require("http-proxy");

httpProxy.createProxyServer({
	target: "http://api.roblox.com"
}).listen(80);