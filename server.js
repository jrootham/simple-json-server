/**
 *
 * server.js
 *
 * Created by jrootham on 01/08/14.
 *
 * Copyright © 2014 Jim Rootham
 */

(function(){
    "use strict";

    var sendHeaders = function(request, response, code, headers) {
        var sendHeaders = {
            'Content-Type': 'application/json'
        };

        Object.keys(headers).forEach(function(key) {
            sendHeaders[key] = headers[key]
        });

        response.writeHead(code, sendHeaders);
    };

    var success = function(request, response, resultObject, headers) {
        sendHeaders(request, response, 200, headers);
        resultObject.success = true;
        response.end(JSON.stringify(resultObject));
    };

    var fail = function(request, response, error, headers) {
        sendHeaders(request, response, 200, headers);
        error.success = false;
        response.end(JSON.stringify(error));
    };

    var sendHTML = function (response, html) {

    };

    var server = function(depends) {
        depends.http.createServer(function (request, response) {
            depends.success = success;
            depends.fail = fail;
            depends.sendHTML = sendHTML

            var method = request.method.toUpperCase();
            if (method === 'POST' || method === 'PUT' || method === 'PATCH') {
                var form = new formidable.IncomingForm();

                form.parse(request, function(error, data) {
                    if (error) {
                        fail(response, {error: "form parse failed" + error.description});
                    }

                    router(depends, request, response, data);
                });
            }
            else {
                router(depends, request, response, {});
            }
        }).listen(depends.port, depends.server);

        console.log('Server running at ' + depends.server + ':' + depends.port);
    };

    exports.server = server;
})();
