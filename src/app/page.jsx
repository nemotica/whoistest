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
            Accept: "applicaiton/json",
          },
        });

        // 设置数据
        const res = await response.json();
        setData(res.data);
        
        // const dmInfo = data.json();
        // console.log("typeof:",typeof(dmInfo));
        // // 如果响应有效
        // if (response) { 
        //   // 解析响应内容为 JSON 格式
        //   const res = await response.json();
          
        //   // 设置数据
        //   setData(res.json()};
          
        //   //调试信息
        //   //console.log(data);
        // }
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
      {data && (
        <div className={styles.responseContainer}>
        <DomainInfoCard data={data}/>
        </div>
      )}
    </main>
  )
};

export default Home;