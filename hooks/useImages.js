"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export const useImages = () => {
    const queryClient = useQueryClient();

    // ✅ Fetch images
    const {
        data,
        isLoading,
        isError,
        refetch, // 👈 add this
    } = useQuery({
        queryKey: ["images"],
        queryFn: async () => {
            const res = await axios.get("/api/images");
            return res.data.data || [];
        },
    });

    // ✅ Delete image
    const deleteImage = useMutation({
        mutationFn: async (id) => {
            await axios.delete("/api/images", { data: { id } });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["images"]);
        },
    });

    return {
        images: data || [],
        isLoading,
        isError,
        deleteImage,
        refetch, // ✅ now available
    };
};
