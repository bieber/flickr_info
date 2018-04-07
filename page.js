(function() {
	var code = null;

	var matches = /https:\/\/www.flickr.com\/photos\/.*\/(\d+).*/.exec(
		window.location.href
	);
	if (matches === null) {
		statusDisplay.src = chrome.extension.getURL('icon_19_white_x.png');
		return;
	}
	var id = matches[1];

	chrome.runtime.onMessage.addListener(
		function(message, sender, sendResponse) {
			if (message.fetch !== 'code') {
				return;
			}
			sendResponse({code: code});
		}
	);

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
				var owner = data.photo.owner.path_alias || data.photo.owner.nsid;
				var title = data.photo.title._content
					? '"'+data.photo.title._content.replace(/\"/g, '\\"')+'"'
					: '';

				code = [
					farm,
					server,
					id,
					secret,
					owner,
					title
				].join(' ');

				chrome.runtime.sendMessage({code: code});
			}
		);
})();
