import { useState } from "react";

const CrearTipoBoleta = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    localizacion: "",
    precio: "",
    cupo_maximo: "",
    id_funcion: "",
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
      localizacion: formData.localizacion,
      precio: parseInt(formData.precio),
      cupo_maximo: parseInt(formData.cupo_maximo),
      disponibles: parseInt(formData.cupo_maximo), // igual a cupo_maximo
      id_funcion: parseInt(formData.id_funcion),
    };

    try {
      const response = await fetch("http://localhost:8000/tiposboletas/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Error al registrar tipo de boleta");
      }

      const result = await response.json();
      console.log("Tipo de boleta creado:", result);
      alert("Tipo de boleta registrado con éxito");

      setFormData({
        nombre: "",
        localizacion: "",
        precio: "",
        cupo_maximo: "",
        id_funcion: "",
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
        <h2 className="text-2xl font-bold mb-4">Registro de Tipo de Boleta</h2>

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
          Localización:
          <input
            type="text"
            name="localizacion"
            value={formData.localizacion}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </label>

        <label className="block mb-2">
          Precio:
          <input
            type="number"
            name="precio"
            value={formData.precio}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </label>

        <label className="block mb-2">
          Cupo Máximo:
          <input
            type="number"
            name="cupo_maximo"
            value={formData.cupo_maximo}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </label>

        <label className="block mb-2">
          ID de Función:
          <input
            type="number"
            name="id_funcion"
            value={formData.id_funcion}
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

export default CrearTipoBoleta;