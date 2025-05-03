import { useState } from "react";


function CrearEvento() {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    foto_principal: "",
    foto_secundaria: "",
    cedula_adm: "",
    estado: 1, // Estado fijo: activo por defecto
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
          estado: 1, // Aseguramos que siempre se envíe como activo
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
    <div className="min-h-screen flex flex-col bg-gray-100 p-4">

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 w-full max-w-xl mx-auto mt-6"
      >
        <h2 className="text-2xl font-bold mb-4">Crear Evento</h2>

        <label className="block mb-2">
          Nombre:
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </label>

        <label className="block mb-2">
          Descripción:
          <input
            type="text"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </label>

        <label className="block mb-2">
          Foto principal (URL):
          <input
            type="text"
            name="foto_principal"
            value={formData.foto_principal}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </label>

        <label className="block mb-2">
          Foto secundaria (URL):
          <input
            type="text"
            name="foto_secundaria"
            value={formData.foto_secundaria}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </label>

        <label className="block mb-2">
          Cédula del administrador:
          <input
            type="number"
            name="cedula_adm"
            value={formData.cedula_adm}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </label>

        <button
          type="submit"
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Crear Evento
        </button>
      </form>
    </div>
  );
}

export default CrearEvento;