import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export const getProfileById = async (id: string) => {
    const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
        console.error("Error fetching profile by ID:", error);
        throw error;
    }
    return {
        ...data,
        firstname: data.first_name,
        lastname: data.last_name,
        avatar: data.avatar_url || "/images/Blank_Profile.jpg",
    };
};

export const updateProfile = async (data: any) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { error } = await supabase
        .from("profiles")
        .update({
            first_name: data.firstname,
            last_name: data.lastname,
            updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

    if (error) throw error;
};

export const updatePassword = async (password: string) => {
    const { error } = await supabase.auth.updateUser({ password });
    if (error) throw error;
};
