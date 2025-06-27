import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError("Ambos campos son obligatorios.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:8000/api/login", form, {
        headers: { "Content-Type": "application/json" },
      });

      const token = res.data.token;
      const user = res.data.user;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      if (user.role === "cliente") navigate("/catalogo");
      else if (user.role === "hotel") navigate("/dashboard-hotel");
      else if (user.role === "administrador") navigate("/admin");
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Credenciales inválidas.");
      } else {
        setError("Error al iniciar sesión. Intenta más tarde.");
      }
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Correo"
          value={form.email}
          onChange={handleChange}
        /><br /><br />

        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={handleChange}
        /><br /><br />

        <button type="submit">Iniciar sesión</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <p style={{ marginTop: "1rem" }}>
        ¿No tienes cuenta?{" "}
        <Link to="/registro">Regístrate</Link>
      </p>
    </div>
  );
}