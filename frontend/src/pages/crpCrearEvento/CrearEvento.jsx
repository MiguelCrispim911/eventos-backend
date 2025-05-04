import { useState } from "react";
import "./CrearEvento.css";

function CrearEvento() {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    foto_principal: "",
    foto_secundaria: "",
    cedula_adm: "",
    estado: 1,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8000/eventos/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          cedula_adm: parseInt(formData.cedula_adm),
          estado: 1,
        }),
      });

      if (!response.ok) {
        throw new Error("Error en la solicitud");
      }

      const data = await response.json();
      console.log("Evento creado:", data);
      alert("Evento creado con éxito");
    } catch (error) {
      console.error("Error al enviar los datos:", error.message);
      alert("Error al crear el evento. Verifica los datos.");
    }
  };

  return (
    <div className="crear-evento-container">
      <form onSubmit={handleSubmit} className="crear-evento-form">
        <h2 className="form-title">Crear Evento</h2>

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
          <input
            type="text"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            className="form-input"
            required
          />
        </label>

        <label className="form-label">
          Foto principal (URL):
          <input
            type="text"
            name="foto_principal"
            value={formData.foto_principal}
            onChange={handleChange}
            className="form-input"
            required
          />
        </label>

        <label className="form-label">
          Foto secundaria (URL):
          <input
            type="text"
            name="foto_secundaria"
            value={formData.foto_secundaria}
            onChange={handleChange}
            className="form-input"
            required
          />
        </label>

        <label className="form-label">
          Cédula del administrador:
          <input
            type="number"
            name="cedula_adm"
            value={formData.cedula_adm}
            onChange={handleChange}
            className="form-input"
            required
          />
        </label>

        <button type="submit" className="submit-button">
          Crear Evento
        </button>
      </form>
    </div>
  );
}

export default CrearEvento;