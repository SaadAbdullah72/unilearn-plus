const { GoogleGenerativeAI } = require("@google/generative-ai");

// 👇 Tumhari Key
const API_KEY = "AIzaSyB94q7EnJyOnYZ0Co8z7Jzzc_U6dfIkGYI"; 

async function checkModels() {
  console.log("... Testing Stable Model (gemini-pro) ...");

  const genAI = new GoogleGenerativeAI(API_KEY);

  try {
    // CHANGE: Ab hum "gemini-pro" use kar rahe hain jo sabse stable hai
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    console.log("Connecting...");
    const result = await model.generateContent("Hi AI, are you working?");
    const response = await result.response;
    
    console.log("------------------------------------------------");
    console.log("✅ SUCCESS! 'gemini-pro' chal gaya!");
    console.log("🤖 AI Reply:", response.text());
    console.log("------------------------------------------------");
    
  } catch (error) {
    console.log("\n❌ STILL FAILED.");
    console.log("Error Message:", error.message);
  }
}

checkModels();