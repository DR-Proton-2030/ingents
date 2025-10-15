export const generateImageWithGemini = async (prompt: string): Promise<string | null> => {
  try {
    const huggingFaceToken = process.env.HUGGING_FACE_TOKEN 
    
    const response = await fetch(
      "https://router.huggingface.co/hf-inference/models/stabilityai/stable-diffusion-xl-base-1.0",
      {
        headers: {
          Authorization: `Bearer ${huggingFaceToken}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        // HF inference expects { inputs: "your prompt" }
        body: JSON.stringify({ inputs: prompt }),
      }
    );

    if (!response.ok) {
      const txt = await response.text().catch(() => "(no body)");
      console.error("HF image generation error:", response.status, txt);
      return null;
    }

    // Get as ArrayBuffer
    const arrayBuffer = await response.arrayBuffer();

    // Convert to base64 in a runtime-safe way (Node Buffer or browser btoa)
    let base64: string;
    if (typeof Buffer !== "undefined") {
      base64 = Buffer.from(arrayBuffer).toString("base64");
    } else {
      // Edge / browser fallback
      let binary = "";
      const bytes = new Uint8Array(arrayBuffer);
      const chunkSize = 0x8000;
      for (let i = 0; i < bytes.length; i += chunkSize) {
        binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
      }
      base64 = btoa(binary);
    }
    console.log("object", base64);
    // Return a data URL the frontend can use directly as an <img src="..."></img>
    return `data:image/png;base64,${base64}`;
  } catch (error) {
    console.error("Error generating image with Gemini:", error);
    return null;
  }
};


