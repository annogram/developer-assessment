import { MutationOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { Todo } from "./types/entry";
import axios, { AxiosError } from "axios";

const API_URL = process.env.REACT_APP_API_URL;

export const todoListQueryKeys = {
    entries: ['entries'] as const,
    entry: (id: string) => ['entries', id] as const
}

export const useGetEntries = () => {
    const url = `${API_URL}`;
    return useQuery<Todo[]>({
        queryKey: todoListQueryKeys.entries,
        queryFn: async () => {
            const response = await axios.get<Todo[]>(url);
            return response.data;
        }
    });
}

export const useUpdateEntryMutation = (options?: MutationOptions<void, AxiosError<string>, Todo>) => {
    const queryClient = useQueryClient();
    return useMutation<void, AxiosError<string>, Todo>({
        mutationKey: todoListQueryKeys.entries,
        mutationFn: async (todo) => {
            const url = `${API_URL}/${todo.id}`;
            try {
                await axios.put<Todo>(url, todo);
            } catch (error ) {
                const axiosError = error as AxiosError<string>;
                axiosError.response.data = axiosError.response?.data.replace(/\r|\n/g, '<br />');
                throw axiosError;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: todoListQueryKeys.entries });
        },
        onError: (error) => {
            console.error(error);
        }
    })
}

export const useCreateEntryMutation = (options?: MutationOptions<Todo, AxiosError<string>, Pick<Todo, 'description' | 'isCompleted'>>) => {
    const queryClient = useQueryClient();
    return useMutation<Todo, AxiosError<string>, Pick<Todo, 'description' | 'isCompleted'>>({
        mutationKey: todoListQueryKeys.entries,
        mutationFn: async (todo) => {
            let response;
            try {
                response = await axios.post<Todo>(API_URL, todo);
            } catch (error) {
                const axiosError = error as AxiosError<string>;
                axiosError.response.data = axiosError.response?.data.replace(/\r|\n/g, '<br />');
                throw axiosError;
            }
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: todoListQueryKeys.entries });
        }
    })
}

export const useDeleteEntryMutation = (options?: MutationOptions<void, Error, string>) => {
    const queryClient = useQueryClient();
    return useMutation<void, Error, string>({
        mutationKey: todoListQueryKeys.entries,
        mutationFn: async (id) => {
            const url = `${API_URL}/${id}`;
            await axios.delete(url);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: todoListQueryKeys.entries });
        }
    })
}