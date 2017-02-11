(function() {
	var engagementViews = document.getElementsByClassName(
		'photo-engagement-view'
	);
	if (engagementViews.length !== 1) {
		return;
	}
	var engagementView = engagementViews[0];

	var statusDisplay = document.createElement('img');
	statusDisplay.src = chrome.extension.getURL('icon_19_white_hourglass.png');
	var statusLink = document.createElement('a');
	statusLink.appendChild(statusDisplay);
	var statusDiv = document.createElement('div');
	statusDiv.appendChild(statusLink);
	engagementView.style.width = '260px';
	engagementView.appendChild(statusDiv);
	engagementView.addEventListener(
		'DOMNodeInserted',
		function() {
			engagementView.appendChild(statusDiv);
		}
	);

	var matches = /https:\/\/www.flickr.com\/photos\/.*\/(\d+).*/.exec(
		window.location.href
	);
	if (matches === null) {
		statusDisplay.src = chrome.extension.getURL('icon_19_white_x.png');
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
				var owner = data.photo.owner.path_alias || data.photo.owner.nsid;
				var title = data.photo.title._content
					? '"'+data.photo.title._content.replace(/\"/g, '\\"')+'"'
					: '';

				var textP = document.createElement('p');
				textP.textContent = [
					farm,
					server,
					id,
					secret,
					owner,
					title
				].join(' ');

				var dialog = document.createElement('dialog');
				dialog.appendChild(textP);

				var closeButton = document.createElement('button');
				closeButton.textContent = 'Close';
				closeButton.addEventListener('click', () => dialog.close());
				dialog.appendChild(closeButton);

				document.body.appendChild(dialog);

				statusDisplay.src = chrome.extension.getURL('icon_19_white.png');
				statusLink.addEventListener('click', () => dialog.showModal());
			}
		).catch(
			function() {
				statusDisplay.src = chrome.extension.getURL(
					'icon_19_white_x.png'
				);
			}
		);
})();
