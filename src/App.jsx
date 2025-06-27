import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import Cliente from "./Cliente";
import Hotel from "./Hotel";
import Admin from "./Admin";
import Usuarios from "./Usuarios"; // Asegúrate de importar
import ProtectedRoute from "./ProtectedRoute";
import Habitaciones from "./Habitaciones";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/registro" element={<Register />} />

        <Route
          path="/catalogo"
          element={
            <ProtectedRoute roleRequired="cliente">
              <Cliente />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard-hotel"
          element={
            <ProtectedRoute roleRequired="hotel">
              <Hotel />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute roleRequired="administrador">
              <Admin />
            </ProtectedRoute>
          }
        />

        <Route path="/no-autorizado" element={<h2>Acceso no autorizado</h2>} />
        <Route path="/usuarios" element={<Usuarios />} />
        <Route path="/habitaciones" element={<Habitaciones />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
