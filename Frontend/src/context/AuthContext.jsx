import { createContext, useContext, useState, useCallback} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    // Fetch user and all dashboard data in one call
    const fetchUser = useCallback(async () => {
        try {
            setLoading(true);
            const res = await axios.get(
                `${import.meta.env.VITE_BACKEND_API}/api/user/courseByUser`,
                { withCredentials: true }
            );
            
            const {
                user: userData,
                user_sem_credits,
                totalCredits,
                runningTotal,
                CGPA,
                courses,
                user_added_courses
            } = res.data;
            
            setUser(userData);
            
            // Format courses with type field for SingleCategory
            const formattedCourses = (courses || []).map(c => ({ ...c, type: 'parsed' }));
            const formattedUserAdded = (user_added_courses || []).map(c => ({ ...c, type: 'manual' }));
            
            setDashboardData({
                userSemCredits: user_sem_credits || {},
                totalCredits: Number(totalCredits) || 0,
                runningTotal: runningTotal || {},
                cgpa: CGPA || "",
                courses: formattedCourses,
                userAddedCourses: formattedUserAdded,
                // Derive existing semesters from courses
                existingSemesters: [...new Set(courses?.map(c => c.sem) || [])]
            });
            setIsAuthenticated(true);
            return res.data;
        } catch (err) {
            setUser(null);
            setDashboardData(null);
            setIsAuthenticated(false);

            navigate('/login');
            throw err;
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    // Refresh all data without redirecting on error
    const refreshUser = useCallback(async () => {
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_BACKEND_API}/api/user/courseByUser`,
                { withCredentials: true }
            );
            
            const {
                user: userData,
                user_sem_credits,
                totalCredits,
                runningTotal,
                CGPA,
                courses,
                user_added_courses
            } = res.data;
            
            setUser(userData);
            
            // Format courses with type field for SingleCategory
            const formattedCourses = (courses || []).map(c => ({ ...c, type: 'parsed' }));
            const formattedUserAdded = (user_added_courses || []).map(c => ({ ...c, type: 'manual' }));
            
            setDashboardData({
                userSemCredits: user_sem_credits || {},
                totalCredits: Number(totalCredits) || 0,
                runningTotal: runningTotal || {},
                cgpa: CGPA || "",
                courses: formattedCourses,
                userAddedCourses: formattedUserAdded,
                existingSemesters: [...new Set(courses?.map(c => c.sem) || [])]
            });
            return res.data;
        } catch (err) {
            console.error('Failed to refresh user:', err);
            throw err;
        }
    }, []);

    // Update user locally (for profile updates without refetch)
    const updateUser = useCallback((updates) => {
        setUser(prev => ({ ...prev, ...updates }));
    }, []);

    // Clear auth state (for logout)
    const clearAuth = useCallback(() => {
        setUser(null);
        setDashboardData(null);
        setIsAuthenticated(false);
    }, []);

    const value = {
        user,
        dashboardData,
        loading,
        isAuthenticated,
        fetchUser,
        refreshUser,
        updateUser,
        clearAuth
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;

