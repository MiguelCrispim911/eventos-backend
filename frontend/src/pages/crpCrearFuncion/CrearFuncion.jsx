import NavAdmin from "../../components/NavAdmin";
import { useState } from "react";

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
      estado: 1, // por defecto
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

      // Limpiar formulario
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
    <div className="min-h-screen flex flex-col bg-gray-100 p-4">
      <NavAdmin />

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 w-full max-w-xl mx-auto mt-6"
      >
        <h2 className="text-2xl font-bold mb-4">Crear Función</h2>

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
          <textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </label>

        <label className="block mb-2">
          Fecha:
          <input
            type="date"
            name="fecha"
            value={formData.fecha}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </label>

        <label className="block mb-2">
          Hora de Inicio:
          <input
            type="time"
            name="hora_inicio"
            value={formData.hora_inicio}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </label>

        <label className="block mb-2">
          ID Evento:
          <input
            type="number"
            name="id_evento"
            value={formData.id_evento}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </label>

        <label className="block mb-2">
          ID Ubicación:
          <input
            type="number"
            name="id_ubicacion"
            value={formData.id_ubicacion}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </label>

        <button
          type="submit"
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Crear Función
        </button>
      </form>
    </div>
  );
};

export default CrearFuncion;