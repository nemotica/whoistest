import mongoose from "mongoose";

const searchHistorySchema = new mongoose.Schema(
    {
        domain:{
            type:String,
            required:true,
            unique:false,
            max:50,
        },
    },{ timestamps: true }
);

//如果有已经存在的 searchRestul 则使用已有 model，否则就新建一个
export const SearchHistory = mongoose.models?.SearchHistory || mongoose.model("SearchHistory",searchHistorySchema);