var setForm = document.getElementById('set_api_key');
var setInput = document.getElementById('api_key_input');
var clearDiv = document.getElementById('clear_api_key');
var clearForm = document.getElementById('clear_api_key_form');
var displaySpan = document.getElementById('display');

syncStorageGet('api_key')
	.then(showClearForm)
	.catch(showSetForm);

clearForm.addEventListener(
	'submit',
	function() {
		syncStorageRemove('api_key').then(showSetForm);
	}
);

setForm.addEventListener(
	'submit',
	function() {
		syncStorageSet('api_key', setInput.value)
			.then(showClearForm.bind(null, setInput.value));
	}
);

function showSetForm() {
	setForm.style.display = '';
	clearDiv.style.display = 'none';
}

function showClearForm(apiKey) {
	display.textContent = apiKey;
	setForm.style.display = 'none';
	clearDiv.style.display = '';
}
