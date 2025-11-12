// DataTable.tsx
import React from "react";
import {
  TableCard,
  Toolbar,
  Title,
  AddButton,
  Table,
  Th,
  Tr,
  Td,
  ActionsCell,
  ActionsGroup,
  ActionButton,
} from "./DataTableStyles";
import { Eye } from "lucide-react"; // 👈 NUEVO

export type Column<T> = {
  key: keyof T | string;
  header: string;
  render?: (_row: T) => React.ReactNode;
  width?: string;
};

export type RowId = string | number;

export type DataTableProps<T extends { id: RowId }> = {
  title?: string;
  columns: Column<T>[];
  data: T[];
  onAdd?: () => void;
  addLabel?: string;
  onEdit?: (_row: T) => void;
  onDelete?: (_row: T) => void;
  onViewContract?: (_row: T) => void;
};

export function DataTable<T extends { id: RowId }>({
  title,
  columns,
  data,
  onAdd,
  addLabel = "Nuevo",
  onEdit,
  onDelete,
  onViewContract, // 👈 NUEVO
}: DataTableProps<T>) {
  const hasActions = Boolean(onEdit || onDelete || onViewContract);

  return (
    <TableCard>
      <Toolbar>
        <Title>{title ?? "Listado"}</Title>
        {onAdd && <AddButton onClick={onAdd}>{addLabel}</AddButton>}
      </Toolbar>

      <Table role="table">
        <thead>
          <Tr>
            {columns.map((c) => (
              <Th key={String(c.key)} style={{ width: c.width }}>
                {c.header}
              </Th>
            ))}
            {hasActions && <Th style={{ width: 200 }}>Acciones</Th>}
          </Tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <Tr key={String(row.id)}>
              {columns.map((c) => (
                <Td key={String(c.key)}>
                  {c.render
                    ? c.render(row)
                    : String(row[c.key as keyof T] ?? "")}
                </Td>
              ))}
              {hasActions && (
                <ActionsCell>
                  <ActionsGroup>
                    {/* 👇 NUEVO botón ojito */}
                    {onViewContract && (
                      <ActionButton
                        // usamos variant="edit" para no tocar estilos;
                        // si tienes un variant "ghost" o "view", cámbialo aquí.
                        variant="edit"
                        aria-label="Ver contrato"
                        title="Ver contrato"
                        onClick={() => onViewContract(row)}
                      >
                        <Eye size={16} style={{ marginRight: 6 }} />
                        Ver contrato
                      </ActionButton>
                    )}

                    {onEdit && (
                      <ActionButton variant="edit" onClick={() => onEdit(row)}>
                        Editar
                      </ActionButton>
                    )}
                    {onDelete && (
                      <ActionButton
                        variant="delete"
                        onClick={() => onDelete(row)}
                      >
                        Eliminar
                      </ActionButton>
                    )}
                  </ActionsGroup>
                </ActionsCell>
              )}
            </Tr>
          ))}
        </tbody>
      </Table>
    </TableCard>
  );
}
