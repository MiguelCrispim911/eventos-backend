import { useState } from "react";
import "./CrearAdministrador.css";

const CrearAdministrador = ({ username }) => {
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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (formData.password !== formData.confirmPassword) {
      alert("Las contraseñas no coinciden.");
      return;
    }
  
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
      const response = await fetch("http://localhost:8000/administradores/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });
  
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Error al registrar administrador");
      }
  
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
      console.error("Error al enviar los datos:", error.message);
      alert("Ocurrió un error: " + error.message);
    }
  };

  return (
    <div className="crear-administrador-container">
      <form onSubmit={handleSubmit} className="crear-administrador-form">
        <h2 className="form-title">Registro de Usuario</h2>

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

        <button type="submit" className="submit-button">
          Registrar
        </button>
      </form>
    </div>
  );
};

export default CrearAdministrador;