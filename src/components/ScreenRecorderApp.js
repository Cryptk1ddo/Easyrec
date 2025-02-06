import React, { useState, useRef } from 'react';
import { Camera, Monitor, Video, Square, CheckCircle } from 'lucide-react';

const ScreenRecorderApp = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedVideo, setRecordedVideo] = useState(null);
  const [recordingType, setRecordingType] = useState(null);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);

  const startRecording = async (type) => {
    try {
      let stream;
      if (type === 'screen') {
        stream = await navigator.mediaDevices.getDisplayMedia({ 
          video: true, 
          audio: true 
        });
      } else if (type === 'webcam') {
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: true, 
          audio: true 
        });
      }

      streamRef.current = stream;
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const chunks = [];
      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const videoURL = URL.createObjectURL(blob);
        setRecordedVideo(videoURL);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingType(type);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      streamRef.current.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      setRecordingType(null);
    }
  };

  const downloadVideo = () => {
    if (recordedVideo) {
      const link = document.createElement('a');
      link.href = recordedVideo;
      link.download = `recording-${new Date().toISOString()}.webm`;
      link.click();
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">Screen Recorder</h1>
      
      {!isRecording && !recordedVideo && (
        <div className="flex justify-center space-x-4 mb-6">
          <button 
            onClick={() => startRecording('screen')} 
            className="flex items-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            <Monitor className="mr-2" /> Screen Recording
          </button>
          <button 
            onClick={() => startRecording('webcam')} 
            className="flex items-center bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            <Camera className="mr-2" /> Webcam Recording
          </button>
        </div>
      )}

      {isRecording && (
        <div className="text-center">
          <div className="flex justify-center items-center mb-4">
            <Video className="text-red-500 mr-2 animate-pulse" />
            <span className="text-lg font-semibold">
              Recording {recordingType === 'screen' ? 'Screen' : 'Webcam'}
            </span>
          </div>
          <button 
            onClick={stopRecording} 
            className="flex items-center mx-auto bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            <Square className="mr-2" /> Stop Recording
          </button>
        </div>
      )}

      {recordedVideo && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4 text-center">Recording Preview</h2>
          <video 
            src={recordedVideo} 
            controls 
            className="mx-auto max-w-full rounded shadow-md mb-4"
          />
          <div className="flex justify-center space-x-4">
            <button 
              onClick={downloadVideo} 
              className="flex items-center bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              <CheckCircle className="mr-2" /> Download Video
            </button>
            <button 
              onClick={() => setRecordedVideo(null)} 
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Discard
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScreenRecorderApp;
