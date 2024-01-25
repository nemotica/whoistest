export async function GET (request) {
  const { searchParams } = new URL(request.url);
  const domainName = searchParams.get('domainName');
  const domainSuffix = searchParams.get('domainSuffix');

  try {
    // 使用 fetch 发送请求到外部 API
    const res = await fetch(`https://whois.freeaiapi.xyz/?name=${domainName}&suffix=${domainSuffix}`);
    const data = await res.json();

    // 将获取到的信息返回给客户端
    if (res.ok) {
      return new Response(JSON.stringify({ data }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    } else {
      throw new Error('Failed to fetch data');
    }

  } catch (error) {
    // Return a new response with the error message
    return new Response(JSON.stringify({ error: "服务器错误，无法获取该域名信息！" }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

}