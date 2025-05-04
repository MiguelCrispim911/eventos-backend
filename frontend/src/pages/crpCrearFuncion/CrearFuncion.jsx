import { useState } from "react";
import "./CrearFuncion.css";

const CrearFuncion = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    fecha: "",
    hora_inicio: "",
    id_evento: "",
    id_ubicacion: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
      const response = await fetch("http://localhost:8000/funciones/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Error al crear función");
      }

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
      console.error("Error:", error.message);
      alert("Ocurrió un error: " + error.message);
    }
  };

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