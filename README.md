SpotifyJS -- A pure JavaScript module for accessing the Spotify Metadata API
============================================================================

## DESCRIPTION

SpotifyJS is a very lightweight interface to the Spotify Metadata API (http://developer.spotify.com/en/metadata-api/overview/).

Using this module you can easily access the "search" and "lookup" services.

All querying functions are asynchronous so you must provide callbacks.

## Examples

'''Perform a basic search'''

	var spotify_metadata = new Spotify.Metadata();
	spotify_metadata.search('skrillex', function(responseData){
		var responseData = JSON.parse(responseData);
	
		console.log("Number of results: "+data.info.num_results);
	});

* Search by artist
	var spotify_metadata = new Spotify.Metadata();
	spotify_metadata.search({method: 'artist', q: 'skrillex'}, function(responseData){
		var responseData = JSON.parse(responseData);
	
		console.log("Number of results: "+data.info.num_results);
	});

* Search by album
	var spotify_metadata = new Spotify.Metadata();
	spotify_metadata.search({method: 'album', q: 'skrillex'}, function(responseData){
		var responseData = JSON.parse(responseData);
	
		console.log("Number of results: "+data.info.num_results);
	});

* Search by track
	var spotify_metadata = new Spotify.Metadata();
	spotify_metadata.search({method: 'track', q: 'skrillex'}, function(responseData){
		var responseData = JSON.parse(responseData);
	
		console.log("Number of results: "+data.info.num_results);
	});

* Artist lookup (requires an artist_id - see previous examples response data for reference - ex: 4YrKBkKSVeqDamzBPWVnSJ)
	var spotify_metadata = new Spotify.Metadata();
	spotify_metadata.lookup({target: 'artist', id: '4YrKBkKSVeqDamzBPWVnSJ'}, function(responseData){
		var responseData = JSON.parse(responseData);
	
		console.log("Number of results: "+data.info.num_results);
	});

* Album lookup
	var spotify_metadata = new Spotify.Metadata();
	spotify_metadata.lookup({target: 'album', id: '6G9fHYDCoyEErUkHrFYfs4'}, function(responseData){
		var responseData = JSON.parse(responseData);
	
		console.log("Number of results: "+data.info.num_results);
	});

* Track lookup
	var spotify_metadata = new Spotify.Metadata();
	spotify_metadata.lookup({target: 'track', id: '6NmXV4o6bmp704aPGyTVVG'}, function(responseData){
		var responseData = JSON.parse(responseData);
	
		console.log("Number of results: "+data.info.num_results);
	});

* Gather "extras" - Spotify Metadata API allows extra information to be returned with some results.  Extra data includes album details, or track details.  Examples below:

	var spotify_metadata = new Spotify.Metadata();
	spotify_metadata.lookup({target: 'artist', id: '4YrKBkKSVeqDamzBPWVnSJ', params: {extras: 'album'}}, function(responseData){
		var responseData = JSON.parse(responseData);
	
		console.log("Number of results: "+data.info.num_results);
	});