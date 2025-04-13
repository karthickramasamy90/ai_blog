// components/AIChat.tsx
"use client";

import { useState } from "react";
import { Box, Button, TextField, Typography, CircularProgress, Container } from "@mui/material";
import axios from "axios";
import Navbar from "./Navbar";

const AIChat = () => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!question.trim()) return;
    setLoading(true);
    setAnswer("");

    try {
      const res = await axios.post("http://localhost:3001/ai/ask", {
        prompt: question,
      });

      setAnswer(res.data.answer);
    } catch (error) {
      console.error("Error generating answer:", error);
      setAnswer("Oops! Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
        <Navbar />
        <Container sx={{ mt: 5 }}>
            <Box sx={{ maxWidth: 600, mx: "auto", mt: 4, px: 2 }}>
            <Typography variant="h4" gutterBottom>
                AI Q&A Assistant
            </Typography>

            <TextField
                label="Ask a question"
                fullWidth
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                multiline
                rows={3}
                variant="outlined"
            />

            <Button
                variant="contained"
                onClick={handleAsk}
                sx={{ mt: 2 }}
                disabled={loading}
            >
                {loading ? <CircularProgress size={24} /> : "Ask"}
            </Button>

            {answer && (
                <Box mt={3}>
                <Typography variant="subtitle1" gutterBottom>
                    Answer:
                </Typography>
                <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
                    {answer}
                </Typography>
                </Box>
            )}
            </Box>
        </Container>    
    </>
  );
};

export default AIChat;
