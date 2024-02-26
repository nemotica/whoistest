## 需求描述
1. 现有逻辑：用户输入域名信息后，鼠标点击查询按钮可以触发搜索；
2. 预期逻辑：用户输入域名信息后，敲击键盘 enter 按键也可以触发搜索

## 约束条件
1. 使用 next.js14 框架和 app router 方案
2. 我提供相关代码，并给出对应的异常现象和报错信息；
3. 请你指出错误原因并提供修改方案的代码


## 代码参考
1. src/app/searchResult/page.jsx
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
    //const fetchDomainData = async (domain) => {
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
                    <DomainInfoCard data={data} iscache={iscache} />
                </div>
            )}
        </main>
    );
};

export default SearchResult;

## 任务描述
请按照需求描述，修改以上代码并给出必要说明；

----
应该没问题
https://chat.openai.com/share/39ce1969-b77c-4c8f-915b-007311bdf5f1