import { useState } from "react";
import "./CrearUbicacion.css"; // Archivo CSS adjunto

const CrearUbicacion = () => {
  // Estado para almacenar los datos del formulario
  const [formData, setFormData] = useState({
    nombre: "",
    persona_contacto: "",
    telefono: "",
    direccion: "",
    municipio: "",
    departamento: "",
    email: "",
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
    // ... (tu lógica existente de submit)
  };

  return (
    <div className="crear-ubicacion-container">
      <form onSubmit={handleSubmit} className="crear-ubicacion-form">
        <h2 className="form-title">Registro de Ubicación</h2>

        {/* Genera los campos del formulario dinámicamente */}
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

        {/* Botón para enviar el formulario */}
        <button type="submit" className="submit-button">
          Registrar Ubicación
        </button>
      </form>
    </div>
  );
};

export default CrearUbicacion;