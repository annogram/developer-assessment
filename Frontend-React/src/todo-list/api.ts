import { useMutation, useQuery } from "@tanstack/react-query"
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
    return useMutation<void, Error, Todo>({
        mutationFn: async (todo) => {
            const url = `${API_URL}/${todo.id}`;
            await axios.put<Todo>(url, todo);
        }
    })
}