import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import type { Vacancy } from "../types/Vacancy";

const API_URL = "http://localhost:3001/vacancies";

export function useVacancies(filters?: { search?: string; estado?: string }) {
  return useQuery<Vacancy[], Error>({
    queryKey: ["vacancies", filters],
    queryFn: async () => {
      const res = await axios.get(API_URL, { params: filters });
      return res.data;
    },
  });
}

export function useCreateVacancy() {
  const queryClient = useQueryClient();
  return useMutation<Vacancy, Error, Vacancy>({
    mutationFn: async (newVacancy: Vacancy) => {
      const res = await axios.post(API_URL, newVacancy);
      return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["vacancies"] }),
  });
}

export function useUpdateVacancy() {
  const queryClient = useQueryClient();
  return useMutation<Vacancy, Error, { id: number; data: Partial<Vacancy> }>({
    mutationFn: async ({ id, data }) => {
      const res = await axios.put(`${API_URL}/${id}`, data);
      return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["vacancies"] }),
  });
}

export function useDeleteVacancy() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: async (id: number) => {
      await axios.delete(`${API_URL}/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["vacancies"] }),
  });
}
