import React from "react";
import {
  TableCard,
  Toolbar,
  Title,
  AddButton,
  TableScroller,
  Table,
  Th,
  Tr,
  Td,
  ActionsCell,
  ActionsGroup,
  ActionButton,
} from "./DataTableStyles";

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
};

export function DataTable<T extends { id: RowId }>({
  title,
  columns,
  data,
  onAdd,
  addLabel = "Nuevo",
  onEdit,
  onDelete,
}: DataTableProps<T>) {
  return (
    <TableCard>
      <Toolbar>
        <Title>{title ?? "Listado"}</Title>
        {onAdd && <AddButton onClick={onAdd}>{addLabel}</AddButton>}
      </Toolbar>

      <TableScroller>
        <Table role="table">
          <thead>
            <Tr>
              {columns.map((c) => (
                <Th key={String(c.key)} style={{ width: c.width }}>
                  {c.header}
                </Th>
              ))}
              {(onEdit || onDelete) && <Th style={{ width: 160 }}>Acciones</Th>}
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
                {(onEdit || onDelete) && (
                  <ActionsCell>
                    <ActionsGroup>
                      {onEdit && (
                        <ActionButton
                          variant="edit"
                          onClick={() => onEdit(row)}
                        >
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
      </TableScroller>
    </TableCard>
  );
}
