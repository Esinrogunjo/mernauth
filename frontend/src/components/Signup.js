import { Box, TextField, Button, Typography } from "@mui/material";
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const history = useNavigate();
  const [input, setInput] = useState({
    name: "",
    email: "",
    password: "",
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    sendRequest().then(() => history("/login"));
  };
  const handleChange = (e) => {
    setInput((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const sendRequest = async () => {
    const res = await axios
      .post("http://localhost:5000/api/signup", {
        name: input.name,
        email: input.email,
        password: input.password,
      })
      .catch((error) => console.log(error));

    const data = await res.data;
    return data;
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Box
          width={300}
          marginLeft={"auto"}
          marginRight={"auto"}
          display={"flex"}
          flexDirection={"column"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Typography variant="h2">Signup </Typography>

          <TextField
            name={"name"}
            value={input.name}
            variant={"outlined"}
            placeholder={"Name"}
            margin={"normal"}
            onChange={handleChange}
          />
          <TextField
            name={"email"}
            type={"email"}
            value={input.email}
            variant={"outlined"}
            placeholder={"Email"}
            margin={"normal"}
            onChange={handleChange}
          />
          <TextField
            name={"password"}
            type={"password"}
            value={input.password}
            variant={"outlined"}
            placeholder={"Password"}
            margin={"normal"}
            onChange={handleChange}
          />
          <Button variant="contained" type="submit">
            Signup
          </Button>
        </Box>
      </form>
    </div>
  );
};

export default Signup;
