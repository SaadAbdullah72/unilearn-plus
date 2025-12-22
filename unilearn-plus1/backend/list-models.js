// Hum library use nahi kar rahe, direct fetch kar rahe hain
async function getAvailableModels() {
  const API_KEY = "AIzaSyB94q7EnJyOnYZ0Co8z7Jzzc_U6dfIkGYI"; // Tumhari Key
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;

  console.log("🔍 Checking available models from Google...");

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
        console.log("❌ Error:", data.error.message);
    } else {
        console.log("✅ SUCCESS! Google says these models are available for you:");
        console.log("------------------------------------------------");
        // Sirf un models ko filter karo jo 'generateContent' support karte hain
        const chatModels = data.models.filter(m => m.supportedGenerationMethods.includes("generateContent"));
        
        chatModels.forEach(model => {
            console.log(`👉 Name: ${model.name.replace("models/", "")}`);
        });
        console.log("------------------------------------------------");
        console.log("Apne code mein upar di gayi list mein se koi ek naam use karo.");
    }
  } catch (error) {
    console.error("Network Error:", error);
  }
}

getAvailableModels();