"use client";
import Navbar from "@/components/Navbar";
import { Container, Typography, Box, Button, Card, CardContent, Grid } from "@mui/material";

const dummyBlogs = [
  { id: 1, title: "The Rise of AI in Blogging", content: "AI-generated content is changing the way we write blogs..." },
  { id: 2, title: "How to Write a Blog Using AI", content: "Discover how AI tools can help you generate engaging content..." },
  { id: 3, title: "AI vs Human Writing: What's the Future?", content: "Will AI replace human bloggers, or will it be a collaborative tool?" }
];

export default function Home() {
  return (
    <>
      <Navbar />
      <Container maxWidth="md">
        {/* Hero Section */}
        <Box textAlign="center" mt={5}>
          <Typography variant="h3" fontWeight="bold">
            Welcome to AI Blog
          </Typography>
          <Typography variant="h6" color="textSecondary" mt={2}>
            Generate and explore AI-powered blog content
          </Typography>
          <Button variant="contained" color="primary" sx={{ mt: 3 }} href="/generate">
            Generate Blog with AI
          </Button>
        </Box>

        {/* Recent Blogs */}
        <Box mt={5}>
          <Typography variant="h5" fontWeight="bold" mb={3}>
            Recent Blogs
          </Typography>
          <Grid container spacing={3}>
            {dummyBlogs.map((blog) => (
              <Grid item xs={12} sm={6} md={4} key={blog.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold">
                      {blog.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" mt={1}>
                      {blog.content.substring(0, 50)}...
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </>
  );
}
