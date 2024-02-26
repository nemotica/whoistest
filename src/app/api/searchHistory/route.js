import { SearchHistory } from "@/lib/models" 
import { connectToDb } from "@/lib/utils";
import { NextResponse } from "next/server";

export const GET = async (request) => {

  try {
    connectToDb();
    const history = await SearchHistory.find({})
      .sort({ 'createdAt':-1 })
      .limit(20)
      .exec();
    
      //console.log(NextResponse.json(history)," - response data from mongodb!");
      return NextResponse.json(history);

  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch data!");
  }
}