import { useState, useEffect } from "react";
import "./CrearTipoBoleta.css";

const CrearTipoBoleta = () => {
  const [funciones, setFunciones] = useState([]);
  const [formData, setFormData] = useState({
    nombre: "",
    localizacion: "",
    precio: "",
    descripcion: "",
    cupo_maximo: "",
    id_funcion: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Cargar la lista de funciones cuando el componente se monte
    const fetchFunciones = async () => {
      try {
        const response = await fetch("http://localhost:8000/funciones/");
        if (!response.ok) throw new Error("Error al cargar funciones");
        const data = await response.json();
        setFunciones(data);
      } catch (error) {
        console.error("Error:", error);
        alert("Error al cargar la lista de funciones");
      }
    };

    fetchFunciones();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    
    if (formData.nombre.length > 50) {
      newErrors.nombre = "El nombre no puede exceder los 50 caracteres";
    }

    if (formData.localizacion.length > 50) {
      newErrors.localizacion = "La localización no puede exceder los 50 caracteres";
    }

    if (formData.descripcion.length > 200) {
      newErrors.descripcion = "La descripción no puede exceder los 200 caracteres";
    }

    if (parseInt(formData.precio) <= 0) {
      newErrors.precio = "El precio debe ser mayor a 0";
    }

    if (parseInt(formData.cupo_maximo) <= 0) {
      newErrors.cupo_maximo = "El cupo máximo debe ser mayor a 0";
    }

    if (!formData.id_funcion) {
      newErrors.id_funcion = "Debe seleccionar una función";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const dataToSend = {
      nombre: formData.nombre,
      localizacion: formData.localizacion,
      precio: parseInt(formData.precio),
      descripcion: formData.descripcion,
      cupo_maximo: parseInt(formData.cupo_maximo),
      disponibles: parseInt(formData.cupo_maximo), // disponibles igual a cupo_maximo
      id_funcion: parseInt(formData.id_funcion),
      estado: 1,
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
        descripcion: "",
        cupo_maximo: "",
        id_funcion: "",
      });
    } catch (error) {
      console.error("Error al enviar los datos:", error.message);
      alert("Ocurrió un error: " + error.message);
    }
  };

  return (
    <div className="crear-tipo-boleta-container">
      <form onSubmit={handleSubmit} className="crear-tipo-boleta-form">
        <h2 className="form-title">Registro de Tipo de Boleta</h2>

        <label className="form-label">
          Nombre:
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className={`form-input ${errors.nombre ? 'error' : ''}`}
            maxLength={50}
            required
          />
          {errors.nombre && <span className="error-message">{errors.nombre}</span>}
        </label>

        <label className="form-label">
          Localización:
          <input
            type="text"
            name="localizacion"
            value={formData.localizacion}
            onChange={handleChange}
            className={`form-input ${errors.localizacion ? 'error' : ''}`}
            maxLength={50}
            required
          />
          {errors.localizacion && <span className="error-message">{errors.localizacion}</span>}
        </label>

        <label className="form-label">
          Descripción:
          <textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            className={`form-input textarea ${errors.descripcion ? 'error' : ''}`}
            maxLength={200}
            rows={3}
            required
          />
          {errors.descripcion && <span className="error-message">{errors.descripcion}</span>}
        </label>

        <label className="form-label">
          Precio:
          <input
            type="number"
            name="precio"
            value={formData.precio}
            onChange={handleChange}
            className={`form-input ${errors.precio ? 'error' : ''}`}
            min="1"
            required
          />
          {errors.precio && <span className="error-message">{errors.precio}</span>}
        </label>

        <label className="form-label">
          Cupo Máximo:
          <input
            type="number"
            name="cupo_maximo"
            value={formData.cupo_maximo}
            onChange={handleChange}
            className={`form-input ${errors.cupo_maximo ? 'error' : ''}`}
            min="1"
            required
          />
          {errors.cupo_maximo && <span className="error-message">{errors.cupo_maximo}</span>}
        </label>

        <label className="form-label">
          Función:
          <select
            name="id_funcion"
            value={formData.id_funcion}
            onChange={handleChange}
            className={`form-input ${errors.id_funcion ? 'error' : ''}`}
            required
          >
            <option value="">Seleccione una función</option>
            {funciones.map((funcion) => (
              <option key={funcion.id_funcion} value={funcion.id_funcion}>
                {funcion.id_funcion} - {funcion.nombre}
              </option>
            ))}
          </select>
          {errors.id_funcion && <span className="error-message">{errors.id_funcion}</span>}
        </label>

        <button type="submit" className="submit-button">
          Registrar
        </button>
      </form>
    </div>
  );
};

export default CrearTipoBoleta;