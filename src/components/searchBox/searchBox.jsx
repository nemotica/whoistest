// src/components/searchBox/searchBox.jsx
import React, { useState, useEffect } from 'react';
import styles from './searchBox.module.css';

const SearchBox = ({ domain,fetchDomainData }) => {
    const [newDomain, setNewDomain] = useState('');

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
        //只有当结果页的searchBox 被调用时才会执行下面逻辑，所以时用 newDomain 去 split
        const [name, suffix] = newDomain.split('.');
        fetchDomainData(name, suffix);
    };

    return (
        <form className={styles.formContainer}>
            <input type="text" value={newDomain} onChange={handleInputChange} placeholder="输入域名"/>
            <button type='button' onClick={handleSubmit}>查询</button>
        </form>
    );
};

export default SearchBox;
