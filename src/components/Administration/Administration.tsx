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
  // USUARIOS
  fetchUsers,
  //MUNICIPIOS
  fetchMunicipios,
} from "../../redux/actions/administrationActions";

import { IRoles } from "../../interfaces/user";
import {
  IConfigAttentionTypes,
  IPersonalType,
  IUserListItem,
  IMunicipio,
} from "../../interfaces/administration";

import { Column, DataTable } from "../Common/table/DataTable";
import ConfirmDialog from "../Common/confirmDialog/ConfirmDialog";
import LoadingSpinner from "../Shared/LoadingSpinner/LoadingSpinner";

import FormRole from "./forms/roles/FormRole";
import FormAttentionTypes from "./forms/attention-types/FormAttentionTypes";
import FormPersonalTypes from "./forms/personal-types/FormPersonalTypes";
import FormUser, { IUserForm } from "./forms/users/FormUser";
import { useTranslation } from "react-i18next";
import { registerUser } from "../../redux/actions/userActions";

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

  // USUARIOS Y MUNICIPIOS
  const usersFromStore =
    useSelector((s: AppState) => s.administration.users) ?? [];
  const municipiosFromStore =
    useSelector((s: AppState) => s.administration.municipios) ?? [];

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

  // USUARIOS (lista) + MUNICIPIOS + TIPOS DE PERSONAL (para mapear nombres)
  React.useEffect(() => {
    if (active === "usuarios") {
      if (usersFromStore.length === 0) dispatchThunk(fetchUsers());
      if (municipiosFromStore.length === 0) dispatchThunk(fetchMunicipios());
      if (personalTypesFromStore.length === 0)
        dispatchThunk(fetchConfigPersonalTypes());
    }
  }, [
    active,
    usersFromStore.length,
    municipiosFromStore.length,
    personalTypesFromStore.length,
    dispatchThunk,
  ]);

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

  /* ----------------------------- USUARIOS (LISTA) ----------------------------- */

  // Helpers de mapeo
  const municipioNameById = React.useCallback(
    (id?: number) =>
      municipiosFromStore.find((m: IMunicipio) => m.id === id)?.nombre ?? "-",
    [municipiosFromStore],
  );

  const personalTypeNameById = React.useCallback(
    (id?: number) =>
      personalTypesFromStore.find((p) => p.id === id)?.nombre ?? "-",
    [personalTypesFromStore],
  );

  // Columnas para la lista de usuarios
  const usuarioCols: Column<IUserListItem>[] = [
    {
      key: "nombre",
      header: t("administration.users.columns.nombre", "Nombre"),
      render: (row) => row.nombre,
    },
    {
      key: "apellidos",
      header: t("administration.users.columns.apellidos", "Apellidos"),
      render: (row) => row.apellidos,
    },
    {
      key: "correo",
      header: t("administration.users.columns.correo", "Correo"),
      render: (row) => row.correo,
    },
    {
      key: "celular",
      header: t("administration.users.columns.celular", "Celular"),
      width: "160px",
      render: (row) => row.celular,
    },
    {
      key: "id_municipio",
      header: t("administration.users.columns.municipio", "Municipio"),
      render: (row) => municipioNameById(row.id_municipio),
    },
    {
      key: "id_tipo_personal_salud",
      header: t(
        "administration.users.columns.tipoPersonal",
        "Tipo personal salud",
      ),
      render: (row) => personalTypeNameById(row.id_tipo_personal_salud),
    },
    {
      key: "rol_nombre",
      header: t("administration.users.columns.rol", "Rol"),
      width: "180px",
      render: (row) => row.rol_nombre ?? "—",
    },
  ];

  // Handlers “conservados” para el DataTable de usuarios
  const [showFormUser, setShowFormUser] = React.useState(false);
  const [editingUser, setEditingUser] = React.useState<IUserListItem | null>(
    null,
  );
  type ConfirmKindUser = "create" | "update" | "delete" | null;
  const [confirmKindUser, setConfirmKindUser] =
    React.useState<ConfirmKindUser>(null);
  const [confirmOpenUser, setConfirmOpenUser] = React.useState(false);
  const [pendingPayloadUser, setPendingPayloadUser] =
    React.useState<IUserForm | null>(null);
  const [, setPendingDeleteIdUser] = React.useState<string | null>(null);

  const handleAddUser = () => {
    if (loading) return;
    setEditingUser(null);
    setPendingPayloadUser(null);
    setShowFormUser(true);
  };

  // Recibe el payload del FormUser
  const handleFormSubmitUser = (payload: IUserForm) => {
    setPendingPayloadUser(payload);
    setConfirmKindUser(editingUser ? "update" : "create");
    setConfirmOpenUser(true);
  };

  // >>> AHORA CREA USUARIO (solo create); update/delete después
  const confirmCreateOrUpdateUser = async () => {
    if (!pendingPayloadUser) return;

    try {
      if (confirmKindUser === "create") {
        await dispatchThunk(
          registerUser({
            nombre: pendingPayloadUser.nombre,
            apellidos: pendingPayloadUser.apellidos,
            correo: pendingPayloadUser.correo,
            celular: pendingPayloadUser.celular,
            id_tipo_personal_salud: pendingPayloadUser.id_tipo_personal_salud,
            id_municipio: pendingPayloadUser.id_municipio,
            // password NO se envía; backend lo genera
            creado_por: pendingPayloadUser.creado_por!, // viene seteado en el form con userId
            actualizado_por: pendingPayloadUser.creado_por!,
          }),
        );
        await dispatchThunk(fetchUsers());
      } else if (confirmKindUser === "update" && editingUser) {
        // pendiente para después
      }
    } finally {
      setConfirmOpenUser(false);
      setShowFormUser(false);
      setEditingUser(null);
      setPendingPayloadUser(null);
      setConfirmKindUser(null);
    }
  };

  const cancelConfirmUser = () => setConfirmOpenUser(false);

  const handleEditUser = (row: IUserListItem) => {
    if (loading) return;
    setEditingUser(row);
    setPendingPayloadUser(null);
    setShowFormUser(true);
  };

  const handleDeleteUser = (row: IUserListItem) => {
    if (loading) return;
    setPendingDeleteIdUser(String(row.id));
    setConfirmKindUser("delete");
    setConfirmOpenUser(true);
  };

  const confirmDeleteUser = async () => {
    // pendiente para después
    setConfirmOpenUser(false);
    setPendingDeleteIdUser(null);
    setConfirmKindUser(null);
  };

  // Para edición, mapeamos el row parcial a defaultValue del form
  const buildUserDefaultFromRow = (
    row: IUserListItem | null,
  ): Partial<IUserForm & { id?: number }> | undefined => {
    if (!row) return undefined;
    return {
      id: row.id,
      nombre: row.nombre,
      apellidos: row.apellidos,
      correo: row.correo,
      celular: row.celular,
      id_municipio: row.id_municipio,
      id_tipo_personal_salud: row.id_tipo_personal_salud,
      // creado_por se setea dentro del FormUser con el userId actual
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

          {/* ----------------------------- USUARIOS (LISTA) ----------------------------- */}
          {active === "usuarios" && (
            <>
              {!showFormUser ? (
                <DataTable<IUserListItem>
                  title={t("administration.tabs.usuarios")}
                  columns={usuarioCols}
                  data={usersFromStore}
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
