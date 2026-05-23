import { useState } from "react";
import axios from "axios";
import "../App.css";
import { useNavigate } from "react-router-dom";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const register = async () => {
    await axios.post("http://localhost:5000/api/auth/register", {
      username,
      password
    });

    alert("Account created!");
    navigate("/login");
  };

  return (
    <div>
      <h2>Register</h2>
      <input onChange={(e) => setUsername(e.target.value)} placeholder="username" />
      <input type="password" onChange={(e) => setPassword(e.target.value)} placeholder="password" />
      <button onClick={register}>Register</button>
    </div>
  );
}

export default Register;