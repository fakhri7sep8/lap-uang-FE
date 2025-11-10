interface FormValues {
  studentIds: string[]; // <--- penting
  name: string;
  semester: number | "";
  TA: string;
  type: string;
  nominal: number | "";
}

export default FormValues