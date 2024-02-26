chatgpt沟通记录_005.jsx

## 需求描述
使用 next.js14 框架的 app route 方式实现以下需求：
1. 用户每次输入一个域名，点击查询按钮时都会跳转到 searchResult 页面，并判断缓存中是否已经存在当前搜索词对应的缓存数据？
1.1 如果有缓存，继续判断缓存是否过期（有效期 24 小时）
1）如果缓存未过期，则直接返回缓存数据并展示在 searchResult 页面的DomainInfoCard模块；
2）如果缓存已过期，则发起一次新的查询，并将结果记录在缓存中
1.2 否则如果没有缓存，则发起一次新的查询，并将结果记录在缓存中；


## 信息
如下提供相关页面代码
1. . src/app/searchResult/page.jsx
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

    useEffect(() => {
        if (domain) {
            fetchDomainData(domain);
        }
    }, [domain]);

    return (
        <main className={styles.main}>
            <SearchBox domain={domain} fetchDomainData={fetchDomainData}/>
            {data && (
                <div className={styles.responseContainer}>
                    <DomainInfoCard data={data} />
                </div>
            )}
        </main>
    );
};

export default SearchResult;

2. src/components/searchBox/searchBox.jsx
// src/components/searchBox/searchBox.jsx
import React, { useState, useEffect } from 'react';
import styles from './searchBox.module.css';
import { useRouter } from 'next/navigation';

const SearchBox = ({ domain,fetchDomainData }) => {
    const [newDomain, setNewDomain] = useState('');
    const router = new useRouter();

    useEffect(() => {
        //在当前页面输入框，填入页面链接中已有的 domain 信息
        if (domain) {
            setNewDomain(domain);
        }
    }, [domain]);

    const handleInputChange = (e) => {
        setNewDomain(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        //缺少一段判断 newDomain 是否为空的异常逻辑
        
        //在搜索结果页触发新查询，也跳转一个新页面，而不只是重新调接口获取 domain 数据
        router.push(`/searchResult?domain=${newDomain}`);
        //只有当结果页的searchBox 被调用时才会执行下面逻辑，所以时用 newDomain 去 split
        //const [name, suffix] = newDomain.split('.');
        //fetchDomainData(name, suffix);
    };

    return (
        <form className={styles.formContainer}>
            <input type="text" value={newDomain} onChange={handleInputChange} placeholder="输入域名"/>
            <button type='button' onClick={handleSubmit}>查询</button>
        </form>
    );
};

export default SearchBox;

4. src/components/domainInfoCard/domainInfoCard.jsx

import styles from "./domainInfoCard.module.css"

const DomainInfoCard = ({ data }) => {
    if (data) {
        //格式化处理域名 available 字段值
        const available_tostring = data.available ? "可注册" : "已被注册";

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
                </div>
            </div>
        )
    }
};

export default DomainInfoCard

## 任务
请根据以上信息，使用 localstorage 方案，提供修改后的代码

----
结果：可行
https://chat.openai.com/share/4b3d40f5-dbf6-4b89-a5ee-e4dc12bf93c6
