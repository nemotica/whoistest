import styles from "./domainInfoCard.module.css"

const DomainInfoCard = ({ data, iscache }) => {
    if (data) {
        //格式化处理域名 available 字段值
        const available_tostring = data.available ? "可注册" : "已被注册";
        //console.log(data);
        // 格式化日期时间信息
        // const formatDate = (datetime) => {
        //     if (!datetime) return '未知';
        //     const date = new Date(datetime);
        //     return date.toLocaleDateString(); // 使用更友好的日期格式
        // };

        return (
            <div className={styles.resultContainer}>
                <div className={styles.domainTitleContainer}>
                    <h1 className={styles.domainTitle}>{data.domain} ({available_tostring})</h1>
                </div>
                <div className={styles.domainDesc}>
                    <p className={styles.domainDescItem}>域名全名：{data.domain.toString()}</p>
                    <p className={styles.domainDescItem}>注册状态：{available_tostring.toString()}</p>
                    <p className={styles.domainDescItem}>域名名称：{data.name}</p>
                    <p className={styles.domainDescItem}>域名后缀：{data.suffix}</p>
                    {/* <p className={styles.domainDescItem}>注册时间：{data.creation_datetime.toString().slice(0,10)}</p>
                    <p className={styles.domainDescItem}>失效时间：{data.expiry_datetime.toString().slice(0,10)}</p> 
                    <p className={styles.domainDescItem}>命中缓存：{iscache.toString()}</p>*/}
                </div>
            </div>
        )
    }
};

export default DomainInfoCard