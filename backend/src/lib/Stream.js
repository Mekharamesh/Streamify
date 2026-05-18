import { StreamChat } from "stream-chat";
import "dotenv/config";

const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

if (!apiKey || !apiSecret) {
    console.error("Stream API key or Secret is missing");
}

const streamClient = StreamChat.getInstance(apiKey, apiSecret);

export const upsertStreamUser = async (userData) => {
    try {

        console.log("Sending to Stream:", userData);

        await streamClient.upsertUser(userData);

        return userData;
    } catch (error) {
        console.log("Error upserting stream user:", error.message);
    }
};

export const generateStreamToken = (userId) =>{
    try{
      //ensure userId is a String
      const userIdStr = userId.toString();
      return streamClient.createToken(userIdStr)
    }catch(error){
      console.log("Error generating Stream token:", error)
    }
}