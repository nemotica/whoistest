"use client"
import React, { useState, useEffect, useCallback } from 'react';
import DomainInfoCard from "@/components/domainInfoCard/domainInfoCard";
import SearchBox from "@/components/searchBox/searchBox";
import styles from './page.module.css';
import { useSearchParams } from 'next/navigation';

const SearchResult = () => {
    //const [data, setData] = useState(''); 
    const [data, setData] = useState([]); // Whois V5.0 修改为数组，以存储多个结果
    const [iscache, setIscache] = useState(false);

    // 从 URL 获取查询参数
    const domain = useSearchParams().get('domain');
    
    // 函数 检查缓存是否存在及是否过期
    const checkCache = (domain) => {
        const cache = localStorage.getItem(domain);
        if (cache) {
            const { expiry, data } = JSON.parse(cache);
            if (expiry > new Date().getTime()) {
                return data; // 如果还没有过期，返回缓存数据
            } else {
                localStorage.removeItem(domain); // 清除过期缓存
            }
        }
        return null; // 无缓存或缓存过期
    };

    // 获取域名信息，异步函数
    const fetchDomainData = useCallback(async (domain) => {
        const cachedData = checkCache(domain);
        if (cachedData){
            //setData(cachedData);
            setData(cachedData); // 保持数据为数组格式
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
                console.log(Array.isArray(res.data));
                //whoV5.0
                if (res.data && Array.isArray(res.data)){ // 确保返回的是数组格式
                    setData(res.data);
                } else {
                    setData([res.data]); // 保证非数组格式的数据也被处理成数组
                }
                //setData(res.data);
                setIscache(false);
                // 添加缓存，包括24小时后的过期时间
                localStorage.setItem(domain, JSON.stringify({ expiry: new Date().getTime() + 24 * 60 * 60 * 1000, data: res.data }));
            } catch (error) {
                console.error('Error fetching data:', error);
                setData([]); // 出错时清空数据
            }
        }
    },[]);

    //useEffect函数用于处理组件的副作用，特别是在组件挂载（加载）和更新时执行的操作。在此特定场景中，它被用于在页面加载时根据 URL 中的查询参数（`domainName` 和 `domainSuffix`）来获取和显示域名的信息。
    //[name, suffix]**依赖项数组**：`useEffect` 的第二个参数是一个依赖项数组。在这个例子中，它包含了 `domainName` 和 `domainSuffix`。这意味着只有当这两个值发生变化时，`useEffect` 里面的代码才会重新执行。在首次加载页面时，由于这两个值从未设置过，`useEffect` 会默认执行一次。
    useEffect(() => {
        if (domain) {
            fetchDomainData(domain);
        }
    }, [domain, fetchDomainData]); //当 domain 初始化或发生变化的时候才执行 useEffect 中的内容

    useEffect(()=>{
        const saveSearchHistory = async (domain) => {
            const response = await fetch(`/api/addSearchHistory?domain=${domain}`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                },
            });
            const res = await response.json();
        }
        saveSearchHistory(domain); // 还是存一条搜索记录
    },[domain]);

    return (
        <main className={styles.main}>
            <SearchBox domain={domain} fetchDomainData={fetchDomainData} />
            {/* <div>{data.toString()}</div> */}
            {data && (
                <div className={styles.responseContainer}>
                    {/* <DomainInfoCard data={data} iscache={iscache}/> */}
                    {data.map((item, index) =>(
                        <DomainInfoCard key={index} data={item} /> 
                    ))}
                </div>
            )}
        </main>
    );
};

export default SearchResult;


