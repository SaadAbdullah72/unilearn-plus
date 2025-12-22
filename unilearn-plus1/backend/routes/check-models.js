require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function checkModels() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    console.log("Checking API Connection...");
    
    // List all available models
    // Note: Is library ka koi direct 'listModels' function exposed nahi hai standard way mein as of now for users, 
    // isliye hum direct hit try karenge.
    
    console.log("----------------------------------------");
    console.log("Attempting to connect with 'gemini-1.5-flash'...");
    const result = await model.generateContent("Hi");
    console.log("✅ SUCCESS! 'gemini-1.5-flash' is working.");
    console.log("Response:", result.response.text());
    
  } catch (error) {
    console.log("❌ ERROR with 'gemini-1.5-flash':");
    console.log(error.message);
    
    console.log("\n🔄 Trying Fallback: 'gemini-pro'...");
    try {
        const model2 = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result2 = await model2.generateContent("Hi");
        console.log("✅ SUCCESS! 'gemini-pro' is working. Use this name.");
    } catch(err2) {
        console.log("❌ 'gemini-pro' also failed.");
        console.log("Please check if your API Key is form 'aistudio.google.com' (Correct) or 'Vertex AI' (Wrong library).");
    }
  }
}

checkModels();