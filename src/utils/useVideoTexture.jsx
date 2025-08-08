import { useEffect, useRef, useState } from "react";
import { VideoTexture } from "three";
import * as THREE from "three";

export const useVideoTexture = (url) => {
  const [texture, setTexture] = useState(null);
  const videoRef = useRef(document.createElement("video"));

  useEffect(() => {
    const video = videoRef.current;
    video.src = url;
    video.crossOrigin = "anonymous";
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    video.autoplay = true;

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch((e) => console.warn("Autoplay failed:", e));
    }

    const videoTexture = new VideoTexture(video);
    videoTexture.minFilter = THREE.LinearFilter;
    videoTexture.magFilter = THREE.LinearFilter;
    videoTexture.format = THREE.RGBFormat;

    setTexture(videoTexture);
  }, [url]);

  return texture;
};
