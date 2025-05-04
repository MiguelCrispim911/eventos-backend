import { useState } from "react";
import "./CrearUbicacion.css"; // Archivo CSS adjunto

const CrearUbicacion = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    persona_contacto: "",
    telefono: "",
    direccion: "",
    municipio: "",
    departamento: "",
    email: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // ... (tu lógica existente de submit)
  };

  return (
    <div className="crear-ubicacion-container">
      <form onSubmit={handleSubmit} className="crear-ubicacion-form">
        <h2 className="form-title">Registro de Ubicación</h2>

        {[
          { label: "Nombre", name: "nombre" },
          { label: "Persona de Contacto", name: "persona_contacto" },
          { label: "Teléfono", name: "telefono" },
          { label: "Dirección", name: "direccion" },
          { label: "Municipio", name: "municipio" },
          { label: "Departamento", name: "departamento" },
          { label: "Email", name: "email", type: "email" },
        ].map(({ label, name, type = "text" }) => (
          <label className="form-label" key={name}>
            {label}:
            <input
              type={type}
              name={name}
              value={formData[name]}
              onChange={handleChange}
              className="form-input"
              required
            />
          </label>
        ))}

        <button type="submit" className="submit-button">
          Registrar Ubicación
        </button>
      </form>
    </div>
  );
};

export default CrearUbicacion;