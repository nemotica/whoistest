document.getElementById('searchButton').addEventListener('click', function() {
    const input = document.getElementById('inputField').value;
    if (!input) return;
    toggleLoading(true);
    fetchData(input); //还是用fetchData的方式
});

function toggleLoading(isLoading) {
    const loadingElement = document.getElementById('loading');
    loadingElement.style.display = isLoading ? 'block' : 'none';
}

function fetchData(input) {
    // 伪代码 - 实际上需要根据您的API调整
    fetch(`https://whois.freeaiapi.xyz/?name=${domainName}&suffix=${domainSuffix}`)
        .then(response => response.json())
        .then(data => {
            toggleLoading(false);
            if (data.status === 'OK') {
                displayData(data);
            } else {
                displayError();
            }
        })
        .catch(() => {
            toggleLoading(false);
            displayError();
        });
}

function displayData(data) {
    const resultsElement = document.getElementById('results');
    resultsElement.innerHTML = `
        <li>注册状态: ${data.status}</li>
        <li>注册时间: ${data.creation_datetime}</li>
        <li>过期时间: ${data.expiry_datetime}</li>
        <li>域名名称: ${data.name}</li>
        <li>域名后缀: ${data.suffix}</li>
        <li>完整域名: ${data.domain}</li>
    `;
}

function displayError() {
    const resultsElement = document.getElementById('results');
    resultsElement.innerHTML = `<li>接口异常，请稍后再试</li>`;
}

/*
document.getElementById('searchButton').addEventListener('click', function() {
    const domainName = document.getElementById('domainName').value;
    const domainSuffix = document.getElementById('domainSuffix').value;
    if (!domainName.trim()) return; // 确保域名名称不为空
    toggleLoading(true);
    jsonpRequest(domainName, domainSuffix);
});

function toggleLoading(isLoading) {
    const loadingElement = document.getElementById('loading');
    loadingElement.style.display = isLoading ? 'block' : 'none';
}

function jsonpRequest(domainName, domainSuffix) {
    const script = document.createElement('script');
    const callbackName = 'jsonpCallback';

    window[callbackName] = function(data) {
        displayData(data);
        document.body.removeChild(script);
        delete window[callbackName];
    };

    //script.src = `https://whois.freeaiapi.xyz/?name={encodeURIComponent($domainName)}&suffix={encodeURIComponent($domainSuffix)}&callback=${callbackName}`;
    script.src = `https://whois.freeaiapi.xyz/?name=${domainName}&suffix=${domainSuffix}`;
    document.body.appendChild(script);
}

function displayData(data) {
    const resultsElement = document.getElementById('results');
    resultsElement.innerHTML = `
        <li>注册状态: ${data.status}</li>
        <li>注册时间: ${data.creation_datetime}</li>
        <li>过期时间: ${data.expiry_datetime}</li>
        <li>域名名称: ${data.name}</li>
        <li>域名后缀: ${data.suffix}</li>
        <li>完整域名: ${data.domain}</li>
    `;
}

function displayError() {
    const resultsElement = document.getElementById('results');
    resultsElement.innerHTML = `<li>接口异常，请稍后再试</li>`;
}
*/