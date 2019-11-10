export interface Manifest {
  schema: Schema;
  model: string;
  preview?: string;
  model_low_poly?: string;
  turntable?: string[];
}

export interface Schema {
  version: number;
  type: string;
}