/* ---------------------------------------------------------------------------
WAIT! - This file depends on instructions from the PUBNUB Cloud.
http://www.pubnub.com/account
--------------------------------------------------------------------------- */

/* ---------------------------------------------------------------------------
PubNub Real-time Cloud-Hosted Push API and Push Notification Client Frameworks
Copyright (c) 2011 TopMambo Inc.
http://www.pubnub.com/
http://www.pubnub.com/terms
--------------------------------------------------------------------------- */

/* ---------------------------------------------------------------------------
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
--------------------------------------------------------------------------- */
/**
 * UTIL LOCALS
 */
var NOW                 = 1
,   http                = require('http')
,   https               = require('https')
,   XHRTME              = 310000
,   DEF_TIMEOUT         = 10000
,   SECOND              = 1000
,   PNSDK               = 'PubNub-JS-' + PLATFORM + '/' +  VERSION
,   crypto              = require('crypto')
,   proxy               = null
,   XORIGN              = 1
,   keepAliveConfig     = {
    keepAlive: true,
    keepAliveMsecs: 300000,
    maxSockets: 5
}
,   keepAliveAgent
,   keepAliveAgentSSL;

if (keepAliveIsEmbedded()) {
    keepAliveAgent = new http.Agent(keepAliveConfig);
    keepAliveAgentSSL = new https.Agent(keepAliveConfig);
} else {
    (function () {
        var agent = require('agentkeepalive'),
            agentSSL = agent.HttpsAgent;

        keepAliveAgent = new agent(keepAliveConfig);
        keepAliveAgentSSL = new agentSSL(keepAliveConfig);
    })();
}

function get_hmac_SHA256(data, key) {
    return crypto.createHmac('sha256',
                    new Buffer(key, 'utf8')).update(data).digest('base64');
}


/**
 * ERROR
 * ===
 * error('message');
 */
function error(message) { console['error'](message) }

/**
 * Request
 * =======
 *  xdr({
 *     url     : ['http://www.blah.com/url'],
 *     success : function(response) {},
 *     fail    : function() {}
 *  });
 */
function xdr( setup ) {
    var request
    ,   response
    ,   success  = setup.success || function(){}
    ,   fail     = setup.fail    || function(){}
    ,   ssl      = setup.ssl
    ,   failed   = 0
    ,   complete = 0
    ,   loaded   = 0
    ,   mode     = setup['mode'] || 'GET'
    ,   data     = setup['data'] || {}
    ,   xhrtme   = setup.timeout || DEF_TIMEOUT
    ,   body = ''
    ,   finished = function() {
            if (loaded) return;
                loaded = 1;

            clearTimeout(timer);
            try       { response = JSON['parse'](body); }
            catch (r) { return done(1); }
            success(response);
        }
    ,   done    = function(failed, response) {
            if (complete) return;
                complete = 1;

            clearTimeout(timer);

            if (request) {
                request.on('error', function(){});
                request.on('data', function(){});
                request.on('end', function(){});
                request.abort && request.abort();
                request = null;
            }
            failed && fail(response);
        }
        ,   timer  = timeout( function(){done(1);} , xhrtme );

    data['pnsdk'] = PNSDK;

    var options = {};
    var payload = '';

    if (mode == 'POST')
        payload = decodeURIComponent(setup.url.pop());

    var url = build_url( setup.url, data );

    if (!ssl) ssl = (url.split('://')[0] == 'https');

    url = '/' + url.split('/').slice(3).join('/');

    var origin       = setup.url[0].split("//")[1];

    options.hostname = proxy ? proxy.hostname : setup.url[0].split("//")[1];
    options.port     = proxy ? proxy.port : ssl ? 443 : 80;
    options.path     = proxy ? "http://" + origin + url : url;
    options.headers  = proxy ? { 'Host': origin } : null;
    options.method   = mode;
    options.keepAlive= !!keepAliveAgent;
    options.body     = payload;

    if (options.keepAlive && ssl) {
        options.agent = keepAliveAgentSSL;
    } else if (options.keepAlive) {
        options.agent = keepAliveAgent;
    }

    require('http').globalAgent.maxSockets = Infinity;

    try {
        request = (ssl ? https : http)['request'](options, function(response) {
            response.setEncoding('utf8');
            response.on( 'error', function(){done(1, body || { "error" : "Network Connection Error"})});
            response.on( 'abort', function(){done(1, body || { "error" : "Network Connection Error"})});
            response.on( 'data', function (chunk) {
                if (chunk) body += chunk;
            } );
            response.on( 'end', function(){
                var statusCode = response.statusCode;

                switch(statusCode) {
                    case 200:
                        break;
                    default:
                        try {
                            response = JSON['parse'](body);
                            done(1,response);
                        }
                        catch (r) { return done(1, {status : statusCode, payload : null, message : body}); }
                        return;
                }
                finished();
            });
        });
        request.timeout = xhrtme;
        request.on( 'error', function() {
            done( 1, {"error":"Network Connection Error"} );
        } );

        if (mode == 'POST') request.write(payload);
        request.end();

    } catch(e) {
        done(0);
        return xdr(setup);
    }

    return done;
}

/**
 * LOCAL STORAGE
 */
var db = (function(){
    var store = {};
    return {
        'get' : function(key) {
            return store[key];
        },
        'set' : function( key, value ) {
            store[key] = value;
        }
    };
})();

function crypto_obj() {
    var iv = "0123456789012345";

    var allowedKeyEncodings = ['hex', 'utf8', 'base64', 'binary'];
    var allowedKeyLengths = [128, 256];
    var allowedModes = ['ecb', 'cbc'];

    var defaultOptions = {
        encryptKey: true,
        keyEncoding: 'utf8',
        keyLength: 256,
        mode: 'cbc'
    };

    function parse_options(options) {

        // Defaults
        options = options || {};
        if (!options.hasOwnProperty('encryptKey')) options.encryptKey = defaultOptions.encryptKey;
        if (!options.hasOwnProperty('keyEncoding')) options.keyEncoding = defaultOptions.keyEncoding;
        if (!options.hasOwnProperty('keyLength')) options.keyLength = defaultOptions.keyLength;
        if (!options.hasOwnProperty('mode')) options.mode = defaultOptions.mode;

        // Validation
        if (allowedKeyEncodings.indexOf(options.keyEncoding.toLowerCase()) == -1) options.keyEncoding = defaultOptions.keyEncoding;
        if (allowedKeyLengths.indexOf(parseInt(options.keyLength, 10)) == -1) options.keyLength = defaultOptions.keyLength;
        if (allowedModes.indexOf(options.mode.toLowerCase()) == -1) options.mode = defaultOptions.mode;

        return options;

    }

    function decode_key(key, options) {
        if (options.keyEncoding == 'base64' || options.keyEncoding == 'hex') {
            return new Buffer(key, options.keyEncoding);
        } else {
            return key;
        }
    }

    function get_padded_key(key, options) {
        key = decode_key(key, options);
        if (options.encryptKey) {
            return crypto.createHash('sha256').update(key).digest("hex").slice(0,32);
        } else {
            return key;
        }
    }

    function get_algorythm(options) {
        return 'aes-' + options.keyLength + '-' + options.mode;
    }

    function get_iv(options) {
        return (options.mode == 'cbc') ? iv : '';
    }

    return {
        'encrypt' : function(input, key, options) {
            if (!key) return input;
            options = parse_options(options);
            var plain_text = JSON['stringify'](input);
            var cipher = crypto.createCipheriv(get_algorythm(options), get_padded_key(key, options), get_iv(options));
            var base_64_encrypted = cipher.update(plain_text, 'utf8', 'base64') + cipher.final('base64');
            return base_64_encrypted || input;
        },
        'decrypt' : function(input, key, options) {
            if (!key) return input;
            options = parse_options(options);
            var decipher = crypto.createDecipheriv(get_algorythm(options), get_padded_key(key, options), get_iv(options));
            try {
                var decrypted = decipher.update(input, 'base64', 'utf8') + decipher.final('utf8');
            } catch (e) {
                return null;
            }
            return JSON.parse(decrypted);
        }
    }
}

function keepAliveIsEmbedded() {
    return 'EventEmitter' in http.Agent.super_;
}


var CREATE_PUBNUB = function(setup) {
    proxy = setup['proxy'];
    setup['xdr'] = xdr;
    setup['db'] = db;
    setup['error'] = setup['error'] || error;
    setup['hmac_SHA256'] = get_hmac_SHA256;
    setup['crypto_obj'] = crypto_obj();
    setup['params'] = {'pnsdk' : PNSDK};

    if (setup['keepAlive'] === false) {
      keepAliveAgent = undefined;
    }

    var SELF = function(setup) {
        return CREATE_PUBNUB(setup);
    };

    var PN = PN_API(setup);

    for (var prop in PN) {
        if (PN.hasOwnProperty(prop)) {
            SELF[prop] = PN[prop];
        }
    }

    SELF.init = SELF;
    SELF.secure = SELF;
    SELF.crypto_obj = crypto_obj();
    SELF.ready();

    return SELF;
};

CREATE_PUBNUB.init = CREATE_PUBNUB;
CREATE_PUBNUB.unique = unique;
CREATE_PUBNUB.secure = CREATE_PUBNUB;
CREATE_PUBNUB.crypto_obj = crypto_obj();
module.exports = CREATE_PUBNUB;
module.exports.PNmessage = PNmessage;
