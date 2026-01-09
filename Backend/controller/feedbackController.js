import { createFeedbackEmbed } from "../utils/discordTemplates.js";

export const submitFeedback = async (req, res) => {
    try {
        const { name, email, issue } = req.sanitizedFeedback;

        const embed = createFeedbackEmbed(name, email, issue);

        await fetch(process.env.DISCORD_WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(embed),
        });

        res.status(200).json({ message: "Feedback submitted successfully" });
    } catch (error) {
        // console.error("Error submitting feedback:", error);
        res.status(500).json({ message: "There was an error submitting your feedback" });
    }
};