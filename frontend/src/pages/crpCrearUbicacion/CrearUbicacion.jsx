import { useState } from "react";

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

    const dataToSend = {
      nombre: formData.nombre,
      persona_contacto: formData.persona_contacto,
      telefono: formData.telefono,
      direccion: formData.direccion,
      municipio: formData.municipio,
      departamento: formData.departamento,
      email: formData.email,
      estado: 1, // Por defecto activa
    };

    try {
      const response = await fetch("http://localhost:8000/ubicaciones/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Error al registrar la ubicación");
      }

      const result = await response.json();
      console.log("Ubicación creada:", result);
      alert("Ubicación registrada con éxito");

      setFormData({
        nombre: "",
        persona_contacto: "",
        telefono: "",
        direccion: "",
        municipio: "",
        departamento: "",
        email: "",
      });
    } catch (error) {
      console.error("Error al enviar los datos:", error.message);
      alert("Ocurrió un error: " + error.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 p-4">

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 w-full max-w-xl mx-auto mt-6"
      >
        <h2 className="text-2xl font-bold mb-4">Registro de Ubicación</h2>

        {[
          { label: "Nombre", name: "nombre" },
          { label: "Persona de Contacto", name: "persona_contacto" },
          { label: "Teléfono", name: "telefono" },
          { label: "Dirección", name: "direccion" },
          { label: "Municipio", name: "municipio" },
          { label: "Departamento", name: "departamento" },
          { label: "Email", name: "email", type: "email" },
        ].map(({ label, name, type = "text" }) => (
          <label className="block mb-2" key={name}>
            {label}:
            <input
              type={type}
              name={name}
              value={formData[name]}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </label>
        ))}

        <button
          type="submit"
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Registrar Ubicación
        </button>
      </form>
    </div>
  );
};

export default CrearUbicacion;