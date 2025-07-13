import { initializeApp } from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";
import { onDocumentCreated } from "firebase-functions/firestore";
import { defineSecret } from "firebase-functions/params";
import { GoogleGenerativeAI } from "@google/generative-ai";

initializeApp();

const db = getFirestore();

// Secure API key using Firebase Functions secrets
const geminiApiKey = defineSecret("GEMINI_API_KEY");

// Gemini translation function
async function translate(text, targetLanguage) {
    try {
        const genAI = new GoogleGenerativeAI(geminiApiKey.value());
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `Translate the following text to ${targetLanguage}. Return only the translated text without any additional formatting or explanations:\n\n${text}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;

        return response.text().trim();
    } catch (error) {
        console.error("Translation error:", error);
        return text; // Return original text if translation fails
    }
}

export const translateMessage = onDocumentCreated(
    {
        document: "chats/{chatId}/messages/{receiverId}",
        secrets: [geminiApiKey],
    },
    async (event) => {
        const { receiverId } = event.params;
        const message = event.data();
        if (message.text) {
            const user = await db.collection("users").doc(receiverId).get();
            const userData = user.data();
            if (userData.language) {
                const translatedMessage = await translate(
                    message.text,
                    userData.language
                );
                event.data.ref.update({ translatedMessage: translatedMessage });
            }
        }
    }
);
