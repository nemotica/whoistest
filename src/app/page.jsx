"use client"
import Image from 'next/image'
import styles from './page.module.css'
import React, { useEffect, useState } from 'react' //使用 React Hooks，用于在函数中管理状态
import { useRouter } from 'next/navigation';
import SearchHistoryCard from '@/components/searchHistoryCard/searchHistoryCard';

const Home = () => {
  const [domain, setDomain] = useState('');
  const [searchHistory, setSearchHistory] = useState([]);
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
  
  useEffect(() => {
    // 获取搜索历史数据    
    const fetchSearchHistory = async () => {
      // 调用 api 查询搜索历史
      const response = await fetch(`/api/searchHistory`, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        //console.log(data," it's here!");
        setSearchHistory(data); // 假设返回的是一个数组
      }
    };
    fetchSearchHistory();
  },[]); 

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
        <SearchHistoryCard searchHistory={searchHistory} />
      </div> 

    </main>
  )
};

export default Home;