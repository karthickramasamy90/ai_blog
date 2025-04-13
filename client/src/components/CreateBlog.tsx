"use client";

import { useState } from "react";
import { blogService } from "../services/blogService";
import { TextField, Button, Box, Typography } from "@mui/material";

const CreateBlog = ({ onBlogCreated }: { onBlogCreated: () => void }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    try {
      await blogService.createBlog(title, content);
      setTitle("");
      setContent("");
      onBlogCreated(); // Refresh the blog list
    } catch (error) {
      console.error("Error creating blog", error);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
      <Typography variant="h6" gutterBottom>Create New Blog</Typography>
      <TextField
        fullWidth
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        margin="normal"
      />
      <TextField
        fullWidth
        label="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
        margin="normal"
        multiline
        rows={4}
      />
      <Button type="submit" variant="contained" color="primary">
        Create Blog
      </Button>
    </Box>
  );
};

export default CreateBlog;
