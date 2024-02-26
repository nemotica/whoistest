## 需求描述
使用 next.js14 框架的 app route 方式实现以下需求：
1. 用户在首页输入框中输入搜索词"domain"
2. 点击搜索按钮时，打开搜索结果页（searchResult）同时根据用户输入的 domain 信息查询第三方接口并将接口返回信息展示在搜索结果页
3. 跳转到新页面时，输入框中自动填入之前在首页提交的 domain

## 信息
如下提供相关页面代码
1. src/app/page.jsx
"use client"
import Image from 'next/image'
import styles from './page.module.css'
import React, { useState } from 'react' //使用 React Hooks，用于在函数中管理状态
import DomainInfoCard from "@/components/domainInfoCard/domainInfoCard";
//import { useRouter } from 'next/router';
import { useRouter } from 'next/navigation';

const Home = () => {
  const [domain, setDomain] = useState('');
  const router = useRouter();

  //每当输入框更新，则更新 domain 字段
  const handleInputChange = (e) => {
      setDomain(e.target.value);
  };

  const handleSubmit = async (e) => {
    //禁止 form 组件的默认提交事件，方便执行调用第三方 API 逻辑
    e.preventDefault();
    // 使用 useRouter 进行页面跳转，并传递查询参数
    router.push(`/searchResult?domain=${domain}`)
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

    </main>
  )
};

export default Home;


2. src/app/searchResult/page.jsx
// src/app/searchResult/page.jsx
"use client"
import React, { useState, useEffect } from 'react';
import DomainInfoCard from "@/components/domainInfoCard/domainInfoCard";
import SearchBox from "@/components/searchBox/searchBox";
import styles from './page.module.css';
import { useRouter, useSearchParams } from 'next/navigation';

const SearchResult = () => {
    const [data, setData] = useState('');

    // 从 URL 获取查询参数
    const domain = useSearchParams().get('domain');
    //console.log('domain in searchRestut/page:',domain);

    // 获取域名信息，异步函数
    const fetchDomainData = async (domain) => {
        try {
            const response = await fetch(`/api/whois?domain=${domain}`, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                },
            });
            const res = await response.json();
            setData(res.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    //useEffect函数用于处理组件的副作用，特别是在组件挂载（加载）和更新时执行的操作。在此特定场景中，它被用于在页面加载时根据 URL 中的查询参数（`domainName` 和 `domainSuffix`）来获取和显示域名的信息。
    //[name, suffix]**依赖项数组**：`useEffect` 的第二个参数是一个依赖项数组。在这个例子中，它包含了 `domainName` 和 `domainSuffix`。这意味着只有当这两个值发生变化时，`useEffect` 里面的代码才会重新执行。在首次加载页面时，由于这两个值从未设置过，`useEffect` 会默认执行一次。
    useEffect(() => {
        if (domain) {
            fetchDomainData(domain);
        }
    }, [domain]);

    return (
        <main className={styles.main}>
            <SearchBox fetchDomainData={fetchDomainData} />
            {data && (
                <div className={styles.responseContainer}>
                    <DomainInfoCard data={data} />
                </div>
            )}
        </main>
    );
};

export default SearchResult;

3. src/components/searchBox/searchBox.jsx
import React, { useState } from 'react';
import styles from './searchBox.module.css';

const SearchBox = ({ fetchDomainData }) => {
    const [domain, setDomain] = useState('');

    const handleInputChange = (e) => {
        setDomain(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const [name, suffix] = domain.split('.');
        fetchDomainData(name, suffix);
    };

    return (
        <form className={styles.formContainer}>
            <input type="text" value={domain} onChange={handleInputChange} placeholder="输入域名"/>
            <button type='button' onClick={handleSubmit}>查询</button>
        </form>
    );
};

export default SearchBox;


## 任务
请根据以上信息，修改代码