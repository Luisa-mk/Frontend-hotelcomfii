import { useState, useEffect } from "react";
import axios from "axios";

export default function Habitaciones() {
  const [habitaciones, setHabitaciones] = useState([]);
  const [estadoFiltro, setEstadoFiltro] = useState("");
  const [nueva, setNueva] = useState({
    numero: "",
    tipo: "estándar",
    estado: "disponible",
  });
  const [editandoId, setEditandoId] = useState(null);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const fetchHabitaciones = async (estado = "") => {
    try {
      const res = await axios.get("http://localhost:8000/api/habitaciones", {
        headers: { Authorization: `Bearer ${token}` },
        params: estado ? { estado } : {},
      });
      setHabitaciones(res.data);
    } catch (err) {
      console.error(err);
      setError("Error al cargar habitaciones");
    }
  };

  useEffect(() => {
    fetchHabitaciones();
  }, []);

  const handleFiltro = (e) => {
    const estado = e.target.value;
    setEstadoFiltro(estado);
    fetchHabitaciones(estado);
  };

  const handleChangeNueva = (e) => {
    setNueva({ ...nueva, [e.target.name]: e.target.value });
  };

  const agregarHabitacion = async () => {
    try {
      await axios.post("http://localhost:8000/api/habitaciones", nueva, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Habitación agregada correctamente");
      setNueva({ numero: "", tipo: "estándar", estado: "disponible" });
      fetchHabitaciones(estadoFiltro);
    } catch (err) {
      if (err.response?.status === 422) {
        const errores = err.response.data.details;
        const mensaje = Object.values(errores).flat().join("\n");
        alert("Error de validación:\n" + mensaje);
      } else {
        alert("Error al agregar habitación");
      }
    }
  };

  const eliminarHabitacion = async (id) => {
    if (!window.confirm("¿Eliminar esta habitación?")) return;
    try {
      await axios.delete(`http://localhost:8000/api/habitaciones/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchHabitaciones(estadoFiltro);
    } catch (err) {
      alert("Error al eliminar");
    }
  };

  const guardarEdicion = async (habitacion) => {
    try {
      await axios.put(
        `http://localhost:8000/api/habitaciones/${habitacion.id}`,
        habitacion,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Habitación actualizada");
      setEditandoId(null);
      fetchHabitaciones(estadoFiltro);
    } catch (err) {
      alert("Error al actualizar");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Catálogo de Habitaciones</h2>

      <label>Filtrar por estado: </label>
      <select value={estadoFiltro} onChange={handleFiltro}>
        <option value="">Todas</option>
        <option value="disponible">Disponible</option>
        <option value="ocupada">Ocupada</option>
        <option value="reservada">Reservada</option>
        <option value="limpieza">Limpieza</option>
      </select>

      <h3 style={{ marginTop: "2rem" }}>Agregar nueva habitación</h3>
      <input
        name="numero"
        placeholder="Número"
        value={nueva.numero}
        onChange={handleChangeNueva}
      />
      <input
        name="tipo"
        placeholder="Tipo"
        value={nueva.tipo}
        onChange={handleChangeNueva}
      />
      <select name="estado" value={nueva.estado} onChange={handleChangeNueva}>
        <option value="disponible">Disponible</option>
        <option value="ocupada">Ocupada</option>
        <option value="reservada">Reservada</option>
        <option value="limpieza">Limpieza</option>
      </select>
      <button onClick={agregarHabitacion}>Agregar</button>

      <table border="1" cellPadding="8" style={{ marginTop: "2rem" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Número</th>
            <th>Tipo</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {habitaciones.map((h) => (
            <tr key={h.id}>
              <td>{h.id}</td>
              <td>
                {editandoId === h.id ? (
                  <input
                    value={h.numero}
                    onChange={(e) =>
                      setHabitaciones((prev) =>
                        prev.map((r) =>
                          r.id === h.id ? { ...r, numero: e.target.value } : r
                        )
                      )
                    }
                  />
                ) : (
                  h.numero
                )}
              </td>
              <td>
                {editandoId === h.id ? (
                  <input
                    value={h.tipo}
                    onChange={(e) =>
                      setHabitaciones((prev) =>
                        prev.map((r) =>
                          r.id === h.id ? { ...r, tipo: e.target.value } : r
                        )
                      )
                    }
                  />
                ) : (
                  h.tipo
                )}
              </td>
              <td>
                {editandoId === h.id ? (
                  <select
                    value={h.estado}
                    onChange={(e) =>
                      setHabitaciones((prev) =>
                        prev.map((r) =>
                          r.id === h.id ? { ...r, estado: e.target.value } : r
                        )
                      )
                    }
                  >
                    <option value="disponible">Disponible</option>
                    <option value="ocupada">Ocupada</option>
                    <option value="reservada">Reservada</option>
                    <option value="limpieza">Limpieza</option>
                  </select>
                ) : (
                  h.estado
                )}
              </td>
              <td>
                {editandoId === h.id ? (
                  <>
                    <button onClick={() => guardarEdicion(h)}>Guardar</button>
                    <button onClick={() => setEditandoId(null)}>Cancelar</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => setEditandoId(h.id)}>Editar</button>
                    <button onClick={() => eliminarHabitacion(h.id)}>
                      Eliminar
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}