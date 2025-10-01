import styled from "styled-components";

// Contenedor principal de la página
export const PageWrap = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 1rem;
`;

// Tarjeta principal del perfil
export const Card = styled.div`
  width: 100%;
  max-width: 980px;
  background: #fff;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -2px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

// Título principal
export const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`;

// Subtítulo
export const Subtitle = styled.p`
  margin: 0.25rem 0 1.5rem;
  color: #6b7280;
  font-size: 0.95rem;
`;

// Avatar circular
export const Avatar = styled.div`
  width: 72px;
  height: 72px;
  border-radius: 9999px;
  background: #011e62;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 1.25rem;
  box-shadow: 0 2px 8px rgba(1, 30, 98, 0.2);
`;

// Grid de información del usuario
export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

// Campo individual de información
export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0.75rem 1rem;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  transition: all 0.2s ease;

  &:hover {
    background: #f3f4f6;
    border-color: #d1d5db;
  }
`;

// Etiqueta de campo
export const Label = styled.label`
  font-size: 0.85rem;
  color: #374151;
  font-weight: 500;
`;

// Valor del campo
export const Value = styled.span`
  font-size: 0.95rem;
  color: #111827;
  font-weight: 600;
  word-break: break-word;
`;

// Divisor visual entre secciones
export const Divider = styled.div`
  margin: 2rem 0 1.5rem;
  height: 10px;
  background: linear-gradient(to right, #e5e7eb 0%, #cbd5e1 50%, #e5e7eb 100%);
  border-radius: 9999px;
`;

// Título de sección
export const SectionTitle = styled.h2`
  font-size: 1.1rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 1rem 0;
`;

// Fila de formulario
export const FormRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  margin-bottom: 0.9rem;
  width: 100%;
`;

// Contenedor de campo de contraseña con botón toggle
export const PasswordWrapper = styled.div`
  position: relative;
  width: 100%;
`;

// Input de texto/contraseña
export const Input = styled.input<{
  $invalid?: boolean;
  $withToggle?: boolean;
}>`
  width: 100%;
  height: 44px;
  box-sizing: border-box;
  padding: 0.7rem 0.85rem;
  border: 1px solid ${({ $invalid }) => ($invalid ? "#ef4444" : "#e5e7eb")};
  border-radius: 0.5rem;
  font-size: 0.95rem;
  line-height: 1.25rem;
  padding-right: ${({ $withToggle }) => ($withToggle ? "2.5rem" : "0.85rem")};
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${({ $invalid }) => ($invalid ? "#ef4444" : "#3b82f6")};
    box-shadow: 0 0 0 3px
      ${({ $invalid }) =>
        $invalid ? "rgba(239, 68, 68, 0.1)" : "rgba(59, 130, 246, 0.1)"};
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

// Botón para mostrar/ocultar contraseña
export const PasswordToggle = styled.button`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 0;
  width: 28px;
  height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.25rem;
  transition: all 0.2s ease;

  &:hover {
    color: #374151;
    background: #f3f4f6;
  }

  &:focus {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
  }
`;

// Texto de error
export const ErrorText = styled.p`
  color: #dc2626;
  font-size: 0.85rem;
  margin: 0.25rem 0 0;
  font-weight: 500;
`;

// Contenedor de botones de acción (alineados a la derecha)
export const ActionsRight = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  margin-top: 1.5rem;

  @media (max-width: 768px) {
    flex-direction: column-reverse;

    button {
      width: 100%;
    }
  }
`;

// Botón primario
export const PrimaryBtn = styled.button`
  padding: 0.65rem 1.25rem;
  background: #011e62;
  color: #fff;
  border: 0;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 600;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: #01163d;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(1, 30, 98, 0.3);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// Botón secundario (ghost)
export const GhostBtn = styled.button`
  padding: 0.65rem 1.25rem;
  background: transparent;
  color: #111827;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 600;
  transition: all 0.2s ease;

  &:hover {
    background: #f3f4f6;
    border-color: #d1d5db;
  }

  &:active {
    background: #e5e7eb;
  }
`;

// Lista de validación de contraseña
export const Checklist = styled.ul`
  list-style: none;
  margin: 0.5rem 0 0;
  padding: 0;
  display: grid;
  gap: 0.35rem;
`;

// Item de la lista de validación
export const CheckItem = styled.li<{ $ok?: boolean }>`
  font-size: 0.85rem;
  color: ${({ $ok }) => ($ok ? "#065f46" : "#6b7280")};
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  font-weight: ${({ $ok }) => ($ok ? "600" : "400")};
`;

// Icono de check positivo
export const CheckIconOk = styled.span`
  width: 14px;
  height: 14px;
  border-radius: 9999px;
  background: #10b981;
  display: inline-block;
  flex-shrink: 0;
  box-shadow: 0 2px 4px rgba(16, 185, 129, 0.3);
`;

// Icono de check negativo
export const CheckIconNo = styled.span`
  width: 14px;
  height: 14px;
  border-radius: 9999px;
  background: #d1d5db;
  display: inline-block;
  flex-shrink: 0;
`;

// Texto de ayuda pequeño
export const SmallHelp = styled.p`
  font-size: 0.8rem;
  color: #6b7280;
  margin: 0.35rem 0 0;
  line-height: 1.4;
`;
