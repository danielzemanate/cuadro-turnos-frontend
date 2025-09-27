import React from "react";
import {
  AdminCard,
  TabsWrapper,
  TabList,
  TabButton,
  TabPanel,
} from "./AdministrationStyles";
import { LockKeyhole, Users, ClipboardList, Stethoscope } from "lucide-react";

import { useSelector } from "react-redux";
import { AppState } from "../../redux/reducers/rootReducer";
import { useAppDispatchThunk } from "../../hooks/storeHooks";

import {
  // ROLES
  fetchRoles,
  createRol,
  updateRol,
  deleteRol,
  // TIPOS DE ATENCIÓN
  fetchConfigAttentionTypes,
  createAttentionType,
  updateAttentionType,
  deleteAttentionType,
  // TIPOS DE PERSONAL
  fetchConfigPersonalTypes,
  createPersonalType,
  updatePersonalType,
  deletePersonalType,
} from "../../redux/actions/administrationActions";

import { IRoles } from "../../interfaces/user";
import {
  IConfigAttentionTypes,
  IPersonalType,
} from "../../interfaces/administration";

import { Column, DataTable } from "../Common/table/DataTable";
import ConfirmDialog from "../Common/confirmDialog/ConfirmDialog";
import LoadingSpinner from "../Shared/LoadingSpinner/LoadingSpinner";

import FormRole from "./forms/roles/FormRole";
import FormAttentionTypes from "./forms/attention-types/FormAttentionTypes";
import FormPersonalTypes from "./forms/personal-types/FormPersonalTypes";
import FormUser, { IUserForm } from "./forms/users/FormUser";
import { useTranslation } from "react-i18next";

/* ---------------------------- Tabs definition ---------------------------- */

type TabKey = "roles" | "usuarios" | "tiposAtencion" | "tiposPersonal";

const tabsConfig: {
  key: TabKey;
  labelKey: string;
  icon: React.ComponentType<unknown>;
}[] = [
  { key: "roles", labelKey: "administration.tabs.roles", icon: LockKeyhole },
  { key: "usuarios", labelKey: "administration.tabs.usuarios", icon: Users },
  {
    key: "tiposAtencion",
    labelKey: "administration.tabs.tiposAtencion",
    icon: ClipboardList,
  },
  {
    key: "tiposPersonal",
    labelKey: "administration.tabs.tiposPersonal",
    icon: Stethoscope,
  },
];

/* ---------------------- Placeholders para otros tabs --------------------- */

type UsuarioRow = {
  id: number;
  nombre: string;
  correo: string;
  rol: string;
  estado: "Activo" | "Inactivo";
};

const seedUsuarios: UsuarioRow[] = [
  {
    id: 1,
    nombre: "Ana Pérez",
    correo: "ana@ese.com",
    rol: "Coordinador",
    estado: "Activo",
  },
  {
    id: 2,
    nombre: "Juan Ortiz",
    correo: "juan@ese.com",
    rol: "Personal Salud",
    estado: "Activo",
  },
  {
    id: 4,
    nombre: "Daniel Zemanate",
    correo: "ana@ese.com",
    rol: "Administrador",
    estado: "Activo",
  },
];

/* -------------------------------- Component ------------------------------ */

const Administration: React.FC = () => {
  const { t } = useTranslation();

  const [active, setActive] = React.useState<TabKey>("roles");

  const activeIndex = React.useMemo(
    () => tabsConfig.findIndex((t) => t.key === active),
    [active],
  );

  const selectByIndex = React.useCallback((idx: number) => {
    const clamped = Math.max(0, Math.min(idx, tabsConfig.length - 1));
    setActive(tabsConfig[clamped].key);
  }, []);

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      selectByIndex(activeIndex + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      selectByIndex(activeIndex - 1);
    } else if (e.key === "Home") {
      e.preventDefault();
      selectByIndex(0);
    } else if (e.key === "End") {
      e.preventDefault();
      selectByIndex(tabsConfig.length - 1);
    }
  };

  /* ------------------------------- Redux state ------------------------------- */

  const dispatchThunk = useAppDispatchThunk();
  const { loading } = useSelector((s: AppState) => s.helpers);

  const rolesFromStore =
    useSelector((s: AppState) => s.administration.roles) ?? [];
  const attentionTypesFromStore =
    useSelector((s: AppState) => s.administration.attentionTypes) ?? [];
  const personalTypesFromStore =
    useSelector((s: AppState) => s.administration.personalTypes) ?? [];

  /* --------------------------- Initial data loaders -------------------------- */

  // ROLES
  React.useEffect(() => {
    if (active === "roles" && rolesFromStore.length === 0) {
      dispatchThunk(fetchRoles());
    }
  }, [active, rolesFromStore.length, dispatchThunk]);

  // TIPOS DE ATENCIÓN y TIPOS DE PERSONAL (catálogo para el select)
  React.useEffect(() => {
    if (active === "tiposAtencion") {
      if (attentionTypesFromStore.length === 0) {
        dispatchThunk(fetchConfigAttentionTypes());
      }
      if (personalTypesFromStore.length === 0) {
        dispatchThunk(fetchConfigPersonalTypes());
      }
    }
  }, [
    active,
    attentionTypesFromStore.length,
    personalTypesFromStore.length,
    dispatchThunk,
  ]);

  // TIPOS DE PERSONAL (listado CRUD del tab)
  React.useEffect(() => {
    if (active === "tiposPersonal" && personalTypesFromStore.length === 0) {
      dispatchThunk(fetchConfigPersonalTypes());
    }
  }, [active, personalTypesFromStore.length, dispatchThunk]);

  /* ---------------------------------- ROLES ---------------------------------- */

  const roleColumns: Column<IRoles>[] = [
    {
      key: "id",
      header: t("administration.roles.columns.id", "ID"),
      width: "90px",
    },
    {
      key: "nombre",
      header: t("administration.roles.columns.nombre", "Nombre"),
    },
  ];

  const [showFormRole, setShowFormRole] = React.useState(false);
  const [editingRole, setEditingRole] = React.useState<IRoles | null>(null);
  type ConfirmKind = "create" | "update" | "delete" | null;
  const [confirmKind, setConfirmKind] = React.useState<ConfirmKind>(null);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [pendingPayload, setPendingPayload] =
    React.useState<Partial<IRoles> | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = React.useState<string | null>(
    null,
  );

  const handleAddRole = () => {
    if (loading) return;
    setEditingRole(null);
    setPendingPayload(null);
    setShowFormRole(true);
  };

  const handleFormSubmitRole = (payload: Partial<IRoles>) => {
    setPendingPayload(payload);
    setConfirmKind(editingRole ? "update" : "create");
    setConfirmOpen(true);
  };

  const confirmCreateOrUpdate = async () => {
    if (!pendingPayload) return;
    if (confirmKind === "create") {
      await dispatchThunk(createRol(pendingPayload));
    } else if (confirmKind === "update" && editingRole) {
      await dispatchThunk(updateRol(pendingPayload, String(editingRole.id)));
    }
    await dispatchThunk(fetchRoles());
    setConfirmOpen(false);
    setShowFormRole(false);
    setEditingRole(null);
    setPendingPayload(null);
    setConfirmKind(null);
  };

  const cancelConfirm = () => setConfirmOpen(false);

  const handleEditRole = (row: IRoles) => {
    if (loading) return;
    setEditingRole(row);
    setPendingPayload(null);
    setShowFormRole(true);
  };

  const handleDeleteRole = (row: IRoles) => {
    if (loading) return;
    setPendingDeleteId(String(row.id));
    setConfirmKind("delete");
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (pendingDeleteId) {
      await dispatchThunk(deleteRol(pendingDeleteId));
      await dispatchThunk(fetchRoles());
    }
    setConfirmOpen(false);
    setPendingDeleteId(null);
    setConfirmKind(null);
  };

  /* --------------------------- TIPOS DE ATENCIÓN --------------------------- */

  const atColumns: Column<IConfigAttentionTypes>[] = [
    {
      key: "id",
      header: t("administration.attentionTypes.columns.id", "ID"),
      width: "90px",
    },
    {
      key: "nombre",
      header: t("administration.attentionTypes.columns.nombre", "Nombre"),
    },
    {
      key: "sigla",
      header: t("administration.attentionTypes.columns.sigla", "Sigla"),
      width: "120px",
    },
    {
      key: "horas",
      header: t("administration.attentionTypes.columns.horas", "Horas"),
      width: "120px",
    },
    {
      key: "id_tipo_personal_salud",
      header: t("administration.attentionTypes.columns.personal", "Personal"),
      render: (row) =>
        personalTypesFromStore.find((p) => p.id === row.id_tipo_personal_salud)
          ?.nombre ?? "-",
    },
  ];

  const [showFormAT, setShowFormAT] = React.useState(false);
  const [editingAT, setEditingAT] =
    React.useState<IConfigAttentionTypes | null>(null);
  type ConfirmKindAT = "create" | "update" | "delete" | null;
  const [confirmKindAT, setConfirmKindAT] = React.useState<ConfirmKindAT>(null);
  const [confirmOpenAT, setConfirmOpenAT] = React.useState(false);
  const [pendingPayloadAT, setPendingPayloadAT] =
    React.useState<Partial<IConfigAttentionTypes> | null>(null);
  const [pendingDeleteIdAT, setPendingDeleteIdAT] = React.useState<
    string | null
  >(null);

  const handleAddAT = () => {
    if (loading) return;
    setEditingAT(null);
    setPendingPayloadAT(null);
    setShowFormAT(true);
  };

  const handleFormSubmitAT = (payload: Partial<IConfigAttentionTypes>) => {
    setPendingPayloadAT(payload);
    setConfirmKindAT(editingAT ? "update" : "create");
    setConfirmOpenAT(true);
  };

  const confirmCreateOrUpdateAT = async () => {
    if (!pendingPayloadAT) return;
    if (confirmKindAT === "create") {
      await dispatchThunk(createAttentionType(pendingPayloadAT));
    } else if (confirmKindAT === "update" && editingAT) {
      await dispatchThunk(
        updateAttentionType(pendingPayloadAT, String(editingAT.id)),
      );
    }
    await dispatchThunk(fetchConfigAttentionTypes());
    setConfirmOpenAT(false);
    setShowFormAT(false);
    setEditingAT(null);
    setPendingPayloadAT(null);
    setConfirmKindAT(null);
  };

  const cancelConfirmAT = () => setConfirmOpenAT(false);

  const handleEditAT = (row: IConfigAttentionTypes) => {
    if (loading) return;
    setEditingAT(row);
    setPendingPayloadAT(null);
    setShowFormAT(true);
  };

  const handleDeleteAT = (row: IConfigAttentionTypes) => {
    if (loading) return;
    setPendingDeleteIdAT(String(row.id));
    setConfirmKindAT("delete");
    setConfirmOpenAT(true);
  };

  const confirmDeleteAT = async () => {
    if (pendingDeleteIdAT) {
      await dispatchThunk(deleteAttentionType(pendingDeleteIdAT));
      await dispatchThunk(fetchConfigAttentionTypes());
    }
    setConfirmOpenAT(false);
    setPendingDeleteIdAT(null);
    setConfirmKindAT(null);
  };

  /* ------------------------ TIPOS DE PERSONAL (CRUD) ------------------------ */

  const ptColumns: Column<IPersonalType>[] = [
    {
      key: "id",
      header: t("administration.personalTypes.columns.id", "ID"),
      width: "90px",
    },
    {
      key: "nombre",
      header: t("administration.personalTypes.columns.nombre", "Nombre"),
    },
  ];

  const [showFormPT, setShowFormPT] = React.useState(false);
  const [editingPT, setEditingPT] = React.useState<IPersonalType | null>(null);
  type ConfirmKindPT = "create" | "update" | "delete" | null;
  const [confirmKindPT, setConfirmKindPT] = React.useState<ConfirmKindPT>(null);
  const [confirmOpenPT, setConfirmOpenPT] = React.useState(false);
  const [pendingPayloadPT, setPendingPayloadPT] =
    React.useState<Partial<IPersonalType> | null>(null);
  const [pendingDeleteIdPT, setPendingDeleteIdPT] = React.useState<
    string | null
  >(null);

  const handleAddPT = () => {
    if (loading) return;
    setEditingPT(null);
    setPendingPayloadPT(null);
    setShowFormPT(true);
  };

  const handleFormSubmitPT = (payload: Partial<IPersonalType>) => {
    setPendingPayloadPT(payload);
    setConfirmKindPT(editingPT ? "update" : "create");
    setConfirmOpenPT(true);
  };

  const confirmCreateOrUpdatePT = async () => {
    if (!pendingPayloadPT) return;
    if (confirmKindPT === "create") {
      await dispatchThunk(createPersonalType(pendingPayloadPT));
    } else if (confirmKindPT === "update" && editingPT) {
      await dispatchThunk(
        updatePersonalType(pendingPayloadPT, String(editingPT.id)),
      );
    }
    await dispatchThunk(fetchConfigPersonalTypes());

    setConfirmOpenPT(false);
    setShowFormPT(false);
    setEditingPT(null);
    setPendingPayloadPT(null);
    setConfirmKindPT(null);
  };

  const cancelConfirmPT = () => setConfirmOpenPT(false);

  const handleEditPT = (row: IPersonalType) => {
    if (loading) return;
    setEditingPT(row);
    setPendingPayloadPT(null);
    setShowFormPT(true);
  };

  const handleDeletePT = (row: IPersonalType) => {
    if (loading) return;
    setPendingDeleteIdPT(String(row.id));
    setConfirmKindPT("delete");
    setConfirmOpenPT(true);
  };

  const confirmDeletePT = async () => {
    if (pendingDeleteIdPT) {
      await dispatchThunk(deletePersonalType(pendingDeleteIdPT));
      await dispatchThunk(fetchConfigPersonalTypes());
    }
    setConfirmOpenPT(false);
    setPendingDeleteIdPT(null);
    setConfirmKindPT(null);
  };

  /* ----------------------------- USUARIOS (CRUD) ----------------------------- */

  const [usuarios, setUsuarios] = React.useState<UsuarioRow[]>(seedUsuarios);

  const usuarioCols: Column<UsuarioRow>[] = [
    {
      key: "nombre",
      header: t("administration.users.columns.nombre", "Nombre"),
    },
    {
      key: "correo",
      header: t("administration.users.columns.correo", "Correo"),
    },
    {
      key: "rol",
      header: t("administration.users.columns.rol", "Rol"),
      width: "160px",
    },
    {
      key: "estado",
      header: t("administration.users.columns.estado", "Estado"),
      width: "120px",
    },
  ];

  const [showFormUser, setShowFormUser] = React.useState(false);
  const [editingUser, setEditingUser] = React.useState<UsuarioRow | null>(null);
  type ConfirmKindUser = "create" | "update" | "delete" | null;
  const [confirmKindUser, setConfirmKindUser] =
    React.useState<ConfirmKindUser>(null);
  const [confirmOpenUser, setConfirmOpenUser] = React.useState(false);
  const [pendingPayloadUser, setPendingPayloadUser] =
    React.useState<IUserForm | null>(null);
  const [pendingDeleteIdUser, setPendingDeleteIdUser] = React.useState<
    string | null
  >(null);

  const handleAddUser = () => {
    if (loading) return;
    setEditingUser(null);
    setPendingPayloadUser(null);
    setShowFormUser(true);
  };

  // Recibe el payload del FormUser
  const handleFormSubmitUser = (payload: IUserForm) => {
    console.log("Form submit usuario:", payload);
    setPendingPayloadUser(payload);
    setConfirmKindUser(editingUser ? "update" : "create");
    setConfirmOpenUser(true);
  };

  const confirmCreateOrUpdateUser = async () => {
    if (!pendingPayloadUser) return;

    if (confirmKindUser === "create") {
      console.log("Crear usuario:", pendingPayloadUser);
      // Demo: agregamos a la tabla local
      setUsuarios((prev) => [
        ...prev,
        {
          id: prev.length ? Math.max(...prev.map((u) => u.id)) + 1 : 1,
          nombre:
            `${pendingPayloadUser.nombre} ${pendingPayloadUser.apellidos}`.trim(),
          correo: pendingPayloadUser.correo,
          rol: "—",
          estado: "Activo",
        },
      ]);
    } else if (confirmKindUser === "update" && editingUser) {
      console.log("Actualizar usuario:", editingUser.id, pendingPayloadUser);
      setUsuarios((prev) =>
        prev.map((u) =>
          u.id === editingUser.id
            ? {
                ...u,
                nombre:
                  `${pendingPayloadUser.nombre} ${pendingPayloadUser.apellidos}`.trim(),
                correo: pendingPayloadUser.correo,
              }
            : u,
        ),
      );
    }

    setConfirmOpenUser(false);
    setShowFormUser(false);
    setEditingUser(null);
    setPendingPayloadUser(null);
    setConfirmKindUser(null);
  };

  const cancelConfirmUser = () => setConfirmOpenUser(false);

  const handleEditUser = (row: UsuarioRow) => {
    if (loading) return;
    setEditingUser(row);
    setPendingPayloadUser(null);
    setShowFormUser(true);
  };

  const handleDeleteUser = (row: UsuarioRow) => {
    if (loading) return;
    setPendingDeleteIdUser(String(row.id));
    setConfirmKindUser("delete");
    setConfirmOpenUser(true);
  };

  const confirmDeleteUser = async () => {
    if (pendingDeleteIdUser) {
      console.log("Eliminar usuario:", pendingDeleteIdUser);
      setUsuarios((prev) =>
        prev.filter((x) => String(x.id) !== pendingDeleteIdUser),
      );
    }
    setConfirmOpenUser(false);
    setPendingDeleteIdUser(null);
    setConfirmKindUser(null);
  };

  // Para edición, mapeamos el row parcial a defaultValue del form
  const buildUserDefaultFromRow = (
    row: UsuarioRow | null,
  ): Partial<IUserForm & { id?: number }> | undefined => {
    if (!row) return undefined;
    const [nombre = "", ...rest] = row.nombre.split(" ");
    const apellidos = rest.join(" ");
    return {
      id: row.id,
      nombre,
      apellidos,
      correo: row.correo,
      celular: "",
      id_municipio: undefined as unknown as number,
      id_tipo_personal_salud: undefined as unknown as number,
    };
  };

  /* ----------------------------------- UI ---------------------------------- */

  return (
    <AdminCard>
      <TabsWrapper>
        <TabList
          role="tablist"
          aria-label={t("administration.title", "Administración")}
          onKeyDown={onKeyDown}
        >
          {tabsConfig.map(({ key, labelKey, icon: Icon }) => {
            const selected = key === active;
            return (
              <TabButton
                key={key}
                role="tab"
                aria-selected={selected}
                aria-controls={`panel-${key}`}
                id={`tab-${key}`}
                selected={selected}
                onClick={() => !loading && setActive(key)}
              >
                <Icon aria-hidden="true" />
                {t(labelKey)}
              </TabButton>
            );
          })}
        </TabList>

        <TabPanel
          role="tabpanel"
          id={`panel-${active}`}
          aria-labelledby={`tab-${active}`}
          tabIndex={0}
        >
          {/* Spinner global del panel */}
          {loading && <LoadingSpinner />}

          {/* ------------------------------- ROLES ------------------------------- */}
          {active === "roles" && (
            <>
              {!showFormRole ? (
                <DataTable<IRoles>
                  title={t("administration.roles.title", "Roles")}
                  columns={roleColumns}
                  data={rolesFromStore}
                  onAdd={handleAddRole}
                  addLabel={t("administration.roles.new", "Nuevo rol")}
                  onEdit={handleEditRole}
                  onDelete={handleDeleteRole}
                />
              ) : (
                <FormRole
                  defaultValue={editingRole ?? undefined}
                  onSubmit={handleFormSubmitRole}
                  onCancel={() => {
                    setShowFormRole(false);
                    setEditingRole(null);
                    setPendingPayload(null);
                  }}
                />
              )}

              {/* Confirmaciones Roles */}
              {confirmKind === "create" || confirmKind === "update" ? (
                <ConfirmDialog
                  open={confirmOpen}
                  title={
                    confirmKind === "create"
                      ? t("administration.roles.confirm.createTitle")
                      : t("administration.roles.confirm.updateTitle")
                  }
                  description={
                    confirmKind === "create"
                      ? t("administration.roles.confirm.createQuestion", {
                          name: pendingPayload?.nombre ?? editingRole?.nombre,
                        })
                      : t("administration.roles.confirm.updateQuestion", {
                          name: pendingPayload?.nombre ?? editingRole?.nombre,
                        })
                  }
                  confirmText={
                    confirmKind === "create"
                      ? t("common.create")
                      : t("common.update")
                  }
                  cancelText={t("common.cancel")}
                  onConfirm={confirmCreateOrUpdate}
                  onCancel={cancelConfirm}
                  loading={loading}
                />
              ) : (
                <ConfirmDialog
                  open={confirmOpen && confirmKind === "delete"}
                  title={t("administration.roles.confirm.deleteTitle")}
                  description={t("administration.roles.confirm.deleteQuestion")}
                  confirmText={t("common.delete")}
                  cancelText={t("common.cancel")}
                  onConfirm={confirmDelete}
                  onCancel={() => {
                    setConfirmOpen(false);
                    setPendingDeleteId(null);
                    setConfirmKind(null);
                  }}
                  loading={loading}
                />
              )}
            </>
          )}

          {/* -------------------------- TIPOS DE ATENCIÓN ------------------------- */}
          {active === "tiposAtencion" && (
            <>
              {!showFormAT ? (
                <DataTable<IConfigAttentionTypes>
                  title={t("administration.attentionTypes.title")}
                  columns={atColumns}
                  data={attentionTypesFromStore}
                  onAdd={handleAddAT}
                  addLabel={t("administration.attentionTypes.new")}
                  onEdit={handleEditAT}
                  onDelete={handleDeleteAT}
                />
              ) : (
                <FormAttentionTypes
                  defaultValue={editingAT ?? undefined}
                  onSubmit={handleFormSubmitAT}
                  onCancel={() => {
                    setShowFormAT(false);
                    setEditingAT(null);
                    setPendingPayloadAT(null);
                  }}
                  personalTypes={personalTypesFromStore}
                />
              )}

              {/* Confirmaciones Tipos de atención */}
              {confirmKindAT === "create" || confirmKindAT === "update" ? (
                <ConfirmDialog
                  open={confirmOpenAT}
                  title={
                    confirmKindAT === "create"
                      ? t("administration.attentionTypes.confirm.createTitle")
                      : t("administration.attentionTypes.confirm.updateTitle")
                  }
                  description={
                    confirmKindAT === "create"
                      ? t(
                          "administration.attentionTypes.confirm.createQuestion",
                          {
                            name: pendingPayloadAT?.nombre ?? editingAT?.nombre,
                          },
                        )
                      : t(
                          "administration.attentionTypes.confirm.updateQuestion",
                          {
                            name: pendingPayloadAT?.nombre ?? editingAT?.nombre,
                          },
                        )
                  }
                  confirmText={
                    confirmKindAT === "create"
                      ? t("common.create")
                      : t("common.update")
                  }
                  cancelText={t("common.cancel")}
                  onConfirm={confirmCreateOrUpdateAT}
                  onCancel={cancelConfirmAT}
                  loading={loading}
                />
              ) : (
                <ConfirmDialog
                  open={confirmOpenAT && confirmKindAT === "delete"}
                  title={t("administration.attentionTypes.confirm.deleteTitle")}
                  description={t(
                    "administration.attentionTypes.confirm.deleteQuestion",
                  )}
                  confirmText={t("common.delete")}
                  cancelText={t("common.cancel")}
                  onConfirm={confirmDeleteAT}
                  onCancel={() => {
                    setConfirmOpenAT(false);
                    setPendingDeleteIdAT(null);
                    setConfirmKindAT(null);
                  }}
                  loading={loading}
                />
              )}
            </>
          )}

          {/* ----------------------------- USUARIOS ----------------------------- */}
          {active === "usuarios" && (
            <>
              {!showFormUser ? (
                <DataTable<UsuarioRow>
                  title={t("administration.tabs.usuarios")}
                  columns={usuarioCols}
                  data={usuarios}
                  onAdd={handleAddUser}
                  addLabel={t("administration.users.form.newTitle")}
                  onEdit={handleEditUser}
                  onDelete={handleDeleteUser}
                />
              ) : (
                <FormUser
                  defaultValue={buildUserDefaultFromRow(editingUser)}
                  onSubmit={handleFormSubmitUser}
                  onCancel={() => {
                    setShowFormUser(false);
                    setEditingUser(null);
                    setPendingPayloadUser(null);
                  }}
                />
              )}

              {/* Confirmaciones Usuarios */}
              {confirmKindUser === "create" || confirmKindUser === "update" ? (
                <ConfirmDialog
                  open={confirmOpenUser}
                  title={
                    confirmKindUser === "create"
                      ? t("administration.users.confirm.createTitle")
                      : t("administration.users.confirm.updateTitle")
                  }
                  description={
                    confirmKindUser === "create"
                      ? t("administration.users.confirm.createQuestion", {
                          name:
                            pendingPayloadUser?.nombre ??
                            editingUser?.nombre ??
                            "-",
                        })
                      : t("administration.users.confirm.updateQuestion", {
                          name:
                            pendingPayloadUser?.nombre ??
                            editingUser?.nombre ??
                            "-",
                        })
                  }
                  confirmText={
                    confirmKindUser === "create"
                      ? t("common.create")
                      : t("common.update")
                  }
                  cancelText={t("common.cancel")}
                  onConfirm={confirmCreateOrUpdateUser}
                  onCancel={cancelConfirmUser}
                  loading={loading}
                />
              ) : (
                <ConfirmDialog
                  open={confirmOpenUser && confirmKindUser === "delete"}
                  title={t("administration.users.confirm.deleteTitle")}
                  description={t("administration.users.confirm.deleteQuestion")}
                  confirmText={t("common.delete")}
                  cancelText={t("common.cancel")}
                  onConfirm={confirmDeleteUser}
                  onCancel={() => {
                    setConfirmOpenUser(false);
                    setPendingDeleteIdUser(null);
                    setConfirmKindUser(null);
                  }}
                  loading={loading}
                />
              )}
            </>
          )}

          {/* ---------------------- TIPOS DE PERSONAL DE SALUD ---------------------- */}
          {active === "tiposPersonal" && (
            <>
              {!showFormPT ? (
                <DataTable<IPersonalType>
                  title={t("administration.personalTypes.title")}
                  columns={ptColumns}
                  data={personalTypesFromStore}
                  onAdd={handleAddPT}
                  addLabel={t("administration.personalTypes.new")}
                  onEdit={handleEditPT}
                  onDelete={handleDeletePT}
                />
              ) : (
                <FormPersonalTypes
                  defaultValue={editingPT ?? undefined}
                  onSubmit={handleFormSubmitPT}
                  onCancel={() => {
                    setShowFormPT(false);
                    setEditingPT(null);
                    setPendingPayloadPT(null);
                  }}
                />
              )}

              {/* Confirmaciones Tipos de personal */}
              {confirmKindPT === "create" || confirmKindPT === "update" ? (
                <ConfirmDialog
                  open={confirmOpenPT}
                  title={
                    confirmKindPT === "create"
                      ? t("administration.personalTypes.confirm.createTitle")
                      : t("administration.personalTypes.confirm.updateTitle")
                  }
                  description={
                    confirmKindPT === "create"
                      ? t(
                          "administration.personalTypes.confirm.createQuestion",
                          {
                            name: pendingPayloadPT?.nombre ?? editingPT?.nombre,
                          },
                        )
                      : t(
                          "administration.personalTypes.confirm.updateQuestion",
                          {
                            name: pendingPayloadPT?.nombre ?? editingPT?.nombre,
                          },
                        )
                  }
                  confirmText={
                    confirmKindPT === "create"
                      ? t("common.create")
                      : t("common.update")
                  }
                  cancelText={t("common.cancel")}
                  onConfirm={confirmCreateOrUpdatePT}
                  onCancel={cancelConfirmPT}
                  loading={loading}
                />
              ) : (
                <ConfirmDialog
                  open={confirmOpenPT && confirmKindPT === "delete"}
                  title={t("administration.personalTypes.confirm.deleteTitle")}
                  description={t(
                    "administration.personalTypes.confirm.deleteQuestion",
                  )}
                  confirmText={t("common.delete")}
                  cancelText={t("common.cancel")}
                  onConfirm={confirmDeletePT}
                  onCancel={() => {
                    setConfirmOpenPT(false);
                    setPendingDeleteIdPT(null);
                    setConfirmKindPT(null);
                  }}
                  loading={loading}
                />
              )}
            </>
          )}
        </TabPanel>
      </TabsWrapper>
    </AdminCard>
  );
};

export default Administration;
