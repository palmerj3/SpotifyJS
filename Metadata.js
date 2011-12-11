/* Spotify Metadata API Interface */
Spotify.Metadata = function(){	
	var oMetadata = {};		//public interface
	
	/* 
		Private variables 
	*/
	var _API_VERSION = '1';
	var _API_BASE_URL = 'http://ws.spotify.com/';
	var _API_OUTPUT_FORMAT = '.json';
	var _SEARCH_BASE_URI = 'search';
	var _LOOKUP_BASE_URI = 'lookup';
	
	var _SEARCH_DEFAULTS = {	/* DEFAULT PARAMATERS FOR METADATA SEARCH */
		method: 'track',		/* album, artist, track */
		q: ''					/* query */
	};
	
	var _LOOKUP_DEFAULTS = {
		params: {}
	};
	
	/*
	 	Private Methods 
	*/
	
	/* Returns proper interface to XMLHttpRequest for AJAX calls */
	function init_ajax(){
		var xmlhttp = false;
		
		//Test for IE
		try {
			xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
		} catch (e) {
			try {
					xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
				} catch (E) {
					xmlhttp = false;
				}
			}
		}
		
		//Chrome/WebKit
		if (!xmlhttp && typeof XMLHttpRequest!='undefined') {
			try {
				xmlhttp = new XMLHttpRequest();
			} catch (e) {
				xmlhttp=false;
			}
		}
		
		return xmlhttp;
	}
	
	/* Merges object2 with object1 */
	function merge_obj(obj1, obj2) {	
		var obj3 = {};
			
		for( var attr in obj1 ) {
				obj3[attr] = obj1[attr];
		}
		for( var attr in obj2 ) {
				obj3[attr] = obj2[attr];
		}
		
		return obj3;
	}
	
	/* Returns proper query string based on key/value pairs */
	function build_query_string(obj){
		var q='?';
		for(var propertyName in obj) {
			if(obj.hasOwnProperty(propertyName)) { /* Safety, FTW */
				q+=propertyName+'='+obj[propertyName]+'&';
			}
		}
				
		//Pop off last & character
		return q.substring(0,q.length-1);
	}
	
	function query(url, method, success_callback, error_callback) {
		var xmlhttp = init_ajax();
		
		//Default optional params
		if(typeof method === 'undefined') {
			method = 'GET';
		}
		if(typeof success_callback === 'undefined') {
			success_callback = function(){};
		}
		if(typeof error_callback === 'undefined') {
			error_callback = function(){};
		}
		
		console.log("Remote URI: "+url+ " ... METHOD: "+method);
		
		xmlhttp.open(method, url, true);
		xmlhttp.onreadystatechange=function(){
			if(xmlhttp.readyState === 4){	// request finished and response is ready
				if(xmlhttp.status === 200) {
					success_callback(xmlhttp.responseText);
				} else {
					error_callback(xmlhttp.responseText, xmlhttp.status);
				}
			}
		}
		
		xmlhttp.send(null);
	}
	
	/* Execute Search, Call Callback */
	oMetadata.search = function(opt, callback) {
		//Verify params
		if((typeof opt === 'string' || typeof opt === 'object') && typeof callback === 'function') {
			var obj = opt;

			// Simple search - create search object to perform query on passed in string
			if(typeof opt === 'string') {
				//Simple search - apply as q parameter
				obj = {
					q : opt
				};
			}
			
			// Create search object
			var search_obj = merge_obj(_SEARCH_DEFAULTS, obj);

			// Build URI for search
			// http://ws.spotify.com/1/track.json?q=skrillex
			var remote_uri = _API_BASE_URL+
									_SEARCH_BASE_URI+'/'+
									_API_VERSION+'/'+
									search_obj.method+
									_API_OUTPUT_FORMAT+
									build_query_string({
										q : search_obj.q
									});
							
			// Query Remote URI and attach response to callback
			query(remote_uri, "GET", callback);
			
			return true;
		} else {
			//Invalid params
			return false;
		}
	};
	
	/* Execute Lookup, Call Callback */
	oMetadata.lookup = function(opt, callback) {
		//Verify params
		if(typeof opt === 'object' && typeof callback === 'function') {
			var lookup_obj = merge_obj(_LOOKUP_DEFAULTS, opt);
			
			//Attach query string to params
			lookup_obj.params.uri = 'spotify:'+lookup_obj.target+':'+lookup_obj.id;
			
			// Build URI for lookup
			// http://ws.spotify.com/lookup/1/.json?uri=spotify:artist:4YrKBkKSVeqDamzBPWVnSJ
			var remote_uri = _API_BASE_URL+
									_LOOKUP_BASE_URI+'/'+
									_API_VERSION+'/'+
									_API_OUTPUT_FORMAT+
									build_query_string(lookup_obj.params);
							
			// Query Remote URI and attach response to callback
			query(remote_uri, "GET", callback);
			
			return true;
		} else {
			//Invalid params
			return false;
		}
	};
	
	return oMetadata;	//return public interface
};