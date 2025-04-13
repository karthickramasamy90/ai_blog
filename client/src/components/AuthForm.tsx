import { Box, Button, TextField, Typography, Container } from "@mui/material";
import { useState } from "react";

interface AuthFormProps {
  type: "login" | "register";
  onSubmit: (formData: { email: string; password: string }) => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ type, onSubmit }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Container maxWidth="xs">
      <Box textAlign="center" mt={5}>
        <Typography variant="h4" fontWeight="bold">
          {type === "login" ? "Login" : "Register"}
        </Typography>
      </Box>
      <Box component="form" onSubmit={handleSubmit} mt={3}>
        <TextField
          fullWidth
          label="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          margin="normal"
          required
        />
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
          {type === "login" ? "Login" : "Register"}
        </Button>
      </Box>
    </Container>
  );
};

export default AuthForm;
