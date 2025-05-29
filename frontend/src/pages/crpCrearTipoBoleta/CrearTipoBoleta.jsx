import { useState } from "react";
import "./CrearTipoBoleta.css";

// Componente principal para crear un tipo de boleta
const CrearTipoBoleta = () => {
  // Estado para manejar los datos del formulario
  const [formData, setFormData] = useState({
    nombre: "",
    localizacion: "",
    precio: "",
    cupo_maximo: "",
    id_funcion: "",
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

    // Prepara los datos a enviar al backend
    const dataToSend = {
      nombre: formData.nombre,
      localizacion: formData.localizacion,
      precio: parseInt(formData.precio),
      cupo_maximo: parseInt(formData.cupo_maximo),
      disponibles: parseInt(formData.cupo_maximo),
      id_funcion: parseInt(formData.id_funcion),
    };

    try {
      // Realiza la petición POST al backend
      const response = await fetch("http://localhost:8000/tiposboletas/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      // Si la respuesta no es exitosa, lanza un error
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Error al registrar tipo de boleta");
      }

      // Procesa la respuesta exitosa
      const result = await response.json();
      console.log("Tipo de boleta creado:", result);
      alert("Tipo de boleta registrado con éxito");

      // Reinicia el formulario
      setFormData({
        nombre: "",
        localizacion: "",
        precio: "",
        cupo_maximo: "",
        id_funcion: "",
      });
    } catch (error) {
      // Maneja errores en la petición
      console.error("Error al enviar los datos:", error.message);
      alert("Ocurrió un error: " + error.message);
    }
  };

  return (
    <div className="crear-tipo-boleta-container">
      <form onSubmit={handleSubmit} className="crear-tipo-boleta-form">
        <h2 className="form-title">Registro de Tipo de Boleta</h2>

        {/* Campo para el nombre */}
        <label className="form-label">
          Nombre:
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className="form-input"
            required
          />
        </label>

        {/* Campo para la localización */}
        <label className="form-label">
          Localización:
          <input
            type="text"
            name="localizacion"
            value={formData.localizacion}
            onChange={handleChange}
            className="form-input"
            required
          />
        </label>

        {/* Campo para el precio */}
        <label className="form-label">
          Precio:
          <input
            type="number"
            name="precio"
            value={formData.precio}
            onChange={handleChange}
            className="form-input"
            required
          />
        </label>

        {/* Campo para el cupo máximo */}
        <label className="form-label">
          Cupo Máximo:
          <input
            type="number"
            name="cupo_maximo"
            value={formData.cupo_maximo}
            onChange={handleChange}
            className="form-input"
            required
          />
        </label>

        {/* Campo para el ID de función */}
        <label className="form-label">
          ID de Función:
          <input
            type="number"
            name="id_funcion"
            value={formData.id_funcion}
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

export default CrearTipoBoleta;