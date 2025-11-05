import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function ImgForm() {
  const [file, setFile] = useState(null);
  const [filename, setFilename] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  const handleUpload = async () => {
    if (!file) {
      console.log("no file selected");
      return;
    }

    const maxSizeInBytes = 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      alert("File size exceeds 1MB limit. Please select a smaller file.");
      return;
    }

    const fd = new FormData();
    fd.append("file", file);
    setIsUploading(true);
    axios
      .post(`${import.meta.env.VITE_SERVER_URL}/predict`, fd, {
        onUploadProgress: (progressEvent) => {
          console.log(progressEvent.progress * 100);
          setProgress(Math.round((progressEvent.progress * 100)));
        }
      })
      .then((res) => {
        console.log(res.data.prediction);
        setIsUploading(false);
        localStorage.setItem("resultVal", res.data.prediction);
        navigate("/predict");
      })
      .catch((err) => {
        console.error(err)
        setIsUploading(false);
      });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    
    if (!selectedFile) return;

    const maxSizeInBytes = 1024 * 1024; // 1MB
    if (selectedFile.size > maxSizeInBytes) {
      alert("File size exceeds 1MB limit. Please select a smaller file.");
      e.target.value = '';
      setFile(null);
      setFilename("");
      setImageUrl("");
      return;
    }

    setFile(selectedFile);
    setFilename(selectedFile.name);
    setImageUrl(URL.createObjectURL(selectedFile));
  };

  return (
    <div >
        {
          isUploading ? (
            <div className="imgf">
              <div className="progress-bar">
                <img src={imageUrl} alt="Uploaded" />
  
                <div
                  className="progress"
                  style={{ width: `${progress}%`}}
                >{`${progress}%`}</div>
              </div>
            </div>
          ) : (
            <div className="imgf">
              <input
                type="file"
                id="file-input"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
              <label htmlFor="file-input" className="custom-file-upload">
                Choose File
              </label>
              <span className="file-name">{filename}</span>
              <button type="submit" onClick={handleUpload} className="upload-btn">
                Upload
              </button>
            </div>
          )
        }
    </div>
  );
}
