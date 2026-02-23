import { CheckCircle2 } from "lucide-react";
import type { WizardStep } from "./WizardTypes";

interface StepDef {
  num: WizardStep;
  label: string;
}

const STEPS: StepDef[] = [
  { num: 1, label: "Upload / Add Clients" },
  { num: 2, label: "Company Info" },
  { num: 3, label: "People (CA / BO)" },
  { num: 4, label: "Exemption" },
  { num: 5, label: "Attestation" },
  { num: 6, label: "Review & Submit" },
];

interface Props {
  current: WizardStep;
  onStepClick?: (step: WizardStep) => void;
  completedSteps?: Set<number>;
}

export default function WizardStepIndicator({ current, onStepClick, completedSteps }: Props) {
  return (
    <div className="w-full overflow-x-auto">
      <div className="flex items-center justify-between min-w-[600px] px-2">
        {STEPS.map((s, idx) => {
          const isActive = s.num === current;
          const isDone = completedSteps?.has(s.num) || s.num < current;
          const isClickable = onStepClick && (isDone || s.num <= current);

          return (
            <div key={s.num} className="flex items-center flex-1 last:flex-none">
              {/* Step circle */}
              <button
                type="button"
                disabled={!isClickable}
                onClick={() => isClickable && onStepClick?.(s.num)}
                className={`
                  flex items-center justify-center w-9 h-9 rounded-full text-sm font-semibold shrink-0
                  transition-colors duration-200
                  ${isActive
                    ? "bg-[#00274E] text-white ring-2 ring-yellow-400 ring-offset-2"
                    : isDone
                      ? "bg-green-600 text-white"
                      : "bg-gray-200 text-gray-500"
                  }
                  ${isClickable ? "cursor-pointer hover:ring-2 hover:ring-[#00274E]/30" : "cursor-default"}
                `}
              >
                {isDone && !isActive ? <CheckCircle2 className="w-5 h-5" /> : s.num}
              </button>

              {/* Label */}
              <span className={`ml-2 text-xs whitespace-nowrap ${isActive ? "text-[#00274E] font-semibold" : isDone ? "text-green-700" : "text-gray-400"}`}>
                {s.label}
              </span>

              {/* Connector line */}
              {idx < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-3 ${isDone ? "bg-green-400" : "bg-gray-200"}`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
