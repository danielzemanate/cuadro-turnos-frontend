import styled from "styled-components";

/** Contenedor principal del formulario */
export const PageBlock = styled.form`
  background: transparent;
  width: 100%;
`;

/** Título principal */
export const Title = styled.h1`
  margin: 0 0 1.5rem 0;
  color: #0f2167;
  font-size: 1.25rem;
  font-weight: 700;
  line-height: 1.2;
`;

/** Contenedor de campo individual */
export const Field = styled.fieldset`
  border: none;
  padding: 0;
  margin: 0 0 1rem 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

/** Etiqueta de campo */
export const Label = styled.label`
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
  line-height: 1.25;
`;

/** Estilos base para inputs y selects */
const inputBaseStyles = `
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  line-height: 1.25;
  transition: all 0.15s ease-in-out;
  outline: none;
  width: 100%;
  box-sizing: border-box;

  &::placeholder {
    color: #9ca3af;
  }

  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &:hover:not(:focus) {
    border-color: #9ca3af;
  }

  &:disabled {
    background-color: #f9fafb;
    color: #6b7280;
    cursor: not-allowed;
  }
`;

/** Input de texto */
export const Input = styled.input`
  ${inputBaseStyles}
`;

/** Select dropdown */
export const Select = styled.select`
  ${inputBaseStyles}
  background-color: white;
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
  }
`;

/** Contenedor de acciones/botones */
export const Actions = styled.section`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin: 2rem 0 1.5rem 0;
  flex-wrap: wrap;

  @media (max-width: 640px) {
    flex-direction: column-reverse;

    & > * {
      width: 100%;
    }
  }
`;

/** Estilos base para botones */
const buttonBaseStyles = `
  appearance: none;
  border: none;
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  font-size: 0.875rem;
  line-height: 1.25;
  min-width: 120px;
  text-align: center;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
  }

  &:focus {
    outline: 2px solid transparent;
    outline-offset: 2px;
  }
`;

/** Botón principal */
export const Primary = styled.button`
  ${buttonBaseStyles}
  background: #0f2167;
  color: white;

  &:hover:not(:disabled) {
    background: #1e3a8a;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(15, 33, 103, 0.4);
  }

  &:focus {
    box-shadow: 0 0 0 3px rgba(15, 33, 103, 0.3);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
    background: #1e40af;
  }
`;

/** Botón secundario */
export const Ghost = styled.button`
  ${buttonBaseStyles}
  background: white;
  color: #374151;
  border: 1px solid #d1d5db;

  &:hover:not(:disabled) {
    background: #f9fafb;
    border-color: #9ca3af;
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  &:focus {
    box-shadow: 0 0 0 3px rgba(55, 65, 81, 0.1);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
    background: #f3f4f6;
  }
`;

/** Grid responsivo para campos */
export const GridThree = styled.section`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

/** Texto de error */
export const ErrorText = styled.span`
  color: #dc2626;
  font-size: 0.75rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.25rem;

  &::before {
    content: "⚠";
    font-size: 0.875rem;
  }
`;

/** Separador con título */
export const SeparatorWithTitle = styled.header`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 2rem 0 1.5rem 0;
  color: #0f2167;
  font-weight: 700;
  font-size: 0.875rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  background: white;
  padding: 0 1rem;

  &::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(
      to right,
      transparent,
      #e5e7eb 20%,
      #e5e7eb 80%,
      transparent
    );
    z-index: -1;
  }
`;

/** Bloque de contenido de roles */
export const RolesBlock = styled.section`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

/** Espaciador */
export const Spacer16 = styled.div`
  height: 1rem;
`;

/** Fila inline para contenido horizontal */
export const InlineRow = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 1rem;
  align-items: end;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

/** Botón de acción destructiva */
export const Danger = styled.button`
  ${buttonBaseStyles}
  background: white;
  color: #dc2626;
  border: 1px solid #fecaca;

  &:hover:not(:disabled) {
    background: #fef2f2;
    border-color: #f87171;
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(220, 38, 38, 0.2);
  }

  &:focus {
    box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
    background: #fee2e2;
  }
`;

/** Fila de control para select + botón */
export const ControlRow = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 1rem;
  align-items: end;
  margin-top: 0.5rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    align-items: stretch;
    gap: 0.75rem;
  }

  /* El select toma el espacio necesario pero no más de 320px */
  ${Select} {
    max-width: 320px;
  }

  @media (max-width: 640px) {
    ${Select} {
      max-width: 100%;
    }
  }
`;

/** Información de rol actual */
export const RoleInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const RoleLabel = styled.span`
  font-weight: 700;
  color: #374151;
  font-size: 0.875rem;
`;

export const RoleValue = styled.span`
  color: #6b7280;
  font-size: 0.875rem;
`;
