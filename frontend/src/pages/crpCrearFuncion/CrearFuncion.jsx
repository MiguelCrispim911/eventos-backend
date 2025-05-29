import { useState } from "react";
import "./CrearFuncion.css";

// Componente principal para crear una función
const CrearFuncion = () => {
  // Estado para almacenar los datos del formulario
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    fecha: "",
    hora_inicio: "",
    id_evento: "",
    id_ubicacion: ""
  });

  // Maneja los cambios en los campos del formulario
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Maneja el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepara los datos para enviar al backend
    const dataToSend = {
      nombre: formData.nombre,
      descripcion: formData.descripcion,
      fecha: formData.fecha,
      hora_inicio: formData.hora_inicio,
      id_evento: parseInt(formData.id_evento),
      id_ubicacion: parseInt(formData.id_ubicacion),
      estado: 1,
    };

    try {
      // Realiza la petición POST al backend
      const response = await fetch("http://localhost:8000/funciones/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      // Si la respuesta no es exitosa, lanza un error
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Error al crear función");
      }

      // Muestra mensaje de éxito y limpia el formulario
      const result = await response.json();
      console.log("Función creada:", result);
      alert("Función registrada con éxito");

      setFormData({
        nombre: "",
        descripcion: "",
        fecha: "",
        hora_inicio: "",
        id_evento: "",
        id_ubicacion: ""
      });
    } catch (error) {
      // Maneja errores y muestra alerta
      console.error("Error:", error.message);
      alert("Ocurrió un error: " + error.message);
    }
  };

  // Renderiza el formulario
  return (
    <div className="crear-funcion-container">
      <form onSubmit={handleSubmit} className="crear-funcion-form">
        <h2 className="form-title">Crear Función</h2>

        <label className="form-label">
          Nombre:
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className="form-input"
            required
          />
        </label>

        <label className="form-label">
          Descripción:
          <textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            className="form-input"
            required
          />
        </label>

        <label className="form-label">
          Fecha:
          <input
            type="date"
            name="fecha"
            value={formData.fecha}
            onChange={handleChange}
            className="form-input"
            required
          />
        </label>

        <label className="form-label">
          Hora de Inicio:
          <input
            type="time"
            name="hora_inicio"
            value={formData.hora_inicio}
            onChange={handleChange}
            className="form-input"
            required
          />
        </label>

        <label className="form-label">
          ID Evento:
          <input
            type="number"
            name="id_evento"
            value={formData.id_evento}
            onChange={handleChange}
            className="form-input"
            required
          />
        </label>

        <label className="form-label">
          ID Ubicación:
          <input
            type="number"
            name="id_ubicacion"
            value={formData.id_ubicacion}
            onChange={handleChange}
            className="form-input"
            required
          />
        </label>

        <button type="submit" className="submit-button">
          Crear Función
        </button>
      </form>
    </div>
  );
};

export default CrearFuncion;