import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
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

export const useUpdateEntryMutation = () => {
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

export const useCreateEntryMutation = () => {
    const queryClient = useQueryClient();
    return useMutation<void, Error, Pick<Todo, 'description' | 'isCompleted'>>({
        mutationKey: todoListQueryKeys.entries,
        mutationFn: async (todo) => {
            await axios.post<Todo>(API_URL, todo);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: todoListQueryKeys.entries });
        }
    })
}