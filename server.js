<<<<<<< HEAD
var express = require("express");
var proxy = require("express-http-proxy");
=======
var proxy = require('http-proxy');
var express = require('express');
var https = require('https');
var url = require('url');
var path = require('path');

var api = require('./api.js');
var blocked = require('./static/blocked.json');
var reBlocked = require('./static/re_blocked.json');

var port = process.env.PORT || 80;
var subdomainsAsPath = true;
var serveHomepage = true;
var serveHomepageOnAllSubdomains = true;

var httpsProxy = proxy.createProxyServer({
  agent: new https.Agent({
    checkServerIdentity: function (host, cert) {
      return undefined;
    }
  }),
  changeOrigin: true
});

var httpProxy = proxy.createProxyServer({
  changeOrigin: true
});

function stripSub (link) {
  var original = url.parse(link);
  var sub = '';
  var path = original.path;
  if (subdomainsAsPath) {
    var split = path.split('/');
    sub = split[1] && split[1] + '.';
    split.splice(1, 1);
    path = split.join('/');
  }
  return [path || '/', sub];
}

function getSubdomain (req, rewrite) {
  var sub;
  if (subdomainsAsPath) {
    var res = stripSub(req.url);
    if (rewrite) {
      req.url = res[0];
    }
    sub = res[1];
  } else {
    var domain = req.headers.host;
    sub = domain.slice(0, domain.lastIndexOf('.', domain.lastIndexOf('.') - 1) + 1);
  }
  return sub;
}

function onProxyError (err, req, res) {
  console.error(err);

  res.writeHead(500, {
    'Content-Type': 'text/plain'
  });

  res.end('Proxying failed.');
}

function onProxyReq (proxyReq, req, res, options) {
  proxyReq.setHeader('User-Agent', 'Mozilla');
  proxyReq.removeHeader('roblox-id');
}

httpsProxy.on('error', onProxyError);
httpsProxy.on('proxyReq', onProxyReq);
httpProxy.on('error', onProxyError);
httpProxy.on('proxyReq', onProxyReq);

>>>>>>> fde9ad1ad53dad15d026f243ee4fcf5096a75687
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