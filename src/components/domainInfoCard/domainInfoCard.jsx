import styles from "./domainInfoCard.module.css"

const DomainInfoCard = ({ data }) => {
    if (data) {
        //格式化处理域名 available 字段值
        const available_tostring = data.available ? "可注册" : "已被注册";

        return (
            <div className={styles.resultContainer}>
                <div className={styles.domainTitleContainer}>
                    <h1 className={styles.domainTitle}>{data.domain} ({available_tostring})</h1>
                </div>
                <div className={styles.domainDesc}>
                    <p className={styles.domainDescItem}>域名全名：{data.domain}</p>
                    <p className={styles.domainDescItem}>注册状态：{available_tostring.toString()}</p>
                    <p className={styles.domainDescItem}>域名名称：{data.name}</p>
                    <p className={styles.domainDescItem}>域名后缀：{data.suffix}</p>
                    <p className={styles.domainDescItem}>注册时间：{data.creation_datetime.toString().slice(0,10)}</p>
                    <p className={styles.domainDescItem}>失效时间：{data.expiry_datetime.toString().slice(0,10)}</p>
                </div>
            </div>
        )
    }
};

export default DomainInfoCard