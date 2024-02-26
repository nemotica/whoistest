// "use server";
// import { SearchHistory } from "./models";
// export const saveSearchHistory = async (domain) =>{
    
//     try {
//         connectToDb();
//         const newSearch = new SearchHistory({ domain });
//         await newSearch.save();
//         console.log("saved to db");
//     } catch (error) {
//         throw new Error("Something went wrong saving db!");
//     }
// }