// DataTable.tsx
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
  type TableLayout,
} from "./DataTableStyles";
import { Eye } from "lucide-react";

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
  editLabel?: string;
  canEdit?: (_row: T) => boolean;
  onDelete?: (_row: T) => void;
  deleteLabel?: string;
  canDelete?: (_row: T) => boolean;
  onViewContract?: (_row: T) => void;
  /** fill = ocupa todo el ancho (admin). fit = solo el contenido (citas). */
  layout?: TableLayout;
};

export function DataTable<T extends { id: RowId }>({
  title,
  columns,
  data,
  onAdd,
  addLabel = "Nuevo",
  onEdit,
  editLabel = "Editar",
  canEdit,
  onDelete,
  deleteLabel = "Eliminar",
  canDelete,
  onViewContract,
  layout = "fill",
}: DataTableProps<T>) {
  const rowHasActions = (row: T) =>
    Boolean(onViewContract) ||
    Boolean(onEdit && (!canEdit || canEdit(row))) ||
    Boolean(onDelete && (!canDelete || canDelete(row)));

  const hasActionsColumn =
    Boolean(onEdit || onDelete || onViewContract) && data.some(rowHasActions);

  return (
    <TableCard>
      <Toolbar>
        <Title>{title ?? "Listado"}</Title>
        {onAdd && <AddButton onClick={onAdd}>{addLabel}</AddButton>}
      </Toolbar>

      <TableScroller>
        <Table role="table" $layout={layout}>
          <thead>
            <Tr>
              {columns.map((c) => (
                <Th
                  key={String(c.key)}
                  $layout={layout}
                  style={{ width: c.width }}
                >
                  {c.header}
                </Th>
              ))}
              {hasActionsColumn && (
                <Th $actions $layout={layout}>
                  Acciones
                </Th>
              )}
            </Tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <Tr key={String(row.id)}>
                {columns.map((c) => (
                  <Td key={String(c.key)} $layout={layout}>
                    {c.render
                      ? c.render(row)
                      : String(row[c.key as keyof T] ?? "")}
                  </Td>
                ))}
                {hasActionsColumn && (
                  <ActionsCell $layout={layout}>
                    <ActionsGroup>
                      {onViewContract && (
                        <ActionButton
                          variant="edit"
                          aria-label="Ver contrato"
                          title="Ver contrato"
                          onClick={() => onViewContract(row)}
                        >
                          <Eye size={14} style={{ marginRight: 4 }} />
                          Ver contrato
                        </ActionButton>
                      )}

                      {onEdit && (!canEdit || canEdit(row)) && (
                        <ActionButton
                          variant="edit"
                          onClick={() => onEdit(row)}
                        >
                          {editLabel}
                        </ActionButton>
                      )}
                      {onDelete && (!canDelete || canDelete(row)) && (
                        <ActionButton
                          variant="delete"
                          onClick={() => onDelete(row)}
                        >
                          {deleteLabel}
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
