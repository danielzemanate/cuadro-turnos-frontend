import styled from "styled-components";

/* -------- Contenedor -------- */
export const Wrapper = styled.div`
  min-height: 100%;
  padding: 2rem;
  display: flex;
  align-items: flex-start;
  justify-content: center;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

/* Card base (slim para el primer paso si quieres mantenerlo) */
export const Card = styled.div<{ $slim?: boolean }>`
  width: 100%;
  max-width: ${(p) => (p.$slim ? "720px" : "1120px")};
  background: #fff;
  border: 1px solid #d1d5db;
  border-radius: 12px;
  padding: ${(p) => (p.$slim ? "1.25rem 1rem 1.5rem" : "2.25rem 2rem 2.5rem")};
  text-align: center;
  box-shadow: 0 2px 10px rgba(16, 24, 40, 0.04);

  @media (max-width: 768px) {
    padding: ${(p) => (p.$slim ? "1rem" : "1.5rem 1rem")};
    border-radius: 8px;
    max-width: 100%;
    /* Prevenir overflow horizontal */
    overflow-x: hidden;
  }
`;

/* Título/Subtitle */
export const Title = styled.h2<{
  $small?: boolean;
  $upper?: boolean;
  $left?: boolean;
}>`
  margin: 0 0 0.75rem 0;
  font-size: ${(p) => (p.$small ? "1.5rem" : "2rem")};
  font-weight: 800;
  letter-spacing: 0.5px;
  color: #0b1324;
  text-transform: ${(p) => (p.$upper ? "uppercase" : "none")};
  text-align: ${(p) => (p.$left ? "left" : "center")};

  @media (max-width: 768px) {
    font-size: ${(p) => (p.$small ? "1.35rem" : "1.75rem")};
  }
`;

export const Subtitle = styled.p<{ $small?: boolean; $left?: boolean }>`
  margin: 0 0 1.25rem 0;
  font-size: ${(p) => (p.$small ? "1rem" : "1.125rem")};
  color: #111827;
  text-align: ${(p) => (p.$left ? "left" : "center")};

  @media (max-width: 768px) {
    font-size: ${(p) => (p.$small ? "0.95rem" : "1rem")};
    margin: 0 0 1rem 0;
  }
`;

/* -------- Controles (paso 1) -------- */
export const ControlsRow = styled.div`
  display: grid;
  gap: 0.75rem;
  grid-template-columns: 1fr auto;

  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }
`;

export const Select = styled.select`
  width: 100%;
  min-width: 0;
  height: 42px;
  padding: 0 0.75rem;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  background: #fff;
  font-size: 1rem;
  color: #111827;
  outline: none;
  /* Prevenir overflow */
  box-sizing: border-box;

  &:focus {
    border-color: #94a3b8;
    box-shadow: 0 0 0 2px rgba(2, 132, 199, 0.15);
  }

  &:disabled {
    background-color: #f8fafc;
    color: #9ca3af;
    cursor: not-allowed;
  }
`;

export const Button = styled.button`
  height: 42px;
  padding: 0 1rem;
  border: none;
  border-radius: 8px;
  background: #6fb830;
  color: #fff;
  font-weight: 700;
  letter-spacing: 0.4px;
  cursor: pointer;
  width: 160px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  box-sizing: border-box;

  transition:
    transform 0.06s ease,
    filter 0.2s ease,
    opacity 0.2s ease;
  &:hover:not(:disabled) {
    filter: brightness(1.05);
  }
  &:active:not(:disabled) {
    transform: translateY(1px);
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

/* -------- Formulario (paso 2) -------- */
export const FormCard = styled(Card)`
  max-width: 960px; /* más ancho para el form */
  text-align: left;
`;

/* Header con flecha izq (solo ícono) + título centrado + espacio a la derecha */
export const FormHeader = styled.div`
  display: grid;
  grid-template-columns: 40px 1fr 40px;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem; /* Aumentar espacio debajo del header */

  @media (max-width: 768px) {
    margin-bottom: 1rem;
  }
`;

export const BackIconBtn = styled.button`
  width: 40px;
  height: 40px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background: #f8fafc;
  color: #0b1324;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: filter 0.2s ease;

  &:hover {
    filter: brightness(0.96);
  }
`;

export const HeaderTitle = styled.h2`
  margin: 0;
  text-align: center;
  font-size: 1.75rem;
  font-weight: 800;
  letter-spacing: 0.5px;
  color: #0b1324;
  text-transform: uppercase;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

/* Grid del formulario con mejor spacing */
export const FormGrid = styled.div`
  display: grid;
  gap: 2rem; /* Aumentar separación vertical entre filas */
  grid-template-columns: 1fr 1fr;
  margin-bottom: 2rem; /* Espacio antes de los botones */

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
    gap: 1.5rem; /* Reducir un poco en móviles */
  }

  @media (max-width: 768px) {
    gap: 1.25rem;
    margin-bottom: 1.5rem;
  }
`;

/* Container para cada campo del formulario */
export const FormField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem; /* Espacio entre label e input */
  width: 100%;
`;

export const Label = styled.label`
  display: block;
  font-weight: 700;
  color: #0b1324;
  font-size: 0.95rem;
  margin: 0; /* Remover margin por defecto */
`;

export const Input = styled.input`
  width: 100%;
  height: 42px;
  padding: 0 0.75rem;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  background: #fff;
  font-size: 1rem;
  color: #111827;
  outline: none;
  box-sizing: border-box; /* Importante para evitar overflow */

  &:focus {
    border-color: #94a3b8;
    box-shadow: 0 0 0 2px rgba(2, 132, 199, 0.15);
  }

  &:disabled {
    background-color: #f8fafc;
    color: #9ca3af;
    cursor: not-allowed;
  }

  /* Estilos específicos para input de fecha */
  &[type="date"] {
    /* Mejorar la apariencia del selector de fecha */
    font-family: inherit;

    &::-webkit-calendar-picker-indicator {
      cursor: pointer;
      border-radius: 4px;
      margin-left: 4px;
      opacity: 0.6;

      &:hover {
        opacity: 1;
      }
    }
  }
`;

/* Container específico para checkbox */
export const CheckboxContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const CheckboxRow = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.25rem;

  input[type="checkbox"] {
    width: 18px;
    height: 18px;
    accent-color: #0b1324;
    cursor: pointer;
  }

  label {
    font-weight: 600;
    color: #0b1324;
    user-select: none;
    cursor: pointer;
    font-size: 0.95rem;
    margin: 0; /* Remover margin por defecto */
  }
`;

export const ActionsRow = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  padding-top: 1rem; /* Separación adicional del formulario */
  border-top: 1px solid #f1f5f9; /* Línea sutil para separar */

  @media (max-width: 720px) {
    justify-content: stretch;

    button {
      flex: 1; /* Los botones ocupan todo el ancho disponible */
    }
  }
`;
