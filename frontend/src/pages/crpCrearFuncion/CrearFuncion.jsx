import { useState, useEffect } from "react";
import "./CrearFuncion.css";

// Componente principal para crear una función
const CrearFuncion = () => {
  const [eventos, setEventos] = useState([]);
  const [ubicaciones, setUbicaciones] = useState([]);
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    fecha: "",
    hora_inicio: "",
    id_evento: "",
    id_ubicacion: ""
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Cargar eventos y ubicaciones cuando el componente se monte
    const fetchData = async () => {
      try {
        // Cargar eventos
        const eventosRes = await fetch("http://localhost:8000/eventos/");
        if (!eventosRes.ok) throw new Error("Error al cargar eventos");
        const eventosData = await eventosRes.json();
        setEventos(eventosData);

        // Cargar ubicaciones
        const ubicacionesRes = await fetch("http://localhost:8000/ubicaciones/");
        if (!ubicacionesRes.ok) throw new Error("Error al cargar ubicaciones");
        const ubicacionesData = await ubicacionesRes.json();
        setUbicaciones(ubicacionesData);
      } catch (error) {
        console.error("Error:", error);
        alert("Error al cargar datos necesarios");
      }
    };

    fetchData();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    
    if (formData.nombre.length > 50) {
      newErrors.nombre = "El nombre no puede exceder los 50 caracteres";
    }
    
    if (formData.descripcion.length > 250) {
      newErrors.descripcion = "La descripción no puede exceder los 250 caracteres";
    }

    if (!formData.id_evento) {
      newErrors.id_evento = "Debe seleccionar un evento";
    }

    if (!formData.id_ubicacion) {
      newErrors.id_ubicacion = "Debe seleccionar una ubicación";
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

  // Maneja el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const dataToSend = {
      nombre: formData.nombre,
      descripcion: formData.descripcion,
      fecha: formData.fecha,
      hora_inicio: formData.hora_inicio,
      id_evento: parseInt(formData.id_evento),
      id_ubicacion: parseInt(formData.id_ubicacion),
      estado: 1,
    };

    try {
      // Realiza la petición POST al backend
      const response = await fetch("http://localhost:8000/funciones/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      // Si la respuesta no es exitosa, lanza un error
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Error al crear función");
      }

      // Muestra mensaje de éxito y limpia el formulario
      const result = await response.json();
      console.log("Función creada:", result);
      alert("Función registrada con éxito");

      setFormData({
        nombre: "",
        descripcion: "",
        fecha: "",
        hora_inicio: "",
        id_evento: "",
        id_ubicacion: ""
      });
    } catch (error) {
      // Maneja errores y muestra alerta
      console.error("Error:", error.message);
      alert("Ocurrió un error: " + error.message);
    }
  };

  // Renderiza el formulario
  return (
    <div className="crear-funcion-container">
      <form onSubmit={handleSubmit} className="crear-funcion-form">
        <h2 className="form-title">Crear Función</h2>

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
          Descripción:
          <textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            className={`form-input textarea ${errors.descripcion ? 'error' : ''}`}
            maxLength={250}
            rows={4}
            required
          />
          {errors.descripcion && <span className="error-message">{errors.descripcion}</span>}
        </label>

        <label className="form-label">
          Fecha:
          <input
            type="date"
            name="fecha"
            value={formData.fecha}
            onChange={handleChange}
            className="form-input"
            required
          />
        </label>

        <label className="form-label">
          Hora de Inicio:
          <input
            type="time"
            name="hora_inicio"
            value={formData.hora_inicio}
            onChange={handleChange}
            className="form-input"
            required
          />
        </label>

        <label className="form-label">
          Evento:
          <select
            name="id_evento"
            value={formData.id_evento}
            onChange={handleChange}
            className={`form-input ${errors.id_evento ? 'error' : ''}`}
            required
          >
            <option value="">Seleccione un evento</option>
            {eventos.map((evento) => (
              <option key={evento.id_evento} value={evento.id_evento}>
                {evento.id_evento} - {evento.nombre}
              </option>
            ))}
          </select>
          {errors.id_evento && <span className="error-message">{errors.id_evento}</span>}
        </label>

        <label className="form-label">
          Ubicación:
          <select
            name="id_ubicacion"
            value={formData.id_ubicacion}
            onChange={handleChange}
            className={`form-input ${errors.id_ubicacion ? 'error' : ''}`}
            required
          >
            <option value="">Seleccione una ubicación</option>
            {ubicaciones.map((ubicacion) => (
              <option key={ubicacion.id_ubicacion} value={ubicacion.id_ubicacion}>
                {ubicacion.id_ubicacion} - {ubicacion.nombre}
              </option>
            ))}
          </select>
          {errors.id_ubicacion && <span className="error-message">{errors.id_ubicacion}</span>}
        </label>

        <button type="submit" className="submit-button">
          Crear Función
        </button>
      </form>
    </div>
  );
};

export default CrearFuncion;