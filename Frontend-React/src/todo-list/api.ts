import { MutationOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { Todo } from "./types/entry";
import axios from "axios";

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

export const useUpdateEntryMutation = (options?: MutationOptions<void, Error, Todo>) => {
    const queryClient = useQueryClient();
    return useMutation<void, Error, Todo>({
        mutationKey: todoListQueryKeys.entries,
        mutationFn: async (todo) => {
            const url = `${API_URL}/${todo.id}`;
            await axios.put<Todo>(url, todo);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: todoListQueryKeys.entries });
        }
    })
}

export const useCreateEntryMutation = (options?: MutationOptions<Todo, Error, Pick<Todo, 'description' | 'isCompleted'>>) => {
    const queryClient = useQueryClient();
    return useMutation<Todo, Error, Pick<Todo, 'description' | 'isCompleted'>>({
        mutationKey: todoListQueryKeys.entries,
        mutationFn: async (todo) => {
            const response = await axios.post<Todo>(API_URL, todo);
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