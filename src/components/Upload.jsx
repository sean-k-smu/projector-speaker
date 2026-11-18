import React, { useState } from 'react';
import { useLocation } from "react-router-dom";
import axios from 'axios';
import { serverHost } from '../constants';

export default function Upload() {

    const [uploadSuccess, setUploadSuccess] = useState(false);

    const [prompt, setPrompt] = useState("");

    const handleSubmit = async () => {
        console.log(prompt + " : " + file.name);
        formData.append("prompt", prompt);
    //attempt to upload
    try {
      
      //const  prompts = prompt("Please enter a prompt for the image(s) you are uploading (optional):");
      const res = await axios.post(
        `${serverHost}/api/upload`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      //ensuring it goes through
      console.log("SERVER RESPONSE:", res.data);

      // Optionally, you can navigate to another page or show a success message here

      setUploadSuccess(true);


    } catch (err) {
      console.error("Upload failed:", err);
    }
    
    };
    const location = useLocation();

    const file = location.state?.file;
    const formData = location.state?.formData;

if (uploadSuccess) {
    return (
        <main className="min-h-screen flex justify-center items-center">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-green-600">
                    Upload Successful!
                </h1>

                <p className="mt-4">
                    Your image has been submitted for administrative review.
                </p>
            </div>
        </main>
    );
}
    return (
        <main className="min-h-screen flex justify-center items-center">

            <div className="flex flex-col items-center gap-6">

                <img 
                style={{ maxWidth: "600px", maxHeight: "600px" }}
                src={URL.createObjectURL(file)}
                alt="Preview"
            />

                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Enter a description..."
                    className="w-96 h-40 border rounded-lg p-3"
                />

                <button
                    onClick={handleSubmit}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                >
                    Submit
                </button>

            </div>

        </main>
    );
}
