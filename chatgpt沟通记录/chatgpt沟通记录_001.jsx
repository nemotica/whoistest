## 背景
使用next.js14搭建网站，如下会提供三个文件代码和目的，请分析问题并提供解决方案：

## 文件目录
1. src/app/page.jsx
2. src/app/api/whois/route.js
3. src/app/components/domanInfoCard/domainInfoCard.jsx

## 文件内的代码
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
            Accept: "applicaiton/json",
          },
        });

        // 设置数据
        const res = await response.json();
        setData(res);
        
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
      <div className={styles.responseContainer}>
        <DomainInfoCard data={data}/>
        <div>this is real</div>
      </div>
    

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
    return new Response(JSON.stringify({ error: "服务器错误，无法获取域名信息！" }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

}

3. src/app/components/domanInfoCard/domainInfoCard.jsx

import styles from "./domainInfoCard.module.css"
const DomainInfoCard = ({ data }) => {

    return (        
        <div className={styles.resultContainer}>
            <div className={styles.domainTitleContainer}>
                <h1 className={styles.domainTitle}>{data.domain},{data.available}</h1>
            </div>
            <div className={styles.domainDesc}>
                <p className={styles.domainDescItem}>域名全名：{data.domain}</p>
                <p className={styles.domainDescItem}>域名名称：{data.name}</p>
                <p className={styles.domainDescItem}>域名后缀：{data.suffix}</p>
                <p className={styles.domainDescItem}>注册时间：{data.creation_datetime}</p>
                <p className={styles.domainDescItem}>失效时间：{data.expiry_datetime}</p>
            </div>
        </div>
    );
};

export default DomainInfoCard

## 问题现象和报错提示
1. 第三个代码文件中DomainInfoCard 中的{data.domain},{data.name},{data.suffix}为空；
2. 第二个代码文件中res有值，
{
    "data": {
        "status": "ok",
        "name": "baidu",
        "suffix": "com",
        "domain": "baidu.com",
        "creation_datetime": "1999-10-11T11:05:17Z",
        "expiry_datetime": "2026-10-11T11:05:17Z",
        "available": false,
        "info": "   Domain Name: BAIDU.COM\r\n   Registry Domain ID: 11181110_DOMAIN_COM-VRSN\r\n   Registrar WHOIS Server: whois.markmonitor.com\r\n   Registrar URL: http://www.markmonitor.com\r\n   Updated Date: 2023-11-30T06:00:19Z\r\n   Creation Date: 1999-10-11T11:05:17Z\r\n   Registry Expiry Date: 2026-10-11T11:05:17Z\r\n   Registrar: MarkMonitor Inc.\r\n   Registrar IANA ID: 292\r\n   Registrar Abuse Contact Email: abusecomplaints@markmonitor.com\r\n   Registrar Abuse Contact Phone: +1.2086851750\r\n   Domain Status: clientDeleteProhibited https://icann.org/epp#clientDeleteProhibited\r\n   Domain Status: clientTransferProhibited https://icann.org/epp#clientTransferProhibited\r\n   Domain Status: clientUpdateProhibited https://icann.org/epp#clientUpdateProhibited\r\n   Domain Status: serverDeleteProhibited https://icann.org/epp#serverDeleteProhibited\r\n   Domain Status: serverTransferProhibited https://icann.org/epp#serverTransferProhibited\r\n   Domain Status: serverUpdateProhibited https://icann.org/epp#serverUpdateProhibited\r\n   Name Server: NS1.BAIDU.COM\r\n   Name Server: NS2.BAIDU.COM\r\n   Name Server: NS3.BAIDU.COM\r\n   Name Server: NS4.BAIDU.COM\r\n   Name Server: NS7.BAIDU.COM\r\n   DNSSEC: unsigned\r\n   URL of the ICANN Whois Inaccuracy Complaint Form: https://www.icann.org/wicf/\r\n>>> Last update of whois database: 2024-01-25T07:56:18Z <<<\r\n\r\nFor more information on Whois status codes, please visit https://icann.org/epp\r\n\r\nNOTICE: The expiration date displayed in this record is the date the\r\nregistrar's sponsorship of the domain name registration in the registry is\r\ncurrently set to expire. This date does not necessarily reflect the expiration\r\ndate of the domain name registrant's agreement with the sponsoring\r\nregistrar.  Users may consult the sponsoring registrar's Whois database to\r\nview the registrar's reported date of expiration for this registration.\r\n\r\nTERMS OF USE: You are not authorized to access or query our Whois\r\ndatabase through the use of electronic processes that are high-volume and\r\nautomated except as reasonably necessary to register domain names or\r\nmodify existing registrations; the Data in VeriSign Global Registry\r\nServices' (\"VeriSign\") Whois database is provided by VeriSign for\r\ninformation purposes only, and to assist persons in obtaining information\r\nabout or related to a domain name registration record. VeriSign does not\r\nguarantee its accuracy. By submitting a Whois query, you agree to abide\r\nby the following terms of use: You agree that you may use this Data only\r\nfor lawful purposes and that under no circumstances will you use this Data\r\nto: (1) allow, enable, or otherwise support the transmission of mass\r\nunsolicited, commercial advertising or solicitations via e-mail, telephone,\r\nor facsimile; or (2) enable high volume, automated, electronic processes\r\nthat apply to VeriSign (or its computer systems). The compilation,\r\nrepackaging, dissemination or other use of this Data is expressly\r\nprohibited without the prior written consent of VeriSign. You agree not to\r\nuse electronic processes that are automated and high-volume to access or\r\nquery the Whois database except as reasonably necessary to register\r\ndomain names or modify existing registrations. VeriSign reserves the right\r\nto restrict your access to the Whois database in its sole discretion to ensure\r\noperational stability.  VeriSign may restrict or terminate your access to the\r\nWhois database for failure to abide by these terms of use. VeriSign\r\nreserves the right to modify these terms at any time.\r\n\r\nThe Registry database contains ONLY .COM, .NET, .EDU domains and\r\nRegistrars.\r\n"
    }
}

## 结论

请根据上述描述和代码信息，分析存在的问题并给出对应的解决方案

------
结果：一次性成功解决
对话：https://chat.openai.com/share/c6972764-bf99-48ee-9d71-eeead505b4d0



