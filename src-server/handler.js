"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const require_esm = require("esm")(module);
const mongo = require('./mongo');
const util = require('util');
const ssr = require('./ssr');
const api = require_esm('./api').default;
const websocket = require_esm('./websocket').default;
const cookie = require('cookie');
const google = require('./auth/google');
let coldStart = true;
exports.index = (event = {}, context) => __awaiter(this, void 0, void 0, function* () {
    context.callbackWaitsForEmptyEventLoop = false;
    console.log('[handler.js] coldStart: ' + coldStart + ' ' + event.source);
    coldStart = false;
    // CloudWatch event (ping)
    if (event.source == 'aws.events') {
        console.log('aws ping return');
        return { statusCode: 200 };
    }
    // Logging
    /*
    console.log('[handler.js] event')
    console.dir(event)
    console.log('[handler.js] context')
    console.dir(context)
    */
    // WebSocket
    if (event.hasOwnProperty('requestContext')) {
        if (event.requestContext.eventType == 'CONNECT') {
            yield websocket(event);
            return { statusCode: 200 };
        }
        else if (event.requestContext.eventType == 'DISCONNECT') {
            return { statusCode: 200 };
        }
        else if (event.requestContext.eventType == 'MESSAGE') {
            const wsResult = yield websocket(event);
            if (event.isOffline) {
                return {
                    statusCode: 200,
                    headers: { "Content-Type": "text/html" },
                    body: JSON.stringify(wsResult)
                };
            }
            else {
                return { statusCode: 200 };
            }
        }
    }
    // HTTP
    if (event.path == '/auth/google') {
        return google.index();
    }
    else if (event.path == '/auth/google/callback') {
        return google.callback(event);
    }
    else {
        const cookies = event.hasOwnProperty('headers') && event.headers.hasOwnProperty('Cookie')
            ? cookie.parse(event.headers.Cookie) : '';
        const ssrBody = yield util.promisify(ssr)(event, cookies);
        const response = {
            statusCode: 200,
            headers: { "Content-Type": "text/html" },
            body: ssrBody
        };
        return response;
    }
});
