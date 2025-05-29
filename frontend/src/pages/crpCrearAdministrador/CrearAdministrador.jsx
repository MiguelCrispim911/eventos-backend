import { useState } from "react";
import "./CrearAdministrador.css";

// Componente principal para crear un administrador
const CrearAdministrador = ({ username }) => {
  // Estado para manejar los datos del formulario
  const [formData, setFormData] = useState({
    cedula: "",
    nombres: "",
    apellidos: "",
    direccion: "",
    municipio: "",
    departamento: "",
    email: "",
    telefono: "",
    password: "",
    confirmPassword: "",
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

    // Verifica que las contraseñas coincidan
    if (formData.password !== formData.confirmPassword) {
      alert("Las contraseñas no coinciden.");
      return;
    }

    // Prepara los datos para enviar al backend
    const dataToSend = {
      cedula_adm: parseInt(formData.cedula),
      nombres: formData.nombres,
      apellidos: formData.apellidos,
      direccion: formData.direccion,
      municipio: formData.municipio,
      departamento: formData.departamento,
      email: formData.email,
      telefono: formData.telefono,
      contrasena: formData.password,
      estado: 1
    };

    try {
      // Envía los datos al backend
      const response = await fetch("http://localhost:8000/administradores/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      // Maneja errores de la respuesta
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Error al registrar administrador");
      }

      // Si todo sale bien, limpia el formulario y muestra mensaje
      const result = await response.json();
      console.log("Administrador creado:", result);
      alert("Administrador registrado con éxito");
      setFormData({
        cedula: "",
        nombres: "",
        apellidos: "",
        direccion: "",
        municipio: "",
        departamento: "",
        email: "",
        telefono: "",
        password: "",
        confirmPassword: "",
      });
    } catch (error) {
      // Maneja errores de red o del backend
      console.error("Error al enviar los datos:", error.message);
      alert("Ocurrió un error: " + error.message);
    }
  };

  // Renderiza el formulario
  return (
    <div className="crear-administrador-container">
      <form onSubmit={handleSubmit} className="crear-administrador-form">
        <h2 className="form-title">Registro de Usuario</h2>

        {/* Campo para la cédula */}
        <label className="form-label">
          Cédula:
          <input
            type="number"
            name="cedula"
            value={formData.cedula}
            onChange={handleChange}
            className="form-input"
            required
          />
        </label>

        {/* Campo para los nombres */}
        <label className="form-label">
          Nombres:
          <input
            type="text"
            name="nombres"
            value={formData.nombres}
            onChange={handleChange}
            className="form-input"
            required
          />
        </label>

        {/* Campo para los apellidos */}
        <label className="form-label">
          Apellidos:
          <input
            type="text"
            name="apellidos"
            value={formData.apellidos}
            onChange={handleChange}
            className="form-input"
            required
          />
        </label>

        {/* Campo para la dirección */}
        <label className="form-label">
          Dirección:
          <input
            type="text"
            name="direccion"
            value={formData.direccion}
            onChange={handleChange}
            className="form-input"
          />
        </label>

        {/* Campo para el municipio */}
        <label className="form-label">
          Municipio:
          <input
            type="text"
            name="municipio"
            value={formData.municipio}
            onChange={handleChange}
            className="form-input"
          />
        </label>

        {/* Campo para el departamento */}
        <label className="form-label">
          Departamento:
          <input
            type="text"
            name="departamento"
            value={formData.departamento}
            onChange={handleChange}
            className="form-input"
          />
        </label>

        {/* Campo para el email */}
        <label className="form-label">
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="form-input"
            required
          />
        </label>

        {/* Campo para el teléfono */}
        <label className="form-label">
          Teléfono:
          <input
            type="text"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            className="form-input"
          />
        </label>

        {/* Campo para la contraseña */}
        <label className="form-label">
          Contraseña:
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="form-input"
            required
          />
        </label>

        {/* Campo para confirmar la contraseña */}
        <label className="form-label">
          Confirmar Contraseña:
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="form-input"
            required
          />
        </label>

        {/* Botón para enviar el formulario */}
        <button type="submit" className="submit-button">
          Registrar
        </button>
      </form>
    </div>
  );
};

export default CrearAdministrador;