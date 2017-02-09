function syncStorageGet(key) {
	return new Promise(
		function(resolve, reject) {
			chrome.storage.sync.get(
				key,
				function(result) {
					if (key in result) {
						resolve(result[key]);
					} else {
						reject('Missing value');
					}
				}
			);
		}
	);
}

function syncStorageSet(key, value) {
	var delta = {};
	delta[key] = value;

	return new Promise(
		function(resolve, reject) {
			chrome.storage.sync.set(delta, resolve);
		}
	);
}

function syncStorageRemove(key) {
	return new Promise(
		function(resolve, reject) {
			chrome.storage.sync.remove(key, resolve);
		}
	);
}
