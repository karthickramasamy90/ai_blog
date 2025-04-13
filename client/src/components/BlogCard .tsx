import ReactMarkdown from "react-markdown";
import { Grid, Card, CardContent, Typography, Button, Box } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { useState } from "react";

  
const BlogCard = ({ blog, onEdit, onDelete }: { blog: any, onEdit: (blog: any) => void, onDelete: (id: number) => void }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => setExpanded(!expanded);

  const contentPreview = blog.content.split(" ").slice(0, 60).join(" ") + " ...";

  return (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <CardContent>
        <Typography
            variant="h6"
            gutterBottom
            sx={{
                fontWeight: 600,
                color: "primary.main",
                textTransform: "capitalize",
                fontSize: "1.2rem",
                mb: 1,
                borderBottom: "2px solid",
                borderColor: "primary.light",
                paddingBottom: "4px",
                transition: "all 0.3s ease",
                "&:hover": {
                    color: "secondary.main",
                    cursor: "pointer",
                },
            }}
        >
          {blog.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <ReactMarkdown>
            {expanded ? blog.content : contentPreview}
          </ReactMarkdown>
        </Typography>
        <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
            <Button
                onClick={toggleExpand}
                size="small"
                sx={{
                    mt: 1,
                    color: "primary.main",
                    fontWeight: "bold",
                    textTransform: "none",
                    padding: "4px 12px",
                    borderRadius: "6px",
                    backgroundColor: "#f0f0f0",
                    "&:hover": {
                    backgroundColor: "#e0e0e0",
                    color: "secondary.main",
                    },
                }}
                >
                {expanded ? "Show Less" : "Show More"}
            </Button>
            <Box display="flex" gap={1}>
                <Tooltip title="Edit">
                    <IconButton
                    onClick={() => onEdit(blog)}
                    size="small"
                    sx={{ color: "primary.main" }}
                    >
                    <EditIcon />
                    </IconButton>
                </Tooltip>

                <Tooltip title="Delete">
                    <IconButton
                    onClick={() => onDelete(blog.id)}
                    size="small"
                    sx={{ color: "error.main" }}
                    >
                    <DeleteIcon />
                    </IconButton>
                </Tooltip>
            </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default BlogCard;
