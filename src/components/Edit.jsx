import React, { useState } from 'react';
import { useLocation } from "react-router-dom";
import axios from 'axios';
import { serverHost } from '../constants';

export default function Edit() {

    const [uploadSuccess, setUploadSuccess] = useState(false);

    const location = useLocation();

const filename = location.state?.filename;
const description = location.state?.description;

const [prompt, setPrompt] = useState(description || "");

    const handleSubmit = async () => {
        console.log(prompt + " : " + filename);
    //attempt to upload
    try {
      
      //const  prompts = prompt("Please enter a prompt for the image(s) you are uploading (optional):");
    const res = await axios.post(
    `${serverHost}/api/updateDescription`,
    {
        filename,
        description: prompt
    }
);

console.log("SERVER RESPONSE:", res.data);

      // Optionally, you can navigate to another page or show a success message here

      setUploadSuccess(true);


    } catch (err) {
      console.error("Upload failed:", err);
    }
    
    };
   


if (uploadSuccess) {
    return (
        <main className="min-h-screen flex justify-center items-center">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-green-600">
                    Description Updated!
                </h1>

                <p className="mt-4">
                    The description for <strong>{filename}</strong> was successfully saved.
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
                src={`${serverHost}/api/accepted/${filename}`}
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
