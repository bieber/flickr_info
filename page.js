(function() {
	var engagementViews = document.getElementsByClassName(
		'photo-engagement-view'
	);
	if (engagementViews.length !== 1) {
		return;
	}
	var engagementView = engagementViews[0];

	var matches = /https:\/\/www.flickr.com\/photos\/.*\/(\d+)\/.*/.exec(
		window.location.href
	);
	if (matches.length !== 2) {
		return;
	}
	var id = matches[1];

	syncStorageGet('api_key')
		.then(
			function(key) {
				var uri = 'https://api.flickr.com/services/rest/'
					+ '?method=flickr.photos.getInfo'
					+ '&api_key='
					+ key
					+ '&photo_id='
					+ id
					+ '&format=json&nojsoncallback=1';
				var request = new Request(uri);
				return fetch(request);
			}
		).then(response => response.json())
		.then(
			function(data) {
				var farm = data.photo.farm;
				var server = data.photo.server;
				var secret = data.photo.secret;
				console.log(farm, server, secret);
			}
		);
})();
