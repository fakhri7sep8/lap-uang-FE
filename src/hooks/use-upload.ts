import { axiosClient } from "@/lib/axiosClient"

const useUpload = () => {
  // upload ke backend sendiri
  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    return await axiosClient.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    };
    
    return {
        uploadFile
    }
}

export default useUpload