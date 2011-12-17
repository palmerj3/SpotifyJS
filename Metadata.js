/* Spotify Namespace */
var Spotify = {};

/* Spotify Metadata API Interface */
Spotify.Metadata = function () {
	'use strict';
	var oMetadata = {},
		API_VERSION = '1',
		API_BASE_URL = 'http://ws.spotify.com/',
		API_OUTPUT_FORMAT = '.json',
		SEARCH_BASE_URI = 'search',
		LOOKUP_BASE_URI = 'lookup',
		SEARCH_DEFAULTS = {			/* DEFAULT PARAMATERS FOR METADATA SEARCH */
			method: 'track',		/* album, artist, track */
			q: ''					/* query */
		},
		LOOKUP_DEFAULTS = {
			params: {}
		};

	/*
		Private Methods 
	*/

	/* Returns proper interface to XMLHttpRequest for AJAX calls */
	function init_ajax() {
		var xmlhttp = false;

		//Test for IE
		try {
			xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
		} catch (x) {
			try {
				xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
			} catch (y) {
				xmlhttp = false;
			}
		}

		//Chrome/WebKit
		if (xmlhttp === false && typeof XMLHttpRequest !== 'undefined') {
			try {
				xmlhttp = new XMLHttpRequest();
			} catch (z) {
				xmlhttp = false;
			}
		}

		return xmlhttp;
	}

	/* Merges object2 with object1 */
	function merge_obj(obj1, obj2) {
		var obj3 = {},
			attr;

		for (attr in obj1 ) {
			if (obj1.hasOwnProperty(attr)) {
				obj3[attr] = obj1[attr];
			}
		}
		for (attr in obj2 ) {
			if (obj2.hasOwnProperty(attr)) {
				obj3[attr] = obj2[attr];
			}
		}

		return obj3;
	}

	/* Returns proper query string based on key/value pairs */
	function build_query_string(obj) {
		var q = '?',
			propertyName;

		for (propertyName in obj) {
			if (obj.hasOwnProperty(propertyName)) { /* Safety, FTW */
				q += propertyName + '=' + obj[propertyName] + '&';
			}
		}

		//Pop off last & character
		return q.substring(0, q.length - 1);
	}

	function query(url, method, success_callback, error_callback) {
		var xmlhttp = init_ajax();

		//Default optional params
		if (typeof method === 'undefined') {
			method = 'GET';
		}
		if (typeof success_callback === 'undefined') {
			success_callback = function () {};
		}
		if (typeof error_callback === 'undefined') {
			error_callback = function () {};
		}

		xmlhttp.open(method, url, true);
		xmlhttp.onreadystatechange = function () {
			if (xmlhttp.readyState === 4) {	// request finished and response is ready
				if (xmlhttp.status === 200) {
					success_callback(xmlhttp.responseText);
				} else {
					error_callback(xmlhttp.responseText, xmlhttp.status);
				}
			}
		};

		xmlhttp.send(null);
	}

	/* Execute Search, Call Callback */
	oMetadata.search = function (opt, callback) {
		//Verify params
		if ((typeof opt === 'string' || typeof opt === 'object') && typeof callback === 'function') {
			var obj = (typeof opt === 'string' ? { q : opt } : opt),
				search_obj = merge_obj(SEARCH_DEFAULTS, obj),
				remote_uri = API_BASE_URL +
									SEARCH_BASE_URI + '/' +
									API_VERSION + '/' +
									search_obj.method +
									API_OUTPUT_FORMAT;

			remote_uri += build_query_string({ q : search_obj.q });

			query(remote_uri, "GET", callback);

			return true;
		} else {
			//Invalid params
			return false;
		}
	};

	/* Execute Lookup, Call Callback */
	oMetadata.lookup = function (opt, callback) {
		//Verify params
		if (typeof opt === 'object' && typeof callback === 'function') {
			var lookup_obj = merge_obj(LOOKUP_DEFAULTS, opt),
				remote_uri = API_BASE_URL +
										LOOKUP_BASE_URI + '/' +
										API_VERSION + '/' +
										API_OUTPUT_FORMAT;

			lookup_obj.params.uri = 'spotify:' + lookup_obj.target + ':' + lookup_obj.id;

			remote_uri += build_query_string(lookup_obj.params);

			query(remote_uri, "GET", callback);

			return true;
		} else {
			//Invalid params
			return false;
		}
	};

	return oMetadata;	//return public interface
};