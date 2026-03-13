import { createClient as getSupabaseClient } from '@/utils/supabase/client';

const supabase = getSupabaseClient();

// Clinic File interface
export interface ClinicFile {
    id: string;
    clinicId: string;
    uploadedBy: string;
    uploadedByName?: string;
    fileName: string;
    fileTags: string[];
    fileUrl: string;
    fileSize?: number;
    fileType?: string;
    createdAt: string;
}

// Get all clinic files
export const getClinicFiles = async (clinicId: string): Promise<ClinicFile[]> => {
    const { data, error } = await supabase
        .from('clinic_files')
        .select(`
            *,
            uploader:profiles!uploaded_by(first_name, last_name)
        `)
        .eq('clinic_id', clinicId)
        .order('created_at', { ascending: false });

    if (error) throw error;

    return (data || []).map(file => ({
        id: file.id,
        clinicId: file.clinic_id,
        uploadedBy: file.uploaded_by,
        uploadedByName: file.uploader
            ? `${file.uploader.first_name} ${file.uploader.last_name}`
            : undefined,
        fileName: file.file_name,
        fileTags: file.file_tags || [],
        fileUrl: file.file_url,
        fileSize: file.file_size,
        fileType: file.file_type,
        createdAt: file.created_at
    }));
};

// Upload a clinic file
export const uploadClinicFile = async (
    clinicId: string,
    uploadedBy: string,
    fileName: string,
    file: File,
    tags: string[] = []
): Promise<string> => {
    // 1. Upload file to storage
    const fileExt = file.name.split('.').pop();
    const storagePath = `clinic-files/${clinicId}/${Date.now()}_${file.name}`;

    const { error: uploadError } = await supabase
        .storage
        .from('clinic-files')
        .upload(storagePath, file);

    if (uploadError) throw uploadError;

    // 2. Get public URL
    const { data: urlData } = supabase
        .storage
        .from('clinic-files')
        .getPublicUrl(storagePath);

    // 3. Create database record
    const { data, error: dbError } = await supabase
        .from('clinic_files')
        .insert({
            clinic_id: clinicId,
            uploaded_by: uploadedBy,
            file_name: fileName,
            file_tags: tags,
            file_url: urlData.publicUrl,
            file_size: file.size,
            file_type: file.type
        })
        .select('id')
        .single();

    if (dbError) throw dbError;
    return data.id;
};

// Delete a clinic file
export const deleteClinicFile = async (fileId: string, fileUrl: string): Promise<void> => {
    // 1. Extract storage path from URL
    const urlParts = fileUrl.split('/clinic-files/');
    if (urlParts.length > 1) {
        const storagePath = `clinic-files/${urlParts[1]}`;

        // Delete from storage (ignore errors if file doesn't exist)
        await supabase.storage.from('clinic-files').remove([storagePath]);
    }

    // 2. Delete database record
    const { error } = await supabase
        .from('clinic_files')
        .delete()
        .eq('id', fileId);

    if (error) throw error;
};

// Update clinic file (name and tags)
export const updateClinicFile = async (
    fileId: string,
    fileName: string,
    tags: string[]
): Promise<void> => {
    const { error } = await supabase
        .from('clinic_files')
        .update({
            file_name: fileName,
            file_tags: tags,
            updated_at: new Date().toISOString()
        })
        .eq('id', fileId);

    if (error) throw error;
};
