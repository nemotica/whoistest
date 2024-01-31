changelog：
1. v2.0 版本，需要增加新的查询结果页面以及缓存。

prompt 如下：
--------------------------------------------------------

## 需求描述
使用 next.js14 框架的 app route 方式实现以下需求：
1. 如果用户通过首页 home 点击搜索，都会打开一个新页面（名称：搜索结果页 searchResult）展示搜索结果
2. 如果在搜索结果页 searchResult 点击搜索，在当前页面刷新搜索结果，仅展示最新的一次搜索结果

## 信息
如下提供相关页面代码
1. src/app/page.jsx
2. src/app/api/whois/route.js
3. src/components/domainInfoCard/domainInfoCard.jsx


1. src/app/page.jsx
"use client"
import Image from 'next/image'
import styles from './page.module.css'
import React, { useState } from 'react' //使用 React Hooks，用于在函数中管理状态
import DomainInfoCard from "@/components/domainInfoCard/domainInfoCard";


const Home = () => {
  
  const [domain, setDomain] = useState('');
  const [data, setData] = useState(''); 

  const handleInputChange = (e) => {
      setDomain(e.target.value);
  };

  const handleSubmit = async (e) => {
      e.preventDefault(); // 阻止默认表单提交行为
      
      const [domainName, domainSuffix] = domain.split('.');

      try {
        const response = await fetch(`/api/whois?domainName=${domainName}&domainSuffix=${domainSuffix}`, {
          method: "GET",
          headers:{
            Accept: "application/json",
          },
        });

        // 设置数据
        const res = await response.json();
        setData(res.data);
      }
      catch (error) {
        console.error('Error fetching data:', error);
      }
  };

  return (
    <main className={styles.main}>
      <div className={styles.center}>
        <Image
          className={styles.logo}
          src="/WhoIsThisWebsite.svg"
          alt="Whois this Website"
          width={400}
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
      {data && (
        <div className={styles.responseContainer}>
        <DomainInfoCard data={data}/>
        </div>
      )}
    </main>
  )
};

export default Home;

2. src/app/api/whois/route.js
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

3.src/components/domainInfoCard/domainInfoCard.jsx
import styles from "./domainInfoCard.module.css"

const DomainInfoCard = ({ data }) => {
    if (data) {

        //格式化处理域名 available 字段值
        const available_tostring = data.available ? "已注册" : "未注册";

        return (
            <div className={styles.resultContainer}>
                <div className={styles.domainTitleContainer}>
                    <h1 className={styles.domainTitle}>{data.domain} ({available_tostring})</h1>
                </div>
                <div className={styles.domainDesc}>
                    <p className={styles.domainDescItem}>域名全名：{data.domain}</p>
                    <p className={styles.domainDescItem}>域名名称：{data.name}</p>
                    <p className={styles.domainDescItem}>域名后缀：{data.suffix}</p>
                    <p className={styles.domainDescItem}>注册时间：{data.creation_datetime.toString().slice(0,10)}</p>
                    <p className={styles.domainDescItem}>失效时间：{data.expiry_datetime.toString().slice(0,10)}</p>
                </div>
            </div>
        )
    }
};

export default DomainInfoCard

## 第三方 API 返回数据格式
接口 https://whois.freeaiapi.xyz/?name=${domainName}&suffix=${domainSuffix} 返回的数据格式为：
{
    "data": {
        "status": "ok",
        "name": "baidu",
        "suffix": "com",
        "domain": "baidu.com",
        "creation_datetime": "1999-10-11T11:05:17Z",
        "expiry_datetime": "2026-10-11T11:05:17Z",
        "available": false,
        "info": "blablabla"
    }
}

## 任务
1. 请按照需求描述，提供搜索结果页的完整代码 src/app/searchResult.jsx
2. 请按照需求描述，提供搜索结果页中的搜索框和搜索按钮代码 src/components/searchBox/searchBox.jsx
3. 搜索结果页中的搜索结果内容需要使用 src/components/domainInfoCard/domainInfoCard.jsx 实现
4. 请按照需求描述，修改以下文件的代码 1. src/app/page.jsx，2. src/app/api/whois/route.js和 3. src/components/domainInfoCard/domainInfoCard.jsx 


