import { useCallback, useState } from "react";
import type { CompanyData } from "@data-types/company/constants";
import { COMPANY_MOCK } from "@mock/company";

export type UseCompanyResult = {
  data: CompanyData;
  isLoading: boolean;
  updateCompany: (fields: Partial<CompanyData>) => void;
};

export function useCompany(): UseCompanyResult {
  const [data, setData] = useState<CompanyData>(COMPANY_MOCK);
  const [isLoading] = useState(false);

  const updateCompany = useCallback((fields: Partial<CompanyData>) => {
    setData((prev) => ({ ...prev, ...fields }));
  }, []);

  return { data, isLoading, updateCompany };
}
