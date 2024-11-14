import React, { useState, ChangeEvent, useRef } from "react";
import axios from "axios";
import { FaFileDownload } from "react-icons/fa";
import { LuUpload } from "react-icons/lu";

const Remover: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [finalUrl, setFinalUrl] = useState<string | null>(null);
  const [isUpload, setIsUpload] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null); 

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    let image = e.target.files?.[0]; // it will return only the first selected file
    setSelectedFile(image || null);
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return;

    setIsUpload(true);
    const formData = new FormData();
    formData.append("image_file", selectedFile!);
    formData.append("size", "auto");


    setTimeout(() => {
      setIsUpload(false);
      setSelectedFile(null); // Reset selected file after upload
  }, 2000);

    const api_key = process.env.REACT_APP_API_BG as string;

    // send to the server
    try {
      const response = await axios.post(
        "https://api.remove.bg/v1.0/removebg",
        formData,
        {
          headers: {
            "X-Api-Key": api_key,
          },
          responseType: "blob", // Specify the response type as blob
        }
      );

      const url = URL.createObjectURL(response.data);
      setFinalUrl(url);
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setIsUpload(false);
    }
  };

  const handleLabelClick = () => {
    fileInputRef.current?.click(); // Trigger a click on the file input
};

  return (
    <section className="flex">
            <div className="bg-black h-screen w-[400px] pl-4 text-white">
                <div className="mt-10 ">
                    <h4 className="text-4xl">Remove Background </h4>
                    <h4 className="text-2xl">With Ease </h4>
                </div>
                
                <form className="mt-16 flex items-center">
                    <label  className="cursor-pointer border rounded-full bg-purple-500 border-white px-8 py-2" onClick={handleLabelClick}>
                    {selectedFile ? selectedFile.name.length > 6 ? `${selectedFile.name.slice(0, 6)}...` : selectedFile.name : "Select a File"}
                    </label>
                    <input
                    type="file"
                    id="userImg"
                    className=" hidden"
                    onChange={handleFileInputChange}
                    ref={fileInputRef}
                    required
                    />
                    {!isUpload ? (
                    <button type="button" onClick={handleFileUpload} className=" ml-4 text-3xl ">
                        <LuUpload />
                    </button>
                    ) : (
                    <button type="button" className="ml-4" disabled={true}>
                        Uploading...
                    </button>
                    )}
                </form>
                
            </div>
            <div className="bg-gray-900 p-4 w-[1134px] flex flex-col justify-center items-center relative">
    {finalUrl ? (
        <>
            <a href={finalUrl} download="Removed Background.png">
                <button className="absolute top-4 right-4 flex items-center bg-purple-500 text-white px-4 py-2 rounded">
                    Download 
                    <div className="px-2">
                        <FaFileDownload />
                    </div>
                </button>
            </a>
            <div className="flex justify-center items-center mt-20">
                <img src={finalUrl} alt="final_img" className="" />
            </div>
        </>
    ) : (
        <p className="text-gray-500 text-center my-auto">No image available</p> // Placeholder text
    )}
</div>

    </section>
  );
};

export default Remover;
