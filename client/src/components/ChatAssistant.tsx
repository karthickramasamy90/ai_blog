"use client";

import { useEffect, useState, useRef } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Stack,
  CircularProgress
} from "@mui/material";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import MicIcon from "@mui/icons-material/Mic";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

interface Message {
  role: "user" | "model";
  text: string;
}
type SpeechRecognition = any;
type SpeechRecognitionEvent = Event & {
    results: {
      [index: number]: {
        0: {
          transcript: string;
        };
        isFinal: boolean;
      };
    };
  };

const ChatAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);

  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

   useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Start chat session when component mounts
    useEffect(() => {
        const startChat = async () => {
        try {
            await axios.post("http://localhost:3001/ai/start-chat");
        } catch (err) {
            console.error("Failed to start chat:", err);
        }
        };

        startChat();
    }, []);

    // Initialize speech recognition
    useEffect(() => {
    const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (SpeechRecognition) {
            const recognition = new SpeechRecognition();
            recognition.lang = "en-US";
            recognition.interimResults = false;
            recognition.maxAlternatives = 1;

            recognition.onstart = () => setListening(true);
            recognition.onend = () => setListening(false);
            recognition.onerror = (event: any) => {
            console.error("Speech recognition error", event);
            setListening(false);
            };
            recognition.onresult = (event: SpeechRecognitionEvent) => {
            const transcript = event.results[0][0].transcript;
            setInput(transcript);
            };

            recognitionRef.current = recognition;
        }
    }, []);

    // Voice button click handler
    const handleVoiceInput = () => {
        if (recognitionRef.current) {
        recognitionRef.current.start();
        }
    };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const updatedMessages: Message[] = [
      ...messages,
      { role: "user", text: input },
    ];

    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:3001/ai/chat", {
        message: input,
        history: updatedMessages,
      });

      const reply = response.data.reply;

      setMessages((prev) => [...prev, { role: "model", text: reply }]);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        AI Q&A Assistant
      </Typography>

      <Paper
        variant="outlined"
        sx={{ p: 2, mb: 2, maxHeight: 400, overflowY: "auto" }}
      >
        <Stack spacing={1}>
          {/* {messages.map((msg, idx) => (
            <Box
              key={idx}
              sx={{
                alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                backgroundColor: msg.role === "user" ? "#1976d2" : "#f0f0f0",
                color: msg.role === "user" ? "white" : "black",
                p: 1,
                borderRadius: 2,
                maxWidth: "75%",
                whiteSpace: "pre-wrap", // preserves line breaks
              }}
            >
              {msg.text.split("\n").map((line, i) => (
                <Typography key={i} variant="body2">
                  {line}
                </Typography>
              ))}
            </Box>
          ))} */}

            {messages.map((msg, idx) => (
                <Box
                key={idx}
                sx={{
                    alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                    backgroundColor: msg.role === "user" ? "#1976d2" : "#f0f0f0",
                    color: msg.role === "user" ? "white" : "black",
                    p: 1,
                    borderRadius: 2,
                    maxWidth: "75%",
                }}
                >
                <Typography variant="body2">
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                </Typography>
                </Box>
            ))}       

            {loading && (
                <Box
                    sx={{
                    alignSelf: "flex-start",
                    backgroundColor: "#f0f0f0",
                    p: 1,
                    borderRadius: 2,
                    maxWidth: "75%",
                    display: "flex",
                    alignItems: "center",
                    }}
                >
                    <CircularProgress size={16} sx={{ mr: 1 }} />
                    <Typography variant="body2">Typing...</Typography>
                    <div ref={chatEndRef} />
                </Box>
            )}
        </Stack>
      </Paper>

      <Box display="flex" gap={1}>
        <TextField
          fullWidth
          variant="outlined"
          size="small"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question..."
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
        />
        <Tooltip title="Voice Input">
            <IconButton onClick={handleVoiceInput} color={listening ? "primary" : "default"}>
                <MicIcon />
            </IconButton>
        </Tooltip>
        <Button
          variant="contained"
          onClick={sendMessage}
          disabled={loading || !input.trim()}
        >
          Send
        </Button>
      </Box>
    </Box>
  );
};

export default ChatAssistant;
