export interface getStudent {
  id: string;
  name: string;
  InductNumber: string;
  generation: number;
  status: string;
  major: string;
  dorm: string;
}

export interface updateStudent {
  name?: string;
  InductNumber?: string;
  generation?: number;
  status?: string;
  major?: string;
  dorm?: string;
}

export interface createStudent {
  name: string;
  InductNumber: string;
  generation: number;
  status: string;
  major: string;
  dorm: string;
}
