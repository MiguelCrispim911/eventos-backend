import { useState, useEffect } from "react";
import "./CrearAdministrador.css";

// Componente principal para crear un administrador
const CrearAdministrador = ({ username }) => {
  // Estado para manejar los datos del formulario
  const [formData, setFormData] = useState({
    cedula: "",
    nombres: "",
    apellidos: "",
    direccion: "",
    id_municipio: "",
    id_departamento: "",
    email: "",
    telefono: "",
    password: "",
    confirmPassword: "",
  });

  const [departamentos, setDepartamentos] = useState([]);
  const [municipios, setMunicipios] = useState([]);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState({
    form: false,
    departamentos: true,
    municipios: false
  });

  // Cargar departamentos al montar el componente
  useEffect(() => {
    const fetchDepartamentos = async () => {
      try {
        const response = await fetch("http://localhost:8000/departamentos/");
        if (!response.ok) {
          throw new Error("Error al cargar departamentos");
        }
        const data = await response.json();
        setDepartamentos(data);
      } catch (error) {
        console.error("Error:", error);
        setErrors(prev => ({...prev, departamentos: "Error al cargar departamentos"}));
      } finally {
        setIsLoading(prev => ({...prev, departamentos: false}));
      }
    };
    fetchDepartamentos();
  }, []);

  // Cargar municipios cuando se selecciona un departamento
  useEffect(() => {
    const fetchMunicipios = async () => {
      if (formData.id_departamento) {
        setIsLoading(prev => ({...prev, municipios: true}));
        setMunicipios([]);
        setFormData(prev => ({...prev, id_municipio: ""}));
        
        try {
          const response = await fetch(
            `http://localhost:8000/municipios/?id_departamento=${formData.id_departamento}`
          );
          
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || "Error al cargar municipios");
          }
          
          const data = await response.json();
          setMunicipios(data);
        } catch (error) {
          console.error("Error al cargar municipios:", error);
          setErrors(prev => ({...prev, municipios: error.message}));
        } finally {
          setIsLoading(prev => ({...prev, municipios: false}));
        }
      }
    };
    fetchMunicipios();
  }, [formData.id_departamento]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Validaciones en tiempo real
    let error = "";
    
    if (name === "cedula") {
      if (value.length > 10) {
        error = "La cédula no puede tener más de 10 dígitos";
      } else if (isNaN(value)) {
        error = "La cédula debe ser numérica";
      }
    } else if (name === "nombres" && value.length > 30) {
      error = "Los nombres no pueden tener más de 30 caracteres";
    } else if (name === "apellidos" && value.length > 50) {
      error = "Los apellidos no pueden tener más de 50 caracteres";
    } else if (name === "direccion" && value.length > 100) {
      error = "La dirección no puede tener más de 100 caracteres";
    } else if (name === "email") {
      if (value.length > 50) {
        error = "El email no puede tener más de 50 caracteres";
      } 
    } else if (name === "telefono" && value.length > 20) {
      error = "El teléfono no puede tener más de 20 caracteres";
    } 
    
    setErrors({
      ...errors,
      [name]: error
    });
    
    if (!error || (error && name === "id_departamento")) {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.cedula) {
      newErrors.cedula = "La cédula es requerida";
    } else if (formData.cedula.length > 10) {
      newErrors.cedula = "La cédula no puede tener más de 10 dígitos";
    } else if (isNaN(formData.cedula)) {
      newErrors.cedula = "La cédula debe ser numérica";
    }
    
    if (!formData.nombres) {
      newErrors.nombres = "Los nombres son requeridos";
    } else if (formData.nombres.length > 30) {
      newErrors.nombres = "Los nombres no pueden tener más de 30 caracteres";
    }
    
    if (!formData.apellidos) {
      newErrors.apellidos = "Los apellidos son requeridos";
    } else if (formData.apellidos.length > 50) {
      newErrors.apellidos = "Los apellidos no pueden tener más de 50 caracteres";
    }
    
    if (formData.direccion.length > 100) {
      newErrors.direccion = "La dirección no puede tener más de 100 caracteres";
    }
    
    if (!formData.email) {
      newErrors.email = "El email es requerido";
    } else if (formData.email.length > 50) {
      newErrors.email = "El email no puede tener más de 50 caracteres";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Por favor ingrese un email válido";
    }
    
    if (formData.telefono.length > 20) {
      newErrors.telefono = "El teléfono no puede tener más de 20 caracteres";
    }
    
    if (!formData.password) {
      newErrors.password = "La contraseña es requerida";
    } else if (formData.password.length < 4) {
      newErrors.password = "La contraseña debe tener al menos 4 caracteres";
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Debe confirmar la contraseña";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }
    
    if (!formData.id_departamento) {
      newErrors.id_departamento = "Debe seleccionar un departamento";
    }
    
    if (!formData.id_municipio) {
      newErrors.id_municipio = "Debe seleccionar un municipio";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(prev => ({...prev, form: true}));
    
    const dataToSend = {
      cedula_adm: parseInt(formData.cedula),
      nombres: formData.nombres,
      apellidos: formData.apellidos,
      direccion: formData.direccion,
      id_municipio: parseInt(formData.id_municipio),
      email: formData.email,
      telefono: formData.telefono,
      contrasena: formData.password,
      estado: 1
    };
    //console.log("JSON enviado:", JSON.stringify(dataToSend, null, 2));
    try {
      // Envía los datos al backend
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
        id_municipio: "",
        id_departamento: "",
        email: "",
        telefono: "",
        password: "",
        confirmPassword: "",
      });
    } catch (error) {
      // Maneja errores de red o del backend
      console.error("Error al enviar los datos:", error.message);
      alert("Ocurrió un error: " + error.message);
    } finally {
      setIsLoading(prev => ({...prev, form: false}));
    }
  };

  // Renderiza el formulario
  return (
    <div className="crear-administrador-container">
      <form onSubmit={handleSubmit} className="crear-administrador-form">
        <h2 className="form-title">Registro de Administrador</h2>

        {/* Campo para la cédula */}
        <label className="form-label">
          Cédula:
          <input
            type="text"
            name="cedula"
            value={formData.cedula}
            onChange={handleChange}
            className="form-input"
            maxLength={10}
            required
          />
          {errors.cedula && <span className="error-message">{errors.cedula}</span>}
        </label>

        {/* Campo para los nombres */}
        <label className="form-label">
          Nombres:
          <input
            type="text"
            name="nombres"
            value={formData.nombres}
            onChange={handleChange}
            className="form-input"
            maxLength={30}
            required
          />
          {errors.nombres && <span className="error-message">{errors.nombres}</span>}
        </label>

        {/* Campo para los apellidos */}
        <label className="form-label">
          Apellidos:
          <input
            type="text"
            name="apellidos"
            value={formData.apellidos}
            onChange={handleChange}
            className="form-input"
            maxLength={50}
            required
          />
          {errors.apellidos && <span className="error-message">{errors.apellidos}</span>}
        </label>

        {/* Campo para la dirección */}
        <label className="form-label">
          Dirección:
          <input
            type="text"
            name="direccion"
            value={formData.direccion}
            onChange={handleChange}
            className="form-input"
            maxLength={100}
          />
          {errors.direccion && <span className="error-message">{errors.direccion}</span>}
        </label>

        {/* Campo para el departamento */}
        <label className="form-label">
          Departamento:
          <select
            name="id_departamento"
            value={formData.id_departamento}
            onChange={handleChange}
            className="form-input"
            required
            disabled={isLoading.departamentos}
          >
            <option value="">Seleccione un departamento</option>
            {departamentos.map((depto) => (
              <option key={depto.id} value={depto.id}>
                {depto.nombre}
              </option>
            ))}
          </select>
          {isLoading.departamentos && <span className="loading-text">Cargando departamentos...</span>}
          {errors.id_departamento && <span className="error-message">{errors.id_departamento}</span>}
        </label>

        <label className="form-label">
          Municipio:
          <select
            name="id_municipio"
            value={formData.id_municipio}
            onChange={handleChange}
            className="form-input"
            required
            disabled={!formData.id_departamento || isLoading.municipios}
          >
            <option value="">Seleccione un municipio</option>
            {municipios.map((mun) => (
              <option key={mun.id} value={mun.id}>
                {mun.nombre}
              </option>
            ))}
          </select>
          {isLoading.municipios && <span className="loading-text">Cargando municipios...</span>}
          {errors.municipios && <span className="error-message">{errors.municipios}</span>}
          {errors.id_municipio && <span className="error-message">{errors.id_municipio}</span>}
        </label>

        {/* Campo para el email */}
        <label className="form-label">
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="form-input"
            maxLength={50}
            required
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </label>

        {/* Campo para el teléfono */}
        <label className="form-label">
          Teléfono:
          <input
            type="text"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            className="form-input"
            maxLength={20}
          />
          {errors.telefono && <span className="error-message">{errors.telefono}</span>}
        </label>

        {/* Campo para la contraseña */}
        <label className="form-label">
          Contraseña:
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="form-input"
            minLength={4}
            required
          />
          {errors.password && <span className="error-message">{errors.password}</span>}
        </label>

        {/* Campo para confirmar la contraseña */}
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
          {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
        </label>

        <button 
          type="submit" 
          className="submit-button" 
          disabled={isLoading.form}
        >
          {isLoading.form ? "Registrando..." : "Registrar"}
        </button>
      </form>
    </div>
  );
};

export default CrearAdministrador;