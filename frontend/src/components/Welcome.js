import axios from "axios";
import React, { useEffect, useState } from "react";
axios.defaults.withCredentials = true;
const Welcome = () => {
  const [user, setUser] = useState();
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
    sendRequest().then((data) => setUser(data));
  }, []);
  return <div>{user && <h1> Hi {user.message.name}</h1>}</div>;
};

export default Welcome;
