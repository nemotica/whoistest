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