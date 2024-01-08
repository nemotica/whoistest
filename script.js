function displayUrlInfo() {
    var url = document.getElementById('urlInput').value;
    var urlInfo = document.getElementById('urlInfo');

    if(url) {
        try {
            var urlObj = new URL(url);
            urlInfo.innerHTML = `<p><b>URL:</b> ${urlObj.href}</p>
                                 <p><b>Protocol:</b> ${urlObj.protocol}</p>
                                 <p><b>Host:</b> ${urlObj.host}</p>
                                 <p><b>Pathname:</b> ${urlObj.pathname}</p>`;
        } catch (e) {
            urlInfo.innerHTML = "<p>Invalid URL.</p>";
        }
    } else {
        urlInfo.innerHTML = "<p>Please enter a URL.</p>";
    }
}
