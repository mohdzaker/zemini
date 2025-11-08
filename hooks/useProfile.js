"use client";
import { useQuery } from "@tanstack/react-query";
import { getProfile } from "@/actions/getProfile";

export const useProfile = () => {
    return useQuery({
        queryKey: ["profile"],
        queryFn: async () => await getProfile(),
        staleTime: 0,
    });
};
