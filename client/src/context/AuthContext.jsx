import { createContext,useContext, useEffect, useState } from  'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
const AuthContext = createContext();


export function AuthProvider({ children }) {
    const [token, setToken] = useState('');
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [footer, setFooter] = useState(true);
    const Navigate = useNavigate();


useEffect(() => {
  const initializeAuth = async () => {
    const storedToken = localStorage.getItem('token');
    const storedUser = JSON.parse(localStorage.getItem('user'));
    
    if (storedToken && storedUser) {
      try {
        axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        setToken(storedToken);
        setUser(storedUser);
        // Fetch profile data immediately after auth initialization
      } catch (error) {
        console.error('Auth initialization error:', error);
        logout();
      }
    }
    setLoading(false);
  };

  initializeAuth();
}, []);

const signup = async (formData) => {
  try {
    setLoading(true);
    // Ensure the data structure matches exactly what your backend expects
    const payload = {
      name: formData.name, // Make sure this matches your backend
      email: formData.email,
      password: formData.password
    };

    const response = await axios.post('http://localhost:5000/api/user/signup', payload, {
      headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true
    });

    if (response.data.token && response.data.user) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      setUser(response.data.user);
      setToken(response.data.token);
      Navigate('/')
      toast.success(response.data.message)
      return { success: true };
    }
  } catch (error) {
    toast.error(error.response?.data?.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Signup failed. Please try again.'
    };
  } finally {
    setLoading(false);
  }
};

  const login = async (formData) => {
    try {
      setLoading(true);
       const payload = {
      email: formData.email,
      password: formData.password
    };

      const response = await axios.post('http://localhost:5000/api/user/login', payload, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });

      if (response.data.token && response.data.user) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
         setUser(response.data.user);
        setToken(response.data.token);
         Navigate('/')
        toast.success(response.data.message)
        return { success: true };
      }
    }
    catch (error) {
    toast.error(error.response?.data?.message)
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed. Please try again.'
      };
    } finally {
      setLoading(false);
    }
  }


   const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setToken(null);
    toast.success('You are Logout')
    axios.defaults.headers.common['Authorization'] = '';
  }

       
    return (
        <AuthContext.Provider value={{
        signup,
        login,
        user,
        loading,
        setLoading,
        logout,
        token,
        footer,
        setFooter
        }} >
          {children}
        </AuthContext.Provider>
    )
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

