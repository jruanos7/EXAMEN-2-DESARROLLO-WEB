// src/components/VacancyCard.tsx
import type { Vacancy } from "../types";

interface VacancyCardProps {
  vacancy: Vacancy;
  onEdit?: (vacancy: Vacancy) => void;
  onDelete?: (id: number) => void;
}

const estadoConfig = {
  abierta: { bg: "bg-green-100", text: "text-green-800", label: "Abierta" },
  cerrada: { bg: "bg-red-100", text: "text-red-800", label: "Cerrada" },
};

const modalidadLabels: Record<Vacancy["modalidad"], string> = {
  presencial: "Presencial",
  remoto: "Remoto",
  híbrido: "Híbrido",
};

function VacancyCard({ vacancy, onEdit, onDelete }: VacancyCardProps) {
  const {
    puesto,
    departamento,
    modalidad,
    salarioOfrecido,
    fechaPublicacion,
    estado,
    candidatosPostulados,
  } = vacancy;
  const estadoStyle = estadoConfig[estado];

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 w-full hover:shadow-md transition-all duration-200">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="font-semibold text-slate-900 truncate">{puesto}</h3>
          <p className="text-sm text-slate-500 truncate">{departamento}</p>
        </div>
        <span
          className={`text-xs px-2.5 py-1 rounded-full font-medium whitespace-nowrap ${estadoStyle.bg} ${estadoStyle.text}`}
        >
          {estadoStyle.label}
        </span>
      </div>

      <div className="mt-4 space-y-1 text-sm text-slate-600">
        <p>
          Modalidad:{" "}
          <span className="font-medium text-slate-800">
            {modalidadLabels[modalidad]}
          </span>
        </p>
        <p>
          Salario ofrecido:{" "}
          <span className="font-medium text-slate-800">
            ${salarioOfrecido.toLocaleString()}
          </span>
        </p>
        <p>
          Publicada:{" "}
          <span className="font-medium text-slate-800">{fechaPublicacion}</span>
        </p>
        <p>
          Candidatos postulados:{" "}
          <span className="font-medium text-slate-800">
            {candidatosPostulados}
          </span>
        </p>
      </div>

      <div className="mt-4 flex justify-end gap-2">
        {onEdit && (
          <button
            onClick={() => onEdit(vacancy)}
            className="w-7 h-7 rounded-full bg-brand-600 text-white text-xs shadow-sm hover:opacity-90"
            aria-label="Editar vacante"
            title="Editar vacante"
          >
            ✎
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => onDelete(vacancy.id)}
            className="w-7 h-7 rounded-full bg-red-500 text-white text-sm shadow-sm hover:opacity-90"
            aria-label="Eliminar vacante"
            title="Eliminar vacante"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}

export default VacancyCard;
