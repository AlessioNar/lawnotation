import { Annotation, LSSerializedAnnotation } from "@/types/annotation"

export const useAnnotationApi = () => {
  const supabase = useSupabaseClient();

  const convert_ls2db = (
    anns: LSSerializedAnnotation,
    assignment_id: number
  ): Omit<Annotation, "id">[] => {
    console.log("ls2db", anns);
    return anns.map((ann) => {
      return {
        ls_id: ann.id,
        origin: ann.origin,
        start_index: ann.value.start,
        end_index: ann.value.end,
        text: ann.value.text,
        label: ann.value.labels[0],
        assignment_id: assignment_id,
      };
    });
  };

  const convert_db2ls = (
    anns: Annotation[],
    assignment_id: number
  ): LSSerializedAnnotation => {
    const arr = anns.map((a) => {
      return {
        id: a.ls_id,
        origin: a.origin,
        from_name: "label",
        to_name: "text",
        type: "labels",
        value: {
          start: a.start_index,
          end: a.end_index,
          text: a.text,
          labels: [a.label],
        },
      };
    });

    return arr;
  };

  // Create
  const createAnnotation = async (
    fields: Omit<Annotation, "id">
  ): Promise<Annotation> => {
    const { data, error } = await supabase
      .from("annotations")
      .insert(fields)
      .select()
      .single();
    if (error) throw Error(`Error in createAnnotation: ${error.message}`);
    else return data as Annotation;
  };

  // Read
  const findAnnotation = async (id: string): Promise<Annotation> => {
    const { data, error } = await supabase
      .from("annotations")
      .select()
      .eq("id", id)
      .single();

    if (error) throw Error(`Error in findAnnotation: ${error.message}`);
    else return data as Annotation;
  };

  // Read all
  const findAnnotations = async (
    assignment_id: string
  ): Promise<Annotation[]> => {
    const { data, error } = await supabase
      .from("annotations")
      .select()
      .eq("assignment_id", assignment_id);

    if (error) throw Error(`Error in findAnnotation: ${error.message}`);
    else return data as Annotation[];
  };

  const findAnnotationsByTaskAndDocumentAndLabelsAndAnnotators = async (
    task_id: string,
    document_id: string,
    label: string,
    annotators: string[]
  ): Promise<Annotation[]> => {
    const { data, error } = await supabase
      .from("annotations")
      .select(
        "start_index, end_index, label, text, assignment:assignments!inner(task_id, document_id, annotator:users!inner(email))"
      )
      .eq("assignments.task_id", task_id)
      .eq("assignments.document_id", document_id)
      .eq("label", label)
      .in("assignments.users.email", annotators);

    if (error)
      throw Error(
        `Error in findAnnotationsByTaskAndDocumentAndLabel: ${error.message}`
      );
    else return data as Annotation[];
  };

  // Update
  const updateAnnotation = async (
    id: string,
    fields: Partial<Annotation>
  ): Promise<boolean> => {
    const { data, error } = await supabase
      .from("annotations")
      .update(fields)
      .eq("id", id);

    if (error) throw Error(`Error in updateAnnotation: ${error.message}`);
    else return true;
  };

  // Update
  const updateAssignmentAnnotations = async (
    assignment_id: number,
    annotations: Omit<Annotation, "id">[]
  ): Promise<Annotation[] | null> => {
    const query_delete = await supabase
      .from("annotations")
      .delete()
      .eq("assignment_id", assignment_id);

    if (query_delete.error)
      throw Error(
        `Unable to delete annotations on update: ${query_delete.error.message}`
      );
    const query_insert = await supabase
      .from("annotations")
      .insert(annotations)
      .select();
    if (query_insert.error)
      throw Error(
        `Unable to insert annotations on update: ${query_insert.error.message}`
      );

    annotations.push(...query_insert.data);
    console.log("updated annotations: ", query_insert.data);

    return query_insert.data;
  };

  // Delete
  const deleteAnnotation = async (id: string) => {
    const { data, error } = await supabase
      .from("annotations")
      .delete()
      .eq("id", id);

    if (error) throw Error(`Error in deleteAnnotation: ${error.message}`);
    else return true;
  };

  return {
    createAnnotation,
    findAnnotation,
    findAnnotations,
    findAnnotationsByTaskAndDocumentAndLabelsAndAnnotators,
    updateAnnotation,
    updateAssignmentAnnotations,
    deleteAnnotation,
    convert_ls2db,
    convert_db2ls,
  };
};