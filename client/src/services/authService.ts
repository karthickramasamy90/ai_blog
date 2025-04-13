import axios from "axios";

const API_URL = "http://localhost:3001"; // Update with your backend URL

export const authService = {
    // login: async (email: string, password: string) => {
    //     const response = await axios.post(`${API_URL}/auth/login`, { email, password }, { withCredentials: true });
    //     return response.data; // Returns { access_token, refresh_token }
    // },

    login: async (email: string, password: string) => {
        const response = await axios.post(
          `${API_URL}/auth/login`,
          { email, password },
          { withCredentials: true } // ✅ Ensures cookies are included
        );
        return response.data;
      },

    register: async (email: string, password: string) => {
        const response = await axios.post(`${API_URL}/users`, { email, password }, { withCredentials: true });
        return response.data;
    },

    logout: async () => {
        await axios.post(`${API_URL}/auth/logout`, {}, { withCredentials: true });
    },

    // logout: async () => {
    //     try {
    //     const token = localStorage.getItem("access_token");
        
    //     // Make API call to invalidate the refresh token
    //     await axios.post(`${API_URL}/logout`, {}, {
    //         headers: { Authorization: `Bearer ${token}` },
    //         withCredentials: true
    //     });
    
    //     // Clear stored tokens & user data
    //     localStorage.removeItem("access_token");
    //     localStorage.removeItem("user");
    
    //     // Redirect to login page
    //     window.location.href = "/auth/login";
    //     } catch (error) {
    //     console.error("Logout failed:", error);
    //     }
    // },

    // getCurrentUser: async () => {
    //     return await axios.get(`${API_URL}/me`, { withCredentials: true });
    // },

    // getCurrentUser: async () => {
    //     const response = await axios.get(`${API_URL}/auth/me`, {
    //       withCredentials: true, // Send cookies automatically
    //     });
    //     return response.data;
    // },

    getProfile: async () => {
        const response = await axios.get(`${API_URL}/auth/me`, { withCredentials: true }); // ✅ Send cookies
        return response.data;
    },

    generateBlog: async (topic: string) => {
      const response = await axios.post(`${API_URL}/blogs/generate`, { topic }, { withCredentials: true });
      return response.data; // Returns { blogContent: "Generated blog content..." }
    },
};
