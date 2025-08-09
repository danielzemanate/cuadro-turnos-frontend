import React, { FC, useState } from 'react';
import { User, Lock, Eye, EyeOff } from 'lucide-react';
import loginLogo from '../../assets/images/loginLogo.png';
import {
  LoginContainer,
  LoginCard,
  LoginLogo,
  InputContainer,
  LoginInput,
  InputIcon,
  PasswordToggle,
  LoginButton,
  ErrorMessage,
} from './LoginStyles';
import LoadingSpinner from '../Shared/LoadingSpinner/LoadingSpinner';

const Login: FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Usuario quemado para validación
  const validUser = {
    id: 1,
    nombre: 'Valery J. Rivera L.',
    rol: 'Médico',
    username: 'valery.rivera',
    password: '123456',
  };

  const handleLogin = () => {
    setError('');
    setIsLoading(true);

    // Simular delay de autenticación
    setTimeout(() => {
      if (username === validUser.username && password === validUser.password) {
        // Login exitoso - redirigir a dashboard
        console.log('Login exitoso:', validUser);
        window.location.href = '/dashboard';
      } else {
        console.log('Credenciales incorrectas');
        setError('Usuario o contraseña incorrectos');
        setIsLoading(false);
      }
    }, 1500);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <LoginContainer>
      <LoginCard>
        <LoginLogo src={loginLogo} alt="Logo E.S.E Suroccidente" />

        <InputContainer>
          <InputIcon>
            <User size={20} color="#6b7280" />
          </InputIcon>
          <LoginInput
            type="text"
            placeholder="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </InputContainer>

        <InputContainer>
          <InputIcon>
            <Lock size={20} color="#6b7280" />
          </InputIcon>
          <LoginInput
            type={showPassword ? 'text' : 'password'}
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <PasswordToggle type="button" onClick={togglePasswordVisibility}>
            {showPassword ? <EyeOff size={20} color="#6b7280" /> : <Eye size={20} color="#6b7280" />}
          </PasswordToggle>
        </InputContainer>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <LoginButton onClick={handleLogin} disabled={isLoading}>
          {isLoading ? <LoadingSpinner /> : 'Ingresar'}
        </LoginButton>

        {/* Información de prueba */}
        <div
          style={{
            marginTop: '1.5rem',
            padding: '1rem',
            backgroundColor: '#f3f4f6',
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
            color: '#6b7280',
          }}
        >
          <strong>Credenciales de prueba:</strong>
          <br />
          Usuario: valery.rivera
          <br />
          Contraseña: 123456
        </div>
      </LoginCard>
    </LoginContainer>
  );
};

export default Login;
