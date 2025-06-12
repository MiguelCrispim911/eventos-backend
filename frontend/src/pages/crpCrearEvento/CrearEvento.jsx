import { useState, useEffect } from "react";
import "./CrearEvento.css";

// Componente principal para crear un evento
function CrearEvento() {
  const [admins, setAdmins] = useState([]);
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    foto_principal: "",
    foto_secundaria: "",
    cedula_adm: "",
    estado: 1,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Cargar la lista de administradores cuando el componente se monte
    const fetchAdmins = async () => {
      try {
        const response = await fetch("http://localhost:8000/administradores/");
        if (!response.ok) throw new Error("Error al cargar administradores");
        const data = await response.json();
        setAdmins(data);
      } catch (error) {
        console.error("Error:", error);
        alert("Error al cargar la lista de administradores");
      }
    };
    fetchAdmins();
  }, []);

  const validateForm = () => {
    const newErrors = {};

    // Validar nombre
    if (formData.nombre.length > 50) {
      newErrors.nombre = "El nombre no puede exceder los 50 caracteres";
    }

    // Validar descripción
    if (formData.descripcion.length > 250) {
      newErrors.descripcion = "La descripción no puede exceder los 250 caracteres";
    }

    // Validar selección de administrador
    if (!formData.cedula_adm) {
      newErrors.cedula_adm = "Debe seleccionar un administrador";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  // Maneja el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return; // No enviar si hay errores
    }

    try {
      // Realiza la solicitud POST al backend para crear el evento
      const response = await fetch("http://localhost:8000/eventos/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          cedula_adm: parseInt(formData.cedula_adm), // Convierte la cédula a número
          estado: 1,
        }),
      });

      if (!response.ok) {
        throw new Error("Error en la solicitud");
      }

      const data = await response.json();
      console.log("Evento creado:", data);
      alert("Evento creado con éxito");

      // Limpiar el formulario
      setFormData({
        nombre: "",
        descripcion: "",
        foto_principal: "",
        foto_secundaria: "",
        cedula_adm: "",
        estado: 1,
      });
    } catch (error) {
      console.error("Error al enviar los datos:", error.message);
      alert("Error al crear el evento. Verifica los datos.");
    }
  };

  return (
    <div className="crear-evento-container">
      <form onSubmit={handleSubmit} className="crear-evento-form">
        <h2 className="form-title">Crear Evento</h2>

        {/* Campo para el nombre del evento */}
        <label className="form-label">
          Nombre:
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className={`form-input ${errors.nombre ? "error" : ""}`}
            maxLength={50}
            required
          />
          {errors.nombre && (
            <span className="error-message">{errors.nombre}</span>
          )}
        </label>

        {/* Campo para la descripción */}
        <label className="form-label">
          Descripción:
          <textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            className={`form-input textarea ${
              errors.descripcion ? "error" : ""
            }`}
            maxLength={250}
            rows={4}
            required
          />
          {errors.descripcion && (
            <span className="error-message">{errors.descripcion}</span>
          )}
        </label>

        {/* Campo para la foto principal */}
        <label className="form-label">
          Foto principal (URL):
          <input
            type="url"
            name="foto_principal"
            value={formData.foto_principal}
            onChange={handleChange}
            className={`form-input ${errors.foto_principal ? "error" : ""}`}
            placeholder="https://ejemplo.com/imagen.jpg"
            required
          />
        </label>

        {/* Campo para la foto secundaria */}
        <label className="form-label">
          Foto secundaria (URL):
          <input
            type="url"
            name="foto_secundaria"
            value={formData.foto_secundaria}
            onChange={handleChange}
            className={`form-input ${errors.foto_secundaria ? "error" : ""}`}
            placeholder="https://ejemplo.com/imagen.jpg"
            required
          />
        </label>

        {/* Campo para la cédula del administrador */}
        <label className="form-label">
          Administrador:
          <select
            name="cedula_adm"
            value={formData.cedula_adm}
            onChange={handleChange}
            className={`form-input ${errors.cedula_adm ? "error" : ""}`}
            required
          >
            <option value="">Seleccione un administrador</option>
            {admins.map((admin) => (
              <option key={admin.cedula_adm} value={admin.cedula_adm}>
                {admin.cedula_adm} - {admin.nombres} {admin.apellidos}
              </option>
            ))}
          </select>
          {errors.cedula_adm && (
            <span className="error-message">{errors.cedula_adm}</span>
          )}
        </label>

        {/* Botón para enviar el formulario */}
        <button type="submit" className="submit-button">
          Crear Evento
        </button>
      </form>
    </div>
  );
}

export default CrearEvento;