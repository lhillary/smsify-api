import openai from '../config/openai';
import { ICampaignCategory } from 'types/interfaces';

/**
 *
 *
 * @param {string} responseContent
 * @param {ICampaignCategory[]} categories
 * @param {string} context
 * @return {*}  {(Promise<number | null>)}
 */
async function categorizeResponse(responseContent: string, categories: ICampaignCategory[], context: string): Promise<number | null> {
    const categoryLabels = categories.map(category => category.categoryLabel).join(", ");
    const prompt = `Given the context: "${context}" and the response: "${responseContent}", please categorize this response into one of the following categories: ${categoryLabels}.`;

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "You are a helpful assistant equipped to categorize responses." },
                { role: "user", content: prompt }
            ],
        });

        const content = completion.choices[0]?.message?.content?.trim();
        if (!content) return null;
        
        // Determine the category ID based on the content
        const matchedCategory = categories.find(category => category.categoryLabel.toLowerCase() === content.toLowerCase());
        return matchedCategory ? matchedCategory.categoryId : null;
    } catch (error) {
        console.error("Failed to categorize response:", error);
        return null;
    }
}

export default categorizeResponse;