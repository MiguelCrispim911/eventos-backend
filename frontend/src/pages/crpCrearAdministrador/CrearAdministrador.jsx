import NavAdmin from "../../components/NavAdmin"; // Ajusta la ruta según tu estructura
import { useState } from "react";

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
      estado: 1  // Puedes cambiarlo según lógica de negocio
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
      // Limpia el formulario si deseas:
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
    <div className="min-h-screen flex flex-col bg-gray-100 p-4">
      <NavAdmin />

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 w-full max-w-xl mx-auto mt-6"
      >
        <h2 className="text-2xl font-bold mb-4">Registro de Usuario</h2>

        <label className="block mb-2">
          Cédula:
          <input
            type="number"
            name="cedula"
            value={formData.cedula}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </label>

        <label className="block mb-2">
          Nombres:
          <input
            type="text"
            name="nombres"
            value={formData.nombres}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </label>

        <label className="block mb-2">
          Apellidos:
          <input
            type="text"
            name="apellidos"
            value={formData.apellidos}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </label>

        <label className="block mb-2">
          Dirección:
          <input
            type="text"
            name="direccion"
            value={formData.direccion}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
        </label>

        <label className="block mb-2">
          Municipio:
          <input
            type="text"
            name="municipio"
            value={formData.municipio}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
        </label>

        <label className="block mb-2">
          Departamento:
          <input
            type="text"
            name="departamento"
            value={formData.departamento}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
        </label>

        <label className="block mb-2">
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </label>

        <label className="block mb-2">
          Teléfono:
          <input
            type="text"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
        </label>

        <label className="block mb-2">
          Contraseña:
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </label>

        <label className="block mb-2">
          Confirmar Contraseña:
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </label>

        <button
          type="submit"
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Registrar
        </button>
      </form>
    </div>
  );
};

export default CrearAdministrador;