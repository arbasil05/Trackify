export const createFeedbackEmbed = (name, email, issue) => {
    return {
        embeds: [{
            title: "📝 New Feedback Received",
            color: 4751615, // #4880FF in decimal
            fields: [
                {
                    name: "👤 Name",
                    value: name,
                    inline: true
                },
                {
                    name: "📧 Email",
                    value: email || "Not provided",
                    inline: true
                },
                {
                    name: "🐛 Issue Description",
                    value: issue,
                    inline: false
                }
            ],
            footer: {
                text: "Trackify Feedback System"
            },
            timestamp: new Date().toISOString()
        }]
    };
};
