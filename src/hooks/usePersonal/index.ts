import { useCallback, useState } from "react";
import type { PersonalData, Applicant, CoApplicant } from "@data-types/personal/constants";
import { PERSONAL_MOCK } from "@mock/personal";

export type UsePersonalResult = {
  data: PersonalData;
  isLoading: boolean;
  updateApplicant: (fields: Partial<Applicant>) => void;
  updateCoApplicant: (id: string, fields: Partial<CoApplicant>) => void;
  addCoApplicant: (co: CoApplicant) => void;
};

export function usePersonal(): UsePersonalResult {
  const [data, setData] = useState<PersonalData>(PERSONAL_MOCK);
  const [isLoading] = useState(false);

  const updateApplicant = useCallback((fields: Partial<Applicant>) => {
    setData((prev) => ({
      ...prev,
      applicant: { ...prev.applicant, ...fields },
    }));
  }, []);

  const updateCoApplicant = useCallback((id: string, fields: Partial<CoApplicant>) => {
    setData((prev) => ({
      ...prev,
      coApplicants: prev.coApplicants.map((c) =>
        c.id === id ? { ...c, ...fields } : c,
      ),
    }));
  }, []);

  const addCoApplicant = useCallback((co: CoApplicant) => {
    setData((prev) => ({
      ...prev,
      coApplicants: [...prev.coApplicants, co],
    }));
  }, []);

  return { data, isLoading, updateApplicant, updateCoApplicant, addCoApplicant };
}
