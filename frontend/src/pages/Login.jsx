import React, { useState } from 'react';          // ← faltaba useState
import { Link, useNavigate } from 'react-router-dom'; // ← faltaba Link
import { loginUser } from '../services/apiAuth';  // Asegúrate de que la ruta sea correcta

const Login = () => {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const navigate                = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await loginUser({ email, password });
      navigate('/eventos');
    } catch {
      setError('Credenciales inválidas. Por favor, inténtalo de nuevo :).');
    }
  };

  return (
    <div className="max-w-md mx-auto py-8">
      <h2 className="text-2xl font-semibold mb-4">Iniciar Sesión</h2>
      {error && <p className="text-red-600 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Entrar
        </button>
      </form>

      <p className="mt-4">
        ¿No tienes una cuenta?{' '}
        <Link to="/registro" className="text-blue-600">
          Regístrate
        </Link>
      </p>
    </div>
  );
};

export default Login;
