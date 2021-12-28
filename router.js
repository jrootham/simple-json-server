/**
 * router.js
 *
 * Created by jrootham on 10/02/15.
 *
 * Copyright © 2014 Jim Rootham
 */


(function () {
    "use strict"
    require('find').setFind();                   // Amends Array prototype

    var makeTestMatch = function (tablePointer) {
        return function (theKey) {
            var result = false;

            var match = tablePointer[theKey].match;
            if (match) {
                result = (current.length <= match.maxLength);
                if (result) {
                    result = (new RegExp(match.pattern)).test(current);
                }
            }

            return result;
        }
    }

    var findTablePointer = function(tablePointer, current, pathArgs) {
        var found = tablePointer[current];
        if (!found) {
            var key = Object.keys(tablePointer).find(makeTestMatch(tablePointer));

            if (key) {
                pathArgs[key] = current;
                found = tablePointer[key].next;
            }
            else {
                found = null;
            }
        }

        return found;
    };

    var router = function(depends, request, response, data) {
        var tablePointer = depends.routeTable;
        if (!tablePointer) depends.fail( response, {error: "No routing table"}, {});

        var pathURL = url.parse(request.url, true);        // gets pathname and query object

        var pathList = pathURL.pathname.split('/');

//        if (pathList.length === 0) depends.fail( response, {error: "Empty routing input"}, {})

        while (pathList.length > 0 && pathList[0] === "") {
            pathList.shift();
        }

        var found = tablePointer;
        var searched = "";
        var pathArgs = {};

        while (pathList.length > 0 && tablePointer) {
            var current = pathList.shift();
            searched += "/" + current;
            found = findTablePointer(tablePointer, current, pathArgs);

            if (!found) break;

            tablePointer = found;
        }

        if (found && found[request.method]) {
            found[request.method](depends, request, response, pathArgs, pathURL.query, data);
        }
        else {
            depends.mount(request, response)            // serve a static file
        }
    };

    exports.router = router;
})()