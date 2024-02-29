//额外抽象出一个函数，专门调用第三方 api whois 接口的
async function fetchWhoisInfo(name, suffix) {
  try {
      const response = await fetch(`https://whois.freeaiapi.xyz/?name=${name}&suffix=${suffix}`);
      if (!response.ok) {
          throw new Error('Failed to fetch whois information');
      }
      const data = await response.json();
      //console.log(data);
      return { ...data, suffix }; // 将 suffix 添加到返回的数据对象中，以便后续处理
  } catch (error) {
      console.error('Error fetching whois information:', error);
      return null; // 在发生错误时返回 null 或适当的错误处理
  }
}

export async function GET (request) {
  const { searchParams } = new URL(request.url);
  const domain = searchParams.get('domain');

  // Whois V5.0 new version
  const [name, originalSuffix] = domain.split('.');
  const suffixes = ['com', 'net', 'org', 'me', 'xyz', 'info', 'io', 'co', 'ai', 'biz', 'us'];
  
  // 检查原始后缀是否在候选集中
  if (!suffixes.includes(originalSuffix)) {
    return new Response(JSON.stringify({ error: `不支持查询 ${originalSuffix} 这个 suffix` }), {
        status: 400, // 400 Bad Request 表示客户端请求有误
        headers: { 'Content-Type': 'application/json' }
    });
  }

  let results = [];
  let queries = suffixes.map(suffix => fetchWhoisInfo(name, suffix));

  try {
      //wy:看起来是等待所有 query 都返回再继续下一步，result 是个数组
      results = await Promise.all(queries);
      // 确保原始域名的结果排在第一位，findIndex()接收一个回调函数，返回第一个使回调函数返回 true 的元素的索引
      const originalIndex = results.findIndex(result => result.suffix === originalSuffix);
      //如果存在相同的 suffix
      if (originalIndex > -1) {
          const originalResult = results.splice(originalIndex, 1)[0];
          results.unshift(originalResult);
      }
      
      return new Response(JSON.stringify({ data: results }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
      });
  } catch (error) {
      return new Response(JSON.stringify({ error: "服务器错误，无法获取域名信息！" }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
      });
  }


  // old version ⬇️⬇️⬇️⬇️⬇️ Whois V3.0

  //将参数分为 name 和 suffix
  // const [name, suffix] = domain.split('.');

  // try {
  //   // 使用 fetch 发送请求到外部 API
  //   const res = await fetch(`https://whois.freeaiapi.xyz/?name=${name}&suffix=${suffix}`);
  //   const data = await res.json();

  //   // 将获取到的信息返回给客户端
  //   if (res.ok) {
  //     return new Response(JSON.stringify({ data }), {
  //       status: 200,
  //       headers: {
  //         'Content-Type': 'application/json'
  //       }
  //     });
  //   } else {
  //     throw new Error('Failed to fetch data');
  //   }

  // } catch (error) {
  //   // Return a new response with the error message
  //   return new Response(JSON.stringify({ error: "服务器错误，无法获取该域名信息！" }), {
  //     status: 500,
  //     headers: {
  //       'Content-Type': 'application/json'
  //     }
  //   });
  // }

}