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


