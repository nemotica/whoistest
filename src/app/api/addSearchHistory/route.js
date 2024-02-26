import { SearchHistory } from "@/lib/models" 
import { connectToDb } from "@/lib/utils";
import { NextResponse } from "next/server";
//import mongoose from "mongoose";

export const POST = async (request) => {

    const { searchParams } = new URL(request.url);
    const domain = searchParams.get('domain');

    try {
        connectToDb();
        const newSearch = new SearchHistory({ domain });
        const res = await newSearch.save();
        return NextResponse.json(res);

      } catch (error) {
        console.log(error);
        throw new Error("Something went wrong saving db!");
      }

}