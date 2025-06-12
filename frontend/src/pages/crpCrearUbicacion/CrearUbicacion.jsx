import { useState, useEffect } from "react";
import "./CrearUbicacion.css";

const CrearUbicacion = () => {
  const [departamentos, setDepartamentos] = useState([]);
  const [municipios, setMunicipios] = useState([]);
  const [formData, setFormData] = useState({
    nombre: "",
    persona_contacto: "",
    telefono: "",
    direccion: "",
    id_municipio: "",
    id_departamento: "",
    email: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState({
    form: false,
    departamentos: true,
    municipios: false,
  });

  // Cargar departamentos al montar el componente
  useEffect(() => {
    const fetchDepartamentos = async () => {
      try {
        const response = await fetch("http://localhost:8000/departamentos/");
        if (!response.ok) throw new Error("Error al cargar departamentos");
        const data = await response.json();
        // DEBUG: Ver datos de departamentos
        console.log("Departamentos cargados:", data);
        setDepartamentos(data);
      } catch (error) {
        console.error("Error:", error);
        alert("Error al cargar la lista de departamentos");
      } finally {
        setIsLoading((prev) => ({ ...prev, departamentos: false }));
      }
    };

    fetchDepartamentos();
  }, []);

  // Cargar municipios cuando se selecciona un departamento
  useEffect(() => {
    const fetchMunicipios = async () => {
      if (!formData.id_departamento) {
        setMunicipios([]);
        return;
      }

      setIsLoading((prev) => ({ ...prev, municipios: true }));
      try {
        const response = await fetch(
          `http://localhost:8000/departamentos/${formData.id_departamento}/municipios`
        );
        if (!response.ok) throw new Error("Error al cargar municipios");
        const data = await response.json();
        // DEBUG: Ver datos de municipios
        console.log("Municipios cargados:", data);
        setMunicipios(data);
      } catch (error) {
        console.error("Error:", error);
        alert("Error al cargar la lista de municipios");
      } finally {
        setIsLoading((prev) => ({ ...prev, municipios: false }));
      }
    };

    fetchMunicipios();
  }, [formData.id_departamento]);

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validateForm = () => {
    const newErrors = {};

    if (formData.nombre.length > 50) {
      newErrors.nombre = "El nombre no puede exceder los 50 caracteres";
    }

    if (formData.persona_contacto.length > 50) {
      newErrors.persona_contacto =
        "El nombre de contacto no puede exceder los 50 caracteres";
    }

    if (!/^\d{10}$/.test(formData.telefono)) {
      newErrors.telefono = "El teléfono debe tener 10 dígitos";
    }

    if (formData.direccion.length > 100) {
      newErrors.direccion = "La dirección no puede exceder los 100 caracteres";
    }

    if (!formData.id_departamento) {
      newErrors.id_departamento = "Debe seleccionar un departamento";
    }

    if (!formData.id_municipio) {
      newErrors.id_municipio = "Debe seleccionar un municipio";
    }

    if (!validateEmail(formData.email)) {
      newErrors.email = "Debe ingresar un email válido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "id_departamento") {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        id_municipio: "", // Resetear municipio cuando cambia el departamento
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading((prev) => ({ ...prev, form: true }));

    const dataToSend = {
      ...formData,
      id_municipio: parseInt(formData.id_municipio),
      estado: 1,
    };

    // DEBUG: Ver datos que se envían al backend
    console.log("Datos a enviar:", dataToSend);

    try {
      const response = await fetch("http://localhost:8000/ubicaciones/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      // DEBUG: Ver respuesta del servidor
      const responseData = await response.json();
      console.log("Respuesta del servidor:", responseData);

      if (!response.ok) {
        throw new Error(responseData.detail || "Error al crear ubicación");
      }

      console.log("Ubicación creada:", responseData);
      alert("Ubicación registrada con éxito");

      setFormData({
        nombre: "",
        persona_contacto: "",
        telefono: "",
        direccion: "",
        id_municipio: "",
        id_departamento: "",
        email: "",
      });
    } catch (error) {
      console.error("Error detallado:", error);
      alert("Ocurrió un error: " + error.message);
    } finally {
      setIsLoading((prev) => ({ ...prev, form: false }));
    }
  };

  return (
    <div className="crear-ubicacion-container">
      <form onSubmit={handleSubmit} className="crear-ubicacion-form">
        <h2 className="form-title">Registro de Ubicación</h2>

        <label className="form-label">
          Nombre:
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className={`form-input ${
              errors.nombre ? "error" : ""
            }`}
            maxLength={50}
            required
          />
          {errors.nombre && (
            <span className="error-message">{errors.nombre}</span>
          )}
        </label>

        <label className="form-label">
          Persona de Contacto:
          <input
            type="text"
            name="persona_contacto"
            value={formData.persona_contacto}
            onChange={handleChange}
            className={`form-input ${
              errors.persona_contacto ? "error" : ""
            }`}
            maxLength={50}
            required
          />
          {errors.persona_contacto && (
            <span className="error-message">{errors.persona_contacto}</span>
          )}
        </label>

        <label className="form-label">
          Teléfono:
          <input
            type="tel"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            className={`form-input ${errors.telefono ? "error" : ""}`}
            pattern="[0-9]{10}"
            required
          />
          {errors.telefono && (
            <span className="error-message">{errors.telefono}</span>
          )}
        </label>

        <label className="form-label">
          Dirección:
          <input
            type="text"
            name="direccion"
            value={formData.direccion}
            onChange={handleChange}
            className={`form-input ${errors.direccion ? "error" : ""}`}
            maxLength={100}
            required
          />
          {errors.direccion && (
            <span className="error-message">{errors.direccion}</span>
          )}
        </label>

        <label className="form-label">
          Departamento:
          <select
            name="id_departamento"
            value={formData.id_departamento}
            onChange={handleChange}
            className={`form-input ${
              errors.id_departamento ? "error" : ""
            }`}
            required
            disabled={isLoading.departamentos}
          >
            <option key="default-depto" value="">
              Seleccione un departamento
            </option>
            {departamentos.map((depto) => (
              <option key={`depto-${depto.id}`} value={depto.id}>
                {depto.nombre}
              </option>
            ))}
          </select>
          {errors.id_departamento && (
            <span className="error-message">{errors.id_departamento}</span>
          )}
        </label>

        <label className="form-label">
          Municipio:
          <select
            name="id_municipio"
            value={formData.id_municipio}
            onChange={handleChange}
            className={`form-input ${
              errors.id_municipio ? "error" : ""
            }`}
            required
            disabled={!formData.id_departamento || isLoading.municipios}
          >
            <option key="default-muni" value="">
              Seleccione un municipio
            </option>
            {municipios.map((muni) => (
              <option key={`muni-${muni.id}`} value={muni.id}>
                {muni.nombre}
              </option>
            ))}
          </select>
          {errors.id_municipio && (
            <span className="error-message">{errors.id_municipio}</span>
          )}
        </label>

        <label className="form-label">
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`form-input ${errors.email ? "error" : ""}`}
            required
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </label>

        <button
          type="submit"
          className="submit-button"
          disabled={isLoading.form}
        >
          {isLoading.form ? "Registrando..." : "Registrar Ubicación"}
        </button>
      </form>
    </div>
  );
};

export default CrearUbicacion;