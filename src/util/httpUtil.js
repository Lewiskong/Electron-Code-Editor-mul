var PORT=3333
var process = require('child_process');

var http = require('http');
var url=require('url');
var fs=require('fs');
var mime=require('./mime').types;
var path=require('path');

class Server{
	constructor(){
		throw new Error('can not create instance')
	}

	static createServer(filePath,port){
		createBaseServer(filePath,port)
	}

	static createAutoRefreshServer(filePath,port){
		// createBaseServer(filePath,port)
		Server.exec(`cd ${filePath} && webpack-dev-server`)
		Server.open(`http://localhost:8080/index.html`)
	}


	static open(url){
		process.exec(`open ${url}`,
		  function (error, stdout, stderr) {
			if (error !== null) {
			  console.log('exec error: ' + error);
			}
		});
	}

	static exec(cmd){
		process.exec(cmd,function(err,stdout,stderr){
			if (error !== null) {
			  console.log('exec error: ' + error);
			}
		})
	}



}

function createBaseServer(filePath,port){
	if (Server.__server) return Server.__server
	const server=http.createServer((request,response)=>{
		let pathname=url.parse(request.url).pathname
		let ext=path.extname(pathname)
		ext=ext?ext.slice(1):'unknown'

		let realFilePath=path.join(filePath,pathname)
		console.log(realFilePath)
		fs.exists(realFilePath,exists=>{
			if (!exists) {
	            response.writeHead(404, {
	                'Content-Type': 'text/plain'
	            });

	            response.write("This request URL " + pathname + " was not found on this server.");
	            response.end();
	        } else {
	        	let state=fs.lstatSync(realFilePath)
	        	if (state.isDirectory()){
	        		response.writeHead(404,{
	        			'Content-Type': 'text/plain'
	        		})
	        		response.write("This request URL " + pathname + " was not found on this server.");
	            	response.end();
	            	return
	        	}
	            fs.readFile(realFilePath, function (err, file) {
	                if (err) {
	                    response.writeHead(500, {
	                        'Content-Type': 'text/plain'
	                    });
	                    response.end(err);
	                } else {
	                    var contentType = mime[ext] || "text/plain";
	                    response.writeHead(200, {
	                        'Content-Type': contentType
	                    });
	                    response.write(file, "binary");
	                    response.end();
	                }
	            });
	        }
		})
	})
	server.listen(port)
	Server.open(`http://localhost:${port}/`)
	Server.__server={
		'port':port,
		'path':filePath,
		'server':server
	}
	return Server.__server

}

Server.__server=null

module.exports=Server