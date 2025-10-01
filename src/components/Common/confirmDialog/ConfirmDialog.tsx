import React from "react";
import LoadingSpinner from "../../Shared/LoadingSpinner/LoadingSpinner";
import {
  Backdrop,
  Body,
  Button,
  Footer,
  Header,
  Modal,
  Title,
} from "./ConfirmDialogStyles";

type ConfirmDialogProps = {
  open: boolean;
  title?: string;
  description?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean; // <-- NUEVO
};

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title = "Confirmación",
  description = "¿Estás seguro?",
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  onConfirm,
  onCancel,
  loading = false, // <-- NUEVO
}) => {
  return (
    <Backdrop open={open} role="dialog" aria-modal="true">
      <Modal>
        <Header>
          <Title>{title}</Title>
        </Header>
        <Body>{description}</Body>
        <Footer>
          <Button variant="ghost" onClick={onCancel} disabled={loading}>
            {cancelText}
          </Button>
          <Button variant="primary" onClick={onConfirm} disabled={loading}>
            {loading ? (
              <span
                style={{ display: "inline-flex", alignItems: "center", gap: 8 }}
              >
                <span
                  style={{ display: "inline-flex", transform: "scale(.8)" }}
                >
                  <LoadingSpinner />
                </span>
                {confirmText}
              </span>
            ) : (
              confirmText
            )}
          </Button>
        </Footer>
      </Modal>
    </Backdrop>
  );
};

export default ConfirmDialog;
