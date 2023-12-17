import React from "react";
import { Paper, Typography, Grid, Button, Box } from "@mui/material";

// Import your icons
const Icon1 = `${process.env.PUBLIC_URL}/icons/profile.svg`;
const Icon2 = `${process.env.PUBLIC_URL}/icons/pharmacy.svg`;
const Icon3 = `${process.env.PUBLIC_URL}/icons/add.svg`;
const Icon4 = `${process.env.PUBLIC_URL}/icons/chat.svg`;
const Icon5 = `${process.env.PUBLIC_URL}/icons/orders.svg`;
const Icon6 = `${process.env.PUBLIC_URL}/icons/wallet.svg`;

const Dashboard = () => {
  // Define your data
  const papers = [
    {
      icon: Icon1,
      title: "Profile",
      description: "View/Edit Profile",
      cta: "View",
    },
    {
      icon: Icon2,
      title: "Pharmacy",
      description: "View all meds",
      cta: "View",
    },
    {
      icon: Icon3,
      title: "Add Medicine",
      description: "Add medicine to pharmacy",
      cta: "Add",
    },
    {
      icon: Icon4,
      title: "Chat",
      description: "Chat with doctors",
      cta: "Chat",
    },
    {
      icon: Icon5,
      title: "Sales",
      description: "View sales report of meds",
      cta: "View",
    },
    {
      icon: Icon6,
      title: "Wallet",
      description: "View wallet balance",
      cta: "View",
    },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Paper sx={{ p: 2, width: 1200, height: 600, pl: 5 }}>
        <Typography variant="h2" align="left" sx={{ pb: 10, pl: 4, pt: 5 }}>
          Dashboard
        </Typography>
        <Grid container spacing={5}>
          {papers.map((paper, index) => (
            <Grid item xs={6} sm={4} key={index}>
              <Paper
                sx={{
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <img
                  src={paper.icon}
                  alt={paper.title}
                  width="40"
                  height="40"
                />
                <Typography variant="h6" component="div">
                  {paper.title}
                </Typography>
                <Typography variant="body1">{paper.description}</Typography>
                <Button variant="contained" color="primary">
                  {paper.cta}
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Box>
  );
};

export default Dashboard;
