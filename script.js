document.getElementById('searchButton').addEventListener('click', function() {
    const domainName = document.getElementById('domainName').value;
    const domainSuffix = document.getElementById('domainSuffix').value;
    if (!domainName.trim()) return; // 确保域名名称不为空
    toggleLoading(true);
    const fullDomain = `${domainName}.${domainSuffix}`;
    fetchData(fullDomain);
});

// 其余函数保持不变




function toggleLoading(isLoading) {
    const loadingElement = document.getElementById('loading');
    loadingElement.style.display = isLoading ? 'block' : 'none';
}

function fetchData(input) {
    // 伪代码 - 实际上需要根据您的API调整
    fetch(`您的API地址?query=${input}`)
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

