import axios from "axios";
import React, { useEffect, useState } from "react";
axios.defaults.withCredentials = true;
let firstRender = true;
const Welcome = () => {
  const [user, setUser] = useState();
  const refreshToken = async () => {
    const res = await axios
      .get("http://localhost:5000/api/refresh", {
        withCredentials: true,
      })
      .catch((error) => console.log(error));

    const data = await res.data;

    return data;
  };
  const sendRequest = async () => {
    const res = await axios
      .get("http://localhost:5000/api/user", {
        withCredentials: true,
      })
      .catch((error) => console.log(error));

    const data = await res.data;
    //console.log(data.message.name);
    return data;
  };
  useEffect(() => {
    if (firstRender) {
      firstRender = false;
      sendRequest().then((data) => setUser(data));
    }
    let interval = setInterval(() => {
      refreshToken().then((data) => setUser(data));
    }, 1000 * 28);
    return () => clearInterval(interval);
  }, []);
  return <div>{user && <h1> Hi {user.message.name}</h1>}</div>;
};

export default Welcome;
