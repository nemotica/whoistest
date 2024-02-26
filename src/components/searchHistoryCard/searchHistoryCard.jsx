import React, { useState, useEffect } from 'react';
import styles from './searchHistoryCard.module.css'; // Assuming the CSS module exists and is correctly set up
import Link from 'next/link'; // Import Link for client-side transitions

// Corrected to a functional component and fixed async usage in useEffect
const SearchHistoryCard = ({ searchHistory }) => {

    if (!searchHistory.length) {
        return null; // Do not render if there's no search history
    }

    return (
        <div className={styles.historyContainer}>
            <h2>搜索历史</h2>
            <div className={styles.historyList}>
                {searchHistory.map((item, index) => (
                    <Link key={index} href={`/searchResult?domain=${item.domain}`} passHref>
                        <p className={styles.historyItem}>{item.domain}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default SearchHistoryCard;
