import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { onDocumentUpdated } from "firebase-functions/v2/firestore";
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

export const translateMessages = onDocumentUpdated(
    {
        document: "chats/{chatId}",
        secrets: [geminiApiKey],
    },
    async (event) => {
        try {
            // Safety checks
            if (!event.data?.before?.data() || !event.data?.after?.data()) {
                console.log("Missing document data, skipping translation");
                return;
            }

            const beforeData = event.data.before.data();
            const afterData = event.data.after.data();
            const messagesBefore = beforeData.messages || [];
            const messagesAfter = afterData.messages || [];

            // Only proceed if new messages were added
            if (messagesAfter.length <= messagesBefore.length) {
                console.log("No new messages added, skipping translation");
                return;
            }

            // Get only the new messages (messages that weren't in the before state)
            const newMessages = messagesAfter.slice(messagesBefore.length);

            // Filter messages that need translation
            const messagesToTranslate = newMessages.filter(
                (msg) =>
                    msg.text &&
                    msg.receiverId &&
                    !msg.translatedMessage &&
                    msg.text.trim().length > 0
            );

            if (messagesToTranslate.length === 0) {
                console.log("No new messages need translation");
                return;
            }

            console.log(
                `Processing ${messagesToTranslate.length} new messages for translation`
            );

            let hasUpdates = false;
            const updatedMessages = [...messagesAfter];

            // Process only the messages that need translation
            for (let i = 0; i < messagesToTranslate.length; i++) {
                const msg = messagesToTranslate[i];

                try {
                    const userSnap = await db
                        .collection("users")
                        .doc(msg.receiverId)
                        .get();

                    if (!userSnap.exists) {
                        console.log(
                            `User ${msg.receiverId} not found, skipping translation`
                        );
                        continue;
                    }

                    const userData = userSnap.data();
                    const targetLang = userData?.language;

                    // Only translate if user has a language preference and it's not English
                    if (targetLang) {
                        console.log(`Translating message to ${targetLang}`);

                        const translated = await translate(
                            msg.text,
                            targetLang
                        );

                        // Find the index of this message in the full messages array
                        // Since we know it's a new message, it should be in the latter part
                        const messageIndex = updatedMessages.findIndex(
                            (message, index) =>
                                index >= messagesBefore.length && // Only check new messages
                                message.senderId === msg.senderId &&
                                message.receiverId === msg.receiverId &&
                                message.text === msg.text &&
                                !message.translatedMessage
                        );

                        if (messageIndex !== -1) {
                            updatedMessages[messageIndex] = {
                                ...updatedMessages[messageIndex],
                                translatedMessage: translated,
                            };
                            hasUpdates = true;
                            console.log(
                                `Translated message at index ${messageIndex}`
                            );
                        }
                    } else {
                        console.log(
                            `User ${msg.receiverId} prefers English or has no language preference`
                        );
                    }
                } catch (error) {
                    console.error(
                        `Failed to translate message for receiverId: ${msg.receiverId}`,
                        error
                    );
                }
            }

            // Only update if there are actual translations
            if (hasUpdates) {
                console.log("Updating document with translations");
                await event.data.after.ref.update({
                    messages: updatedMessages,
                });
            } else {
                console.log("No translations were added");
            }
        } catch (error) {
            console.error("Error in translateMessages function:", error);
        }
    }
);
