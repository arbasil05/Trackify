export const validateFeedback = (req, res, next) => {
    const { name, email, issue } = req.body;

    // Validate issue (required)
    if (!issue || typeof issue !== 'string') {
        return res.status(400).json({ message: "Issue is required" });
    }

    if (issue.trim().length === 0) {
        return res.status(400).json({ message: "Issue cannot be empty" });
    }

    if (issue.length > 2000) {
        return res.status(400).json({ message: "Issue is too long (max 2000 characters)" });
    }

    // Validate name (optional)
    if (name !== undefined && typeof name !== 'string') {
        return res.status(400).json({ message: "Invalid name format" });
    }

    if (name && name.length > 100) {
        return res.status(400).json({ message: "Name is too long (max 100 characters)" });
    }

    // Validate email (optional)
    if (email !== undefined && typeof email !== 'string') {
        return res.status(400).json({ message: "Invalid email format" });
    }

    if (email && email.length > 100) {
        return res.status(400).json({ message: "Email is too long (max 100 characters)" });
    }

    // Sanitize inputs (prevent Discord markdown injection)
    const sanitize = (str) => str.replace(/[`*_~|>]/g, '');

    req.sanitizedFeedback = {
        name: name && typeof name === 'string'
            ? sanitize(name.trim()).substring(0, 100) || 'Anonymous'
            : 'Anonymous',
        email: email && typeof email === 'string'
            ? sanitize(email.trim()).substring(0, 100)
            : 'Not provided',
        issue: sanitize(issue.trim()).substring(0, 2000)
    };

    next();
};
