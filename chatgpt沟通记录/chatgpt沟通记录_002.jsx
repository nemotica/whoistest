next.js 14 项目中，以下会提供 src/app/page.jsx 代码和 src/app/api/whois/route.js 代码，请帮我分析浏览器报错的原因以及可行的解决方案：
1. src/app/page.jsx 代码
"use client"
import Image from 'next/image'
import styles from './page.module.css'
import React, { useState } from 'react' //使用 React Hooks，用于在函数中管理状态
import { useRouter } from "next/router"

const Home = () => {
  
  const [domain, setDomain] = useState('');
  const [data, setData] = useState('[]'); //可能有多条数据

  const handleInputChange = (e) => {
      setDomain(e.target.value);
  };

  const handleSubmit = async (e) => {
      e.preventDefault(); // 阻止默认表单提交行为
      const [domainName, domainSuffix] = domain.split('.');
      
      try {
        const response = await fetch(`/api/whois?name=${domainName}&suffix=${domainSuffix}`, {
          method: "GET",
          headers:{
            Accept: "applicaiton/json",
          },
        });
        // 如果响应有效
        if (response) { 
          // 解析响应内容为 JSON 格式
          const data = response.json();
          // 设置数据，如果获取到的 data.data 为空，则默认为空数组。
          setData(data || '[]');
        }
      }
      catch (error) {
        //console输出错误信息
        console.error('Error fetching data:', error);
      }    
  };

  return (
    <main className={styles.main}>
      {/* logo */}
      <div className={styles.center}>
        <Image
          className={styles.logo}
          src="/next.svg"
          alt="Next.js Logo"
          width={180}
          height={37}
          priority
        />
      </div> 

      {/* 搜索框和搜索按钮 */}
      <form name="formName" className={styles.formContainer} >
        <input type="text" value={domain} onChange={handleInputChange} placeholder="输入域名"/>
        <button type='button' onClick={handleSubmit}>查询</button>
      </form>

      {/* 搜索结果 */}
      <div className={styles.responseContainer}>
        <p>somethinghere</p>
        <p>{data}</p>
      </div>
    

    </main>
  )
};

export default Home;

2. src/app/api/whois/route.js代码
export async function GET (request) {
  const { searchParams } = new URL(request.url);
  const domainName = searchParams.get(domainName);
  const domainSuffix = searchParams.get(domainSuffix);
  //const { domainName, domainSuffix } = request.query;
  
  try {
    // 使用 fetch 发送请求到外部 API
    const res = await fetch(`https://whois.freeaiapi.xyz/?name=${domainName}&suffix=${domainSuffix}`);
    const data = await res.json();

    // 将获取到的信息返回给客户端
    return res.status(200).json({ data });

  } catch (error) {
    res.status(500).json({error: "服务器错误，无法获取域名信息！"});
  }
}

3.报错提示
3.1 VS Code 终端提示
⨯ ReferenceError: Cannot access 'domainName' before initialization
    at GET (webpack-internal:///(rsc)/./src/app/api/whois/route.js:20:41)
3.2 浏览器开发者工具提示
500 (Internal Server Error)

---
结论：
1. 第 85 行中的参数名 name=${domainName} 应该是 domainName = ${domainName}，修改之后就恢复正常了。