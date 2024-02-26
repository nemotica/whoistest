import mongoose from "mongoose";
import { connect }  from "mongoose";

const connection = {}; // 初始化一个空对象（empty object）

export const connectToDb = async () => {
    try {
        //检查是否已经建立过数据库链接，避免每次都重新建立数据库链接
        if(connection.isConnected){
            console.log("Using existing connectoin");
            return;
        }
        //链接数据库，env.MONGO 是根目录 .env 文件中的环境变量
        const db = await mongoose.connect(process.env.MONGO);
        connection.isConnected = db.connections[0].readyState; //[0]取第一个 connection
      } catch (error) {
        console.log(error);
        throw new Error(error);
      }
}