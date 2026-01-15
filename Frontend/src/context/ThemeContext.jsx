import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ThemeContext = createContext(null);

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

export const ThemeProvider = ({ children }) => {
    const [isDark, setIsDark] = useState(() => {
        return localStorage.getItem('isDark') === 'true';
    });

    // Sync body class and scrollbar styles when theme changes
    useEffect(() => {
        const bodyClass = isDark ? 'dark-mode' : 'light-mode';
        document.body.className = bodyClass;

        const styleTagId = 'dynamic-scrollbar-style';
        let styleTag = document.getElementById(styleTagId);

        if (!styleTag) {
            styleTag = document.createElement('style');
            styleTag.id = styleTagId;
            document.head.appendChild(styleTag);
        }

        if (isDark) {
            styleTag.innerHTML = `
            * {
                scrollbar-color: #555 #2c2c2c;
            }

            *::-webkit-scrollbar-track {
                background: #2c2c2c;
            }

            *::-webkit-scrollbar-thumb {
                background-color: #555;
                border: 2px solid #2c2c2c;
            }

            *::-webkit-scrollbar-thumb:hover {
                background-color: #777;
            }
            `;
        } else {
            styleTag.innerHTML = `
            * {
                scrollbar-color: #b1b1b1 #f1f1f1;
            }

            *::-webkit-scrollbar-track {
                background: #f1f1f1;
            }

            *::-webkit-scrollbar-thumb {
                background-color: #b1b1b1;
                border: 2px solid #f1f1f1;
            }

            *::-webkit-scrollbar-thumb:hover {
                background-color: #b1b1b1;
            }
            `;
        }

        // Persist to localStorage
        localStorage.setItem('isDark', isDark.toString());
    }, [isDark]);

    const toggleTheme = useCallback(() => {
        setIsDark(prev => !prev);
    }, []);

    const value = {
        isDark,
        setIsDark,
        toggleTheme
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

export default ThemeContext;
