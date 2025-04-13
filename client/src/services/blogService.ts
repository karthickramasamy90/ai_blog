import axios from "axios";

const API_URL = "http://localhost:3001/blogs";

export const blogService = {
    getAllBlogs: async () => {
        const response = await axios.get(API_URL, { withCredentials: true });
        return response.data;
    },

    createBlog: async(title: string, content: string) => {
        const response = await axios.post(API_URL, { title, content }, { withCredentials: true});
        return response.data;
    },

    updateBlog: async(id: number, title: string, content: string) => {
        const response = await axios.put(`${API_URL}/${id}`, { title, content }, { withCredentials: true});
        return response.data;
    },

    deleteBlog: async(id: number) => {
        const response = await axios.delete(`${API_URL}/${id}`, { withCredentials: true });
        return response.data;
    },

    saveAiGeneratedBlog: async(title: string, content: string) => {
        console.log("🔹 Sending Request to Save Blog:", { title, content });
        const response = await axios.post(`${API_URL}/save-generated`, { title, content }, { withCredentials: true });
        console.log("✅ Request Sent");
        return response.data;
    }
}