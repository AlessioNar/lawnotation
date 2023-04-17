
export type Document = {
  id: number,
  name: string,
  Document_id: number,
  source: string,
  full_text: string
}

export const useDocumentApi = () => {
  const supabase = useSupabaseClient();
  
  // Create
  const createDocument = async (fields: Omit<Document, 'id'>): Promise<Document> => {
    const { data, error } = await supabase.from("documents").insert(fields).select().single();
    if (error)
      throw Error(`Error in createDocument: ${error.message}`)
    else
      return data as Document;
  };

  // Read
  const findDocument = async (id: string): Promise<Document>   => {
    const { data, error } = await supabase.from("documents").select().eq("id", id).single();

    if (error)
      throw Error(`Error in findDocument: ${error.message}`)
    else
      return data as Document
  };

  // Read all
  const findDocuments = async (project_id: string): Promise<Document[]> => {
    const { data, error } = await supabase.from("documents").select().eq("project_id", project_id);
    
    if (error)
      throw Error(`Error in findDocument: ${error.message}`)
    else
      return data as Document[]
  };

  // Update
  const updateDocument = async (id: string, fields: Partial<Document>): Promise<boolean> => {
    const { data, error } = await supabase.from("documents").update(fields).eq("id", id);
    
    if (error)
      throw Error(`Error in updateDocument: ${error.message}`)
    else
      return true;
  };

  // Update
  const deleteDocument = async (id: string) => {
    const { data, error } = await supabase.from("documents").delete().eq("id", id);

    if (error)
      throw Error(`Error in deleteDocument: ${error.message}`)
    else
      return true;
  };

  return {createDocument, findDocument, findDocuments, updateDocument, deleteDocument}
}