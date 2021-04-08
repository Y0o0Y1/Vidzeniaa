import React from "react";
import ReactPlayer from "react-player";


const VideoPlayer = ({ videoSrc, fileName ,color}) => {
  return (
    <div>
        <ReactPlayer controls url={videoSrc} />
    </div>
  );
};

export default VideoPlayer;
