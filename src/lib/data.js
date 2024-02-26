// import { searchHistory } from "./models";
// import { connectToDb } from "@/lib/utils"

// export const getSearchHistory = async () => {
//     try {
//         connectToDb();
//         const history = await searchHistory.find({}).sort({ createdAt: -1 }).limit(20);
//         return history;
        
//     } catch (err) {
//         console.log(err);
//         throw new Error("Failed to fetch search history!");
//     }
// };