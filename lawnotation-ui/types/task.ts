export type Task = {
  id: number;
  name: string;
  desc: string;
  project_id: number;
  labelset_id: number;
  ann_guidelines: string;
  annotation_level: AnnotationLevels;
};

export enum AnnotationLevels {
  SYMBOL = 'symbol',
  WORD = 'word', 
  SENTENCE = 'sentence', 
  PARAGRAPH = 'paragraph',
  DOCUMENT= 'document',
}