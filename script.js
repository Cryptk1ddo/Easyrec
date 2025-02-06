const startRecording = async () => {
    try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
            video: { mediaSource: "screen" },
            audio: true
        });
        
        const webcamStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        
        const mixedStream = new MediaStream([...screenStream.getTracks(), ...webcamStream.getTracks()]);
        
        const mediaRecorder = new MediaRecorder(mixedStream);
        let chunks = [];
        
        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                chunks.push(event.data);
            }
        };
        
        mediaRecorder.onstop = () => {
            const blob = new Blob(chunks, { type: "video/webm" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "recording.webm";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        };
        
        mediaRecorder.start();
        
        setTimeout(() => {
            mediaRecorder.stop();
        }, 10000); // Stops recording after 10s
        
        const videoElement = document.createElement("video");
        videoElement.srcObject = webcamStream;
        videoElement.style.position = "fixed";
        videoElement.style.bottom = "10px";
        videoElement.style.right = "10px";
        videoElement.style.width = "150px";
        videoElement.style.borderRadius = "50%";
        videoElement.style.zIndex = "1000";
        videoElement.autoplay = true;
        videoElement.draggable = true;
        document.body.appendChild(videoElement);
    } catch (error) {
        console.error("Error starting screen recording: ", error);
    }
};

document.getElementById("startBtn").addEventListener("click", startRecording);
