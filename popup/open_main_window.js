var url = chrome.extension.getURL('options/options.html');

var details = {
	url: url,
	focused: true,
	type: 'popup'
}
chrome.windows.create(details);