changelog
1. 版本 V4.0 增加数据库存储逻辑，并且增加前端模块

---
## prompt

## 需求描述
1. 后端逻辑：每次执行搜索查询，就在数据库新增一条数据
2. 前端逻辑：在搜索框下方展示搜索历史模块，新增component，名为"searchHistoryCard"
3. 搜索历史模块包括：
	a. 标题“搜索历史”
	b. 最多 20 条历史查询记录
	c. 每条历史查询记录展示域名全称（数据库字段名称为 domain）
	d. 点击 domain 模块可以跳转到对应域名的搜索结果页

## 约束条件
1. 若没有任何搜索历史数据，则不展示搜索历史模块
2. 若有至少一条搜索历史数据，则在首页直接展示
3. 若有多条搜索历史数据，可以并列展示在一行内，若超出搜索框宽度则自动换行
4. 一条搜索历史数据内部不能折行

## 代码参考
1. 搜索首页: src/app/page.jsx
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

  // 处理 Enter 键触发搜索
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      router.push(`/searchResult?domain=${domain}`);
    }
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
        <input type="text" value={domain} onChange={handleInputChange} onKeyDown={handleKeyDown} placeholder="输入域名"/>
        <button type='button' onClick={handleSubmit}>查询</button>
      </form>
      
      <div className="searchHistoryContainer">
        <searchHistoryCard/>
      </div>

    </main>
  )
};

export default Home;

2. 搜索历史 component: src/components/searchHistory/searchHistory.jsx
import React, { useState, useEffect } from 'react';
import { connectToDb } from '@/lib/utils';
import { searchResult } from '@/lib/models';

export const SearchHistoryCard = async () => {

    const [searchhistory, setSearchHistory] = useState('');
    
    try {
        connectToDb();
        const res = await searchResult.find({})
            .sort({timestamps: desc})
            .limit(20)
            .exec();
        setSearchHistory(res);
        
    } catch (error) {
        console.log(error);
        throw new Error("Failed to fetch search history!");
    }

    return (
        <div className={styles.resultContainer}>
            <div className={styles.domainTitleContainer}>
                <h1 className={styles.domainTitle}>{data.domain} ({available_tostring})</h1>
            </div>
            <div className={styles.domainDesc}>
                <p className={styles.domainDescItem}>域名全名：{data.domain}</p>
                <p className={styles.domainDescItem}>注册状态：{available_tostring.toString()}</p>
                <p className={styles.domainDescItem}>域名名称：{data.name}</p>
                <p className={styles.domainDescItem}>域名后缀：{data.suffix}</p>
                <p className={styles.domainDescItem}>注册时间：{data.creation_datetime.toString().slice(0,10)}</p>
                <p className={styles.domainDescItem}>失效时间：{data.expiry_datetime.toString().slice(0,10)}</p>
                <p className={styles.domainDescItem}>命中缓存：{iscache.toString()}</p>
                
            </div>
        </div>
    )
};


## 任务
请完善搜索历史的 jsx 文件代码，如果现有代码不能满足需求，可以修改，并提供对应的代码注释


另外再提供 src/app/searchResult/page.jsx 的代码，请修改搜索结果页代码逻辑，满足将数据存到数据库的需求
// src/app/searchResult/page.jsx
"use client"
import React, { useState, useEffect,useCallback } from 'react';
import DomainInfoCard from "@/components/domainInfoCard/domainInfoCard";
import SearchBox from "@/components/searchBox/searchBox";
import styles from './page.module.css';
import { useRouter, useSearchParams } from 'next/navigation';

const SearchResult = () => {
    const [data, setData] = useState('');
    const [iscache, setIscache] = useState(false);

    // 从 URL 获取查询参数
    const domain = useSearchParams().get('domain');
    
    // 检查缓存是否存在及是否过期
    const checkCache = (domain) => {
        const cache = localStorage.getItem(domain);
        if (cache) {
            const { expiry, data } = JSON.parse(cache);
            if (expiry > new Date().getTime()) {
                return data; // 返回缓存数据
            } else {
                localStorage.removeItem(domain); // 清除过期缓存
            }
        }
        return null; // 无缓存或缓存过期
    };

    // 获取域名信息，异步函数
    // const fetchDomainData = async (domain) => {
    const fetchDomainData = useCallback(async (domain) => {
        const cachedData = checkCache(domain);
        if (cachedData){
            setData(cachedData);
            setIscache(true);
        } else {
            try {
                const response = await fetch(`/api/whois?domain=${domain}`, {
                    method: "GET",
                    headers: {
                        Accept: "application/json",
                    },
                });
                const res = await response.json();
                setData(res.data);
                setIscache(false);
                // 添加缓存，包括24小时后的过期时间
                localStorage.setItem(domain, JSON.stringify({ expiry: new Date().getTime() + 24 * 60 * 60 * 1000, data: res.data }));
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
    },[]);

    //useEffect函数用于处理组件的副作用，特别是在组件挂载（加载）和更新时执行的操作。在此特定场景中，它被用于在页面加载时根据 URL 中的查询参数（`domainName` 和 `domainSuffix`）来获取和显示域名的信息。
    //[name, suffix]**依赖项数组**：`useEffect` 的第二个参数是一个依赖项数组。在这个例子中，它包含了 `domainName` 和 `domainSuffix`。这意味着只有当这两个值发生变化时，`useEffect` 里面的代码才会重新执行。在首次加载页面时，由于这两个值从未设置过，`useEffect` 会默认执行一次。
    useEffect(() => {
        if (domain) {
            fetchDomainData(domain);
        }
    }, [domain, fetchDomainData]);//当 domain 初始化或发生变化的时候才执行 useEffect 中的内容；


    return (
        <main className={styles.main}>
            <SearchBox domain={domain} fetchDomainData={fetchDomainData} />
            {data && (
                <div className={styles.responseContainer}>
                    <DomainInfoCard data={data} iscache={iscache}/>
                </div>
            )}
        </main>
    );
};

export default SearchResult;


