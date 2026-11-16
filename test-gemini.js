
const API_KEY = "AIzaSyDnC_X9bBzNdNVrtEvaj0-il91nRAggHow";
const MODEL_NAME = "gemini-2.0-flash";

async function testGemini() {
    console.log(`Testing Gemini API key with model ${MODEL_NAME}...`);
    try {
        const res = await fetch(
            `https://generativelanguage.googleapis.com/v1/models/${MODEL_NAME}:generateContent?key=${API_KEY}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: "Hello, say hi!" }] }]
                })
            }
        );

        if (!res.ok) {
            console.error(`API Error: ${res.status} ${res.statusText}`);
            const errorData = await res.json();
            console.error(JSON.stringify(errorData, null, 2));
            return;
        }

        const data = await res.json();
        console.log("Success! Response:");
        console.log(data.candidates[0].content.parts[0].text);
    } catch (err) {
        console.error("Fetch failed:", err);
    }
}

testGemini();

