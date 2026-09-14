'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Camera, RefreshCw, Upload, Check, AlertCircle, Video } from 'lucide-react';

interface CameraCaptureProps {
  onCapture: (dataUrl: string) => void;
}

export default function CameraCapture({ onCapture }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [streamActive, setStreamActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const startCamera = async () => {
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API not supported in this browser.');
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setStreamActive(true);
      }
    } catch (err: any) {
      console.warn('Camera access issue:', err);
      setCameraError(err.message || 'Camera permission denied or camera not found.');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((t) => t.stop());
      videoRef.current.srcObject = null;
      setStreamActive(false);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      setCapturedImage(dataUrl);
      onCapture(dataUrl);
      stopCamera();
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    startCamera();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setCapturedImage(result);
        onCapture(result);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="space-y-4">
      <canvas ref={canvasRef} className="hidden" />

      {/* Captured Image Preview */}
      {capturedImage ? (
        <div className="relative rounded-xl overflow-hidden border-2 border-gold-500 bg-dark-900 shadow-gold-glow">
          <img
            src={capturedImage}
            alt="Captured evidence"
            className="w-full h-64 sm:h-80 object-cover"
          />
          <div className="absolute top-3 right-3 flex items-center gap-2">
            <span className="px-2.5 py-1 rounded bg-emerald-600 text-white text-xs font-bold flex items-center gap-1 shadow">
              <Check className="w-3.5 h-3.5" /> Photo Attached
            </span>
          </div>
          <div className="absolute bottom-3 left-3 right-3 flex justify-between gap-2">
            <button
              type="button"
              onClick={retakePhoto}
              className="bg-dark-950/90 text-white px-3 py-1.5 rounded-lg text-xs font-semibold border border-dark-700 hover:bg-dark-800 transition flex items-center gap-1.5 shadow"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Retake Photo
            </button>
          </div>
        </div>
      ) : streamActive ? (
        /* Live Video Stream View */
        <div className="relative rounded-xl overflow-hidden border border-dark-750 bg-black">
          <video
            ref={videoRef}
            playsInline
            muted
            className="w-full h-64 sm:h-80 object-cover"
          />
          <div className="absolute top-3 left-3 px-2 py-0.5 rounded bg-red-600/90 text-white text-[10px] font-mono font-bold flex items-center gap-1 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-white"></span> LIVE CAMERA
          </div>
          <div className="absolute bottom-4 inset-x-0 flex justify-center items-center gap-4">
            <button
              type="button"
              onClick={capturePhoto}
              className="w-14 h-14 rounded-full bg-gold-500 text-black flex items-center justify-center shadow-gold-glow hover:scale-105 transition-all border-4 border-white"
              title="Capture"
            >
              <Camera className="w-6 h-6" />
            </button>
            <button
              type="button"
              onClick={stopCamera}
              className="px-3 py-1.5 rounded-lg bg-dark-900/90 text-white text-xs font-semibold border border-dark-700"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        /* Action Launcher (Start Camera or Upload) */
        <div className="border-2 border-dashed border-dark-700 hover:border-gold-500/50 rounded-xl p-6 sm:p-8 text-center bg-dark-900/50 transition-colors">
          <div className="max-w-sm mx-auto space-y-3">
            <div className="w-12 h-12 rounded-full bg-dark-800 border border-gold-500/30 text-gold-400 mx-auto flex items-center justify-center">
              <Camera className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-white">Capture Photographic Evidence</h4>
            <p className="text-xs text-slate-400">
              Provide visual documentation to trigger AI visual assessment and detect road damage, water leaks, or hazards.
            </p>

            {cameraError && (
              <div className="text-[11px] text-amber-400 bg-amber-500/10 p-2 rounded border border-amber-500/20 flex items-center gap-1.5 text-left">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{cameraError} You can upload an image file directly.</span>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={startCamera}
                className="w-full sm:w-auto bg-gold-500 hover:bg-gold-400 text-black px-4 py-2 rounded-lg text-xs font-bold shadow-gold-glow transition flex items-center justify-center gap-1.5"
              >
                <Video className="w-4 h-4" />
                <span>Open Live Camera</span>
              </button>

              <label className="w-full sm:w-auto bg-dark-800 hover:bg-dark-750 text-white px-4 py-2 rounded-lg text-xs font-semibold border border-dark-700 cursor-pointer transition flex items-center justify-center gap-1.5">
                <Upload className="w-4 h-4 text-slate-400" />
                <span>Upload From Device</span>
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
