"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { Card, CardContent, Typography, Button, Container, Grid, CircularProgress, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Box } from "@mui/material";
import Navbar from "@/components/Navbar";
import { blogService } from "../services/blogService";
import ReactMarkdown from 'react-markdown';
import CreateBlog from "../components/CreateBlog";
import BlogCard from "@/components/BlogCard ";
import ChatAssistant from "@/components/ChatAssistant";
import { authService } from "@/services/authService"; // Assuming your API calls are handled here

interface Blog {
  id: number;
  title: string;
  content: string;
}

const Dashboard = (props: any) => {
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [editingBlog, setEditingBlog] = useState(null);
  const [updatedId, setUpdatedId] = useState(1);
  const [updatedTitle, setUpdatedTitle] = useState("");
  const [updatedContent, setUpdatedContent] = useState("");
  const [topic, setTopic] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [generatedBlog, setGeneratedBlog] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get("http://localhost:3001/auth/me", {
          withCredentials: true,
        });
        setUser(response.data);
      } catch (error) {
        router.push("/auth/login");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  // Define fetchBlogs function
  const fetchBlogs = async () => {
    try {
      const data = await blogService.getAllBlogs();
        setBlogs(data);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleEdit = (blog: any) => {
    setEditingBlog(blog);
    setUpdatedId(blog.id);
    setUpdatedTitle(blog.title);
    setUpdatedContent(blog.content);
  };

  const handleUpdate = async () => {
    await blogService.updateBlog(updatedId, updatedTitle, updatedContent );
    setEditingBlog(null);
    fetchBlogs();
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      await blogService.deleteBlog(id);
      fetchBlogs();
    }
  };

  const handleGenerateBlog = async () => {
    if (!topic.trim()) return; // Prevent empty input
    setAiLoading(true);
    setGeneratedBlog(""); // Clear previous blog

    try {
      const response = await authService.generateBlog(topic);
      setGeneratedBlog(response.blogContent?.content); // Assuming the API returns { blogContent: "...content..." }
    } catch (error) {
      console.error("Error generating blog:", error);
    } finally {
      setAiLoading(false);
    }
  };

  const saveGeneratedBlog = async () => {
    try {
      const response = await blogService.saveAiGeneratedBlog(topic, generatedBlog);
      console.log("Saved Blog:", response);
      setGeneratedBlog("");
      fetchBlogs(); // Refresh blog list
    } catch (error) {
      console.error("Error saving blog:", error);
      alert("Failed to save blog.");
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <Container sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
          <CircularProgress />
        </Container>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <Container sx={{ mt: 5 }}>
        <Typography variant="h4" gutterBottom>Blog Dashboard</Typography>
        {/* Create Blog Form */}
          <Box sx={{ maxWidth: 600, margin: "auto", mt: 4 }}>
            <Typography variant="h5" gutterBottom>
              Generate AI-Powered Blog
            </Typography>
            <TextField
              label="Enter a topic"
              variant="outlined"
              fullWidth
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Button variant="contained" color="primary" onClick={handleGenerateBlog} disabled={aiLoading}>
              {aiLoading ? <CircularProgress size={24} /> : "Generate Blog"}
            </Button>

            {generatedBlog && (
              <Box sx={{ mt: 3, p: 2, border: "1px solid #ddd", borderRadius: 2 }}>
                <Typography variant="h6">Generated Blog:</Typography>
                <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>{generatedBlog}</Typography>
              </Box>
            )}
            {generatedBlog && <Button variant="contained" color="primary" onClick={saveGeneratedBlog}>
                  Save Blog
                </Button>
            }
          </Box>
          <CreateBlog onBlogCreated={fetchBlogs} />

          <Grid container spacing={2}>
            {blogs.map((blog) => (
              <Grid item xs={12} sm={6} md={6} key={blog.id}>
                <BlogCard 
                blog={blog}
                onEdit={handleEdit}
                onDelete={handleDelete}
                />
              </Grid>
            ))}
          </Grid>
          {/* Edit Blog Modal */}
      {editingBlog && (
        <Dialog open={true} onClose={() => setEditingBlog(null)}>
          <DialogTitle>Edit Blog</DialogTitle>
          <DialogContent>
            <TextField value={updatedTitle} onChange={(e) => setUpdatedTitle(e.target.value)} fullWidth />
            <TextField
              fullWidth
              label="Content"
              value={updatedContent}
              onChange={(e) => setUpdatedContent(e.target.value)}
              required
              margin="normal"
              multiline
              rows={4}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditingBlog(null)}>Cancel</Button>
            <Button onClick={handleUpdate} color="primary">Update</Button>
          </DialogActions>
        </Dialog>
      )}
      <ChatAssistant />
      </Container>
    </>
  );
};

export default Dashboard;
