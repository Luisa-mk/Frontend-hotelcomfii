import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "cliente"
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setMessage("");

    if (!form.name || !form.email || !form.password || !form.role) {
      setMessage("Todos los campos son obligatorios.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:8000/api/register", form, {
        headers: { "Content-Type": "application/json" },
      });

      setMessage("Registro exitoso. Redirigiendo...");
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      const role = res.data.user.role;
      if (role === "cliente") navigate("/catalogo");
      else if (role === "hotel") navigate("/dashboard-hotel");
      else if (role === "administrador") navigate("/admin");
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors);
      } else {
        setMessage("Error al registrar. Intenta más tarde.");
      }
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Registro</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Nombre"
          value={form.name}
          onChange={handleChange}
        /><br />
        {errors.name && <span style={{ color: "red" }}>{errors.name[0]}</span>}
        <br /><br />

        <input
          type="email"
          name="email"
          placeholder="Correo"
          value={form.email}
          onChange={handleChange}
        /><br />
        {errors.email && <span style={{ color: "red" }}>{errors.email[0]}</span>}
        <br /><br />

        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={handleChange}
        /><br />
        {errors.password && <span style={{ color: "red" }}>{errors.password[0]}</span>}
        <br /><br />

        <select name="role" value={form.role} onChange={handleChange}>
          <option value="cliente">Cliente</option>
          <option value="hotel">Hotel</option>
          <option value="administrador">Administrador</option>
        </select>
        {errors.role && <span style={{ color: "red" }}>{errors.role[0]}</span>}
        <br /><br />

        <button type="submit">Registrar</button>
      </form>

      {message && <p style={{ color: message.includes("error") ? "red" : "green" }}>{message}</p>}

      <p style={{ marginTop: "1rem" }}>
        ¿Ya tienes cuenta?{" "}
        <Link to="/">Iniciar sesión</Link>
      </p>
    </div>
  );
}