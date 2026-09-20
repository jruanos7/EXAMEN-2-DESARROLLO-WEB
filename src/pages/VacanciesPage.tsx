// src/pages/VacanciesPage.tsx
import { useState, useCallback, useMemo } from "react";
import type { Vacancy, VacancyStatus } from "../types";
import VacancyCard from "../components/VacancyCard";
import StatsBadge from "../components/StatsBadge";
import FormField from "../components/FormField";
import Modal from "../components/Modal";
import VacancyForm from "../components/VacancyForm";
import {
  useVacancies,
  useCreateVacancy,
  useUpdateVacancy,
  useDeleteVacancy,
} from "../hooks/useVacancies";
import type { VacancyFormData } from "../schemas/vacancySchema";

const formFieldClass =
  "w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";

function VacanciesPage() {
  const [search, setSearch] = useState<string>("");
  const [selectedEstado, setSelectedEstado] = useState<VacancyStatus | "">("");

  const {
    data,
    isLoading: loading,
    isError,
    error: queryError,
  } = useVacancies({
    search: search || undefined,
    estado: selectedEstado || undefined,
  });
  const vacancies = data?.data || [];

  const { data: allData } = useVacancies({});
  const allVacancies = useMemo(() => allData?.data ?? [], [allData]);
  const totalVacancies = allVacancies.length;
  const openVacancies = allVacancies.filter(
    (v) => v.estado === "abierta",
  ).length;
  const closedVacancies = allVacancies.filter(
    (v) => v.estado === "cerrada",
  ).length;

  const createVacancy = useCreateVacancy();
  const updateVacancy = useUpdateVacancy();
  const deleteVacancy = useDeleteVacancy();

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editingVacancy, setEditingVacancy] = useState<Vacancy | undefined>();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleDeleteVacancy = useCallback(
    (id: number) => {
      if (!confirm("¿Estás seguro de eliminar esta vacante?")) return;
      deleteVacancy.mutate(id);
    },
    [deleteVacancy],
  );

  const handleOpenCreate = useCallback(() => {
    setEditingVacancy(undefined);
    setSubmitError(null);
    setModalOpen(true);
  }, []);

  const handleOpenEdit = useCallback((vacancy: Vacancy) => {
    setEditingVacancy(vacancy);
    setSubmitError(null);
    setModalOpen(true);
  }, []);

  const handleSubmit = useCallback(
    async (formData: VacancyFormData) => {
      setSubmitError(null);
      try {
        if (editingVacancy) {
          await updateVacancy.mutateAsync({
            id: editingVacancy.id,
            data: formData,
          });
        } else {
          await createVacancy.mutateAsync(formData);
        }
        setModalOpen(false);
      } catch {
        setSubmitError("No se pudo guardar la vacante. Intenta de nuevo.");
      }
    },
    [editingVacancy, createVacancy, updateVacancy],
  );

  const estados: VacancyStatus[] = ["abierta", "cerrada"];
  const estadoLabels: Record<VacancyStatus, string> = {
    abierta: "Abierta",
    cerrada: "Cerrada",
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Gestión de Vacantes
          </h2>
          <p className="text-slate-500 mt-1">
            {loading
              ? "Cargando..."
              : `${vacancies.length} de ${totalVacancies} vacantes`}
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="px-4 py-2 bg-brand-800 hover:bg-brand-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          + Nueva vacante
        </button>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <StatsBadge
          label="Total de vacantes"
          value={totalVacancies}
          variant="blue"
        />
        <StatsBadge
          label="Vacantes abiertas"
          value={openVacancies}
          variant="green"
        />
        <StatsBadge
          label="Vacantes cerradas"
          value={closedVacancies}
          variant="red"
        />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6 flex flex-wrap items-end gap-3">
        <FormField label="Buscar" className="flex-1 min-w-[220px]">
          <input
            type="text"
            placeholder="Buscar por puesto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={formFieldClass}
          />
        </FormField>

        <FormField label="Estado" className="min-w-[160px]">
          <select
            value={selectedEstado}
            onChange={(e) =>
              setSelectedEstado(e.target.value as VacancyStatus | "")
            }
            className={formFieldClass}
          >
            <option value="">Todos los estados</option>
            {estados.map((estado) => (
              <option key={estado} value={estado}>
                {estadoLabels[estado]}
              </option>
            ))}
          </select>
        </FormField>

        {(search || selectedEstado) && (
          <button
            onClick={() => {
              setSearch("");
              setSelectedEstado("");
            }}
            className="px-3 py-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg text-sm transition-colors"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {loading && (
        <div className="flex items-center justify-center py-16 text-slate-400">
          <div className="animate-spin w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full mr-3" />
          <span>Cargando vacantes...</span>
        </div>
      )}

      {isError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-700 font-medium">
            Error al cargar las vacantes
          </p>
          <p className="text-red-500 text-sm mt-1">
            {(queryError as Error)?.message || "Error desconocido"}
          </p>
        </div>
      )}

      {!loading && !isError && vacancies.length === 0 && (
        <div className="text-center py-12 text-slate-500">
          <p>No se encontraron vacantes con los filtros aplicados.</p>
        </div>
      )}

      {!loading && !isError && vacancies.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {vacancies.map((vacancy) => (
            <VacancyCard
              key={vacancy.id}
              vacancy={vacancy}
              onEdit={handleOpenEdit}
              onDelete={handleDeleteVacancy}
            />
          ))}
        </div>
      )}

      <Modal
        isOpen={modalOpen}
        title={
          editingVacancy ? `Editar: ${editingVacancy.puesto}` : "Nueva vacante"
        }
        onClose={() => setModalOpen(false)}
      >
        <VacancyForm
          vacancy={editingVacancy}
          onSubmit={handleSubmit}
          onCancel={() => setModalOpen(false)}
          isLoading={createVacancy.isPending || updateVacancy.isPending}
          error={submitError}
        />
      </Modal>
    </div>
  );
}

export default VacanciesPage;
