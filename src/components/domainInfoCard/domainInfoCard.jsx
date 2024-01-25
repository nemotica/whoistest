import styles from "./domainInfoCard.module.css"

// const formatDate = (dateString) => {
//     const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
//     return new Date(dateString).toLocaleDateString('zh-CN', options);
// };

const DomainInfoCard = ({ data }) => {
    if (data) {

        //const available_tostring = data.available.toString();
        const available_tostring = data.available ? "已注册" : "未注册";

        return (
            <div className={styles.resultContainer}>
                <div className={styles.domainTitleContainer}>
                    <h1 className={styles.domainTitle}>{data.domain} ({available_tostring})</h1>
                </div>
                <div className={styles.domainDesc}>
                    <p className={styles.domainDescItem}>域名全名：{data.domain}</p>
                    <p className={styles.domainDescItem}>域名名称：{data.name}</p>
                    <p className={styles.domainDescItem}>域名后缀：{data.suffix}</p>
                    <p className={styles.domainDescItem}>注册时间：{data.creation_datetime.toString().slice(0,10)}</p>
                    <p className={styles.domainDescItem}>失效时间：{data.expiry_datetime.toString().slice(0,10)}</p>
                </div>
            </div>
        )
    }

    

    // const creationDate = String(data.creation_datetime).slice(0,10);
    // const expiryDate = String(data.expiry_datetime).slice(0,10);

    // //console.log(creationDate,"+",expiryDate);

    // return (        
    //     <div className={styles.resultContainer}>
    //         <div className={styles.domainTitleContainer}>
    //             {data.domain && (
    //                 <h1 className={styles.domainTitle}>{data.domain},{data.available?.toString()}</h1>
    //             )}
    //         </div>
    //         {data.domain && (
    //         <div className={styles.domainDesc}>
    //             <p className={styles.domainDescItem}>域名全名：{data.domain}</p>
    //             <p className={styles.domainDescItem}>域名名称：{data.name}</p>
    //             <p className={styles.domainDescItem}>域名后缀：{data.suffix}</p>
    //             <p className={styles.domainDescItem}>注册时间:{data.creation_datetime?.toString().slice(0,10)}</p>
    //             <p className={styles.domainDescItem}>失效时间:{data.expiry_datetime?.toString().slice(0,10)}</p>
    //         </div>
    //         )}
    //     </div>
    // );
};

export default DomainInfoCard