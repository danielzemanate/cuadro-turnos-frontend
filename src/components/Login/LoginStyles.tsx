import styled from "styled-components";

export const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f9fafb;
`;

export const LoginCard = styled.div`
  background-color: #ffffff;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  text-align: center;
`;

export const LoginLogo = styled.img`
  max-width: 320px;
  margin-bottom: 1.5rem;
`;

export const InputContainer = styled.div`
  position: relative;
  margin-bottom: 1rem;
  width: 100%;
`;

export const LoginInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 3rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 1rem;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
  }
`;

export const InputIcon = styled.div`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #6b7280;
`;

export const PasswordToggle = styled.button`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: #374151;
  }
`;

export const LoginButton = styled.button`
  width: 100%;
  padding: 0.75rem 1rem;
  background-color: #011e62;
  color: white;
  font-size: 1rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  margin-top: 0.5rem;
  transition:
    background-color 0.2s ease,
    opacity 0.2s ease;

  &:hover {
    background-color: rgba(25, 67, 181, 1);
  }

  &:disabled {
    background-color: #9ca3af; /* gris */
    color: #f3f4f6; /* aclarar el texto */
    cursor: not-allowed;
    opacity: 0.7; /* un poco traslúcido */
    pointer-events: none; /* evita interacciones */
  }
`;

export const ErrorMessage = styled.div`
  color: #dc2626;
  font-size: 0.875rem;
  margin-top: 0.5rem;
`;

export const ModalField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
`;

export const ModalLabel = styled.label`
  font-size: 0.85rem;
  color: #374151;
`;

export const ModalInput = styled.input`
  width: 100%;
  padding: 0.6rem 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  &:focus {
    outline: none;
    border-color: #011e62;
    box-shadow: 0 0 0 3px rgba(1, 30, 98, 0.15);
  }
`;

export const ModalErrorMessage = styled.div`
  color: #dc2626;
  font-size: 0.85rem;
`;

export const ResetLink = styled.button`
  background: transparent;
  border: 0;
  color: #1f2937;
  margin-top: 0.75rem;
  cursor: pointer;
  font-size: 0.9rem;
  /* quitar subrayado */
  text-decoration: none;
  &:hover {
    color: #111827;
    /* sin subrayado en hover también */
    text-decoration: none;
  }
`;
