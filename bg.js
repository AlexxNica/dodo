var downloadStarted = function(download, suggest) {
	filename = download.filename;
	extension = filename.split(".").pop();
	if(extension == filename)
		extension = "";

	// get root domain of download referrer
	// https://gist.github.com/jlong/2428561 
	url = download.referrer;
	var parser = document.createElement('a');
	parser.href = url;
	urlComponents = parser.hostname.split(".");

	if(urlComponents[0] == "www")
		urlComponents.shift();

	url = urlComponents.join(".");
	
	folder = getFolder({
		"extension": extension.toLowerCase(),
		"url": url,
	});

	suggest({filename: folder + "/" + filename, overwrite: false});
}

var getFolder = function(info) {
	// check if settings have been configured	
	if(!localStorage["folders"])
		return ""

	var folders = JSON.parse(localStorage["folders"]);
	for(var i=0; i<folders.length; i++) {
		var filter = folders[i].filter;
		if(match(info, filter))
			return folders[i].folder;
	}
	return "";
}

var match = function(info, filter) {
	for(var key in info) {
		if(filter[key] && filter[key].length > 0) {
			// check if info[key] (string) is inside filter[key] (array)		
			if(filter[key].indexOf(info[key]) != -1)
				return true;
		}
	}
	return false;
}

// Open options page first time extension is installed
// http://stackoverflow.com/questions/5745822/open-a-help-page-after-chrome-extension-is-installed-first-time
function install_notice() {
    if (localStorage.getItem('install_time'))
        return;

    var now = new Date().getTime();
    localStorage.setItem('install_time', now);
    chrome.tabs.create({url: "configure/configure.html"});
}
install_notice();

chrome.downloads.onDeterminingFilename.addListener(downloadStarted);
