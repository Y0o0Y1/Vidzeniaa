import React, { useState } from "react";
import axios from "axios";
import Progress from "./ProgressBar";
import "./uploadSection.scss";
import VideoPlayer from "./VideoPlayer";

const UploadSection = () => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState();
  const [videoUrl, setVideoUrl] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [title, setTitle] = useState(null);
  const [preview, setPreview] = useState(false);
  const [titleColor, setTitleColor] = useState("black");
  const onChange = (e) => {
    const size = Math.floor(e.target.files[0].size / 1000000.0);
    if (size <= 500) {
      setFile(e.target.files[0]);
      setFileName(e.target.files[0].name);
      setTitle(e.target.files[0].name);
      console.log(e.target.files[0]);
      console.log(file);
      const reader = new FileReader();
      reader.onload = function (e) {
        setVideoUrl(e.target.result);
      };
      reader.readAsDataURL(e.target.files[0]);
    } else {
      alert("File Cannot Exceed 500 MB");
    }
  };

  const handleClick = async () => {
    const data = new FormData();
    data.append("file", file);
    console.log(data);
    const res = await axios.post("/upload", data, {
      onUploadProgress: (progressEvent) => {
        setUploadPercentage(
          parseInt(
            Math.round((progressEvent.loaded * 100) / progressEvent.total)
          )
        );
        // Clear percentage
        setTimeout(() => {
          setUploadPercentage(0);
        }, 10000);
      },
    });
    setUploadedFile(res);
    console.log(uploadedFile);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
  };
  const handlePreview = () => {
    if (file) setPreview(true);
    else {
      alert("Please Select a Video to Preview");
    }
  };

  const changeTitle = (e) => {
    console.log(e.target.value);
    e.target.value ? setTitle(e.target.value) : setTitle(fileName);
  };

  const handleColorPicker = (e) => {
    console.log(e.target.value);
    setTitleColor(e.target.value);
  };
  return (
    <div className="upload-section ">
      <form
        method="POST"
        encType="multipart/form-data"
        action="/upload"
        onSubmit={handleSubmit}
      >
        <input className="input" accept="video/mp4" type="file" name="video" onChange={onChange} />
        <button type="button" onClick={handlePreview}>
          Preview
        </button>
      </form>
      {preview ? (
        <div className="container">
          <div className="video-section">
            <h1 style={{ textAlign: "center" }}>Preview </h1>
            <h3 className="video-title" style={{ color: `${titleColor}` }}>
              {title}
            </h3>
            {videoUrl ? (
              <div className="player-wrapper">
                <VideoPlayer className="video-player" videoSrc={videoUrl} />
                <div className="color-picker-wrapper">
                  <label>Change Title Color</label>
                  <input
                    className="color-picker"
                    type="color"
                    onChange={handleColorPicker}
                  ></input>
                </div>
              </div>
            ) : null}
          </div>
          <div className="submission-form">
            <form onSubmit={handleSubmit}>
              <input
                className="input-title"
                type="text"
                maxlength="50"
                placeholder="Change Video Title"
                onChange={changeTitle}
              ></input>
              <button type="button" onClick={handleClick}>
                Upload
              </button>
            </form>
            <Progress percentage={uploadPercentage} />
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default UploadSection;
