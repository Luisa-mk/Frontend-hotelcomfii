import { useEffect, useState } from "react";
import axios from "axios";

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [rol, setRol] = useState("");
  const [error, setError] = useState("");
  const [nuevo, setNuevo] = useState({ name: "", email: "", password: "", role: "cliente" });
  const [editando, setEditando] = useState(null);

  const fetchUsuarios = async (rol = "") => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get("http://localhost:8000/api/usuarios", {
        headers: { Authorization: `Bearer ${token}` },
        params: rol ? { rol } : {},
      });

      setUsuarios(res.data);
    } catch (err) {
      setError("No se pudieron cargar los usuarios.");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const handleChange = (e) => {
    setRol(e.target.value);
    fetchUsuarios(e.target.value);
  };

  const handleNuevoChange = (e) => {
    setNuevo({ ...nuevo, [e.target.name]: e.target.value });
  };

  const agregarUsuario = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.post("http://localhost:8000/api/usuarios", nuevo, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setNuevo({ name: "", email: "", password: "", role: "cliente" });
      fetchUsuarios(rol);
    } catch (err) {
      setError("Error al agregar usuario.");
      console.error(err);
    }
  };

  const editarUsuario = (usuario) => {
    setEditando({ ...usuario });
  };

  const guardarEdicion = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(`http://localhost:8000/api/usuarios/${editando.id}`, editando, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setEditando(null);
      fetchUsuarios(rol);
    } catch (err) {
      setError("Error al editar usuario.");
      console.error(err);
    }
  };

  const eliminarUsuario = async (id) => {
    if (!window.confirm("¿Eliminar este usuario?")) return;

    try {
      const token = localStorage.getItem("token");

      await axios.delete(`http://localhost:8000/api/usuarios/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchUsuarios(rol);
    } catch (err) {
      setError("Error al eliminar usuario.");
      console.error(err);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Catálogo de Usuarios</h2>

      <label>Filtrar por rol:</label>
      <select value={rol} onChange={handleChange}>
        <option value="">Todos</option>
        <option value="cliente">Cliente</option>
        <option value="hotel">Hotel</option>
        <option value="administrador">Administrador</option>
      </select>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <h3>Agregar nuevo usuario</h3>
      <input name="name" placeholder="Nombre" value={nuevo.name} onChange={handleNuevoChange} />
      <input name="email" placeholder="Correo" value={nuevo.email} onChange={handleNuevoChange} />
      <input name="password" type="password" placeholder="Contraseña" value={nuevo.password} onChange={handleNuevoChange} />
      <select name="role" value={nuevo.role} onChange={handleNuevoChange}>
        <option value="cliente">Cliente</option>
        <option value="hotel">Hotel</option>
        <option value="administrador">Administrador</option>
      </select>
      <button onClick={agregarUsuario}>Agregar</button>

      <h3 style={{ marginTop: "2rem" }}>Lista de usuarios</h3>
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>ID</th><th>Nombre</th><th>Email</th><th>Rol</th><th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>
                {editando?.id === u.id ? (
                  <input name="name" value={editando.name} onChange={(e) => setEditando({ ...editando, name: e.target.value })} />
                ) : u.name}
              </td>
              <td>
                {editando?.id === u.id ? (
                  <input name="email" value={editando.email} onChange={(e) => setEditando({ ...editando, email: e.target.value })} />
                ) : u.email}
              </td>
              <td>
                {editando?.id === u.id ? (
                  <select name="role" value={editando.role} onChange={(e) => setEditando({ ...editando, role: e.target.value })}>
                    <option value="cliente">Cliente</option>
                    <option value="hotel">Hotel</option>
                    <option value="administrador">Administrador</option>
                  </select>
                ) : u.role}
              </td>
              <td>
                {editando?.id === u.id ? (
                  <>
                    <button onClick={guardarEdicion}>Guardar</button>
                    <button onClick={() => setEditando(null)}>Cancelar</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => editarUsuario(u)}>Editar</button>
                    <button onClick={() => eliminarUsuario(u.id)}>Eliminar</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}