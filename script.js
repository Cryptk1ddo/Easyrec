Screen Recorder
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
38
39
40
41
42
43
44
45
46
47
48
49
50
51
52
53
54
55
56
57
58
59
60
61
62
63
64
65
66
67
68
69
70
71
72
73
74
75
76
77
78
79
80
81
82
83
84
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
        let startTime = Date.now();
        let timerInterval;
        
        const updateTimer = () => {
            const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
            const minutes = String(Math.floor(elapsedTime / 60)).padStart(2, '0');
            const seconds = String(elapsedTime % 60).padStart(2, '0');
            timerDisplay.textContent = `${minutes}:${seconds}`;
        };
        
        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                chunks.push(event.data);
            }
        };
        
        mediaRecorder.onstop = () => {
            clearInterval(timerInterval);
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
        timerInterval = setInterval(updateTimer, 1000);
        
        setTimeout(() => {
            mediaRecorder.stop();
        }, 2700000); // Stops recording after 45 minutes
        
        const timerDisplay = document.createElement("div");
        timerDisplay.style.position = "fixed";
        timerDisplay.style.top = "10px";
        timerDisplay.style.left = "10px";
        timerDisplay.style.background = "rgba(0, 0, 0, 0.7)";
        timerDisplay.style.color = "white";
        timerDisplay.style.padding = "5px 10px";
        timerDisplay.style.borderRadius = "5px";
        timerDisplay.style.fontFamily = "Arial, sans-serif";
        document.body.appendChild(timerDisplay);
        
        const videoElement = document.createElement("video");
        videoElement.srcObject = webcamStream;
        videoElement.style.position = "fixed";
        videoElement.style.bottom = "10px";
        videoElement.style.right = "10px";
        videoElement.style.width = "150px";
        videoElement.style.borderRadius = "50%";
        videoElement.style.overflow = "hidden";
        videoElement.style.zIndex = "1000";
        videoElement.autoplay = true;
        videoElement.draggable = true;
        document.body.appendChild(videoElement);
        
        videoElement.addEventListener("wheel", (event) => {
            event.preventDefault();
            let currentSize = parseInt(videoElement.style.width);
            let newSize = event.deltaY < 0 ? currentSize + 10 : currentSize - 10;
            videoElement.style.width = `${Math.max(50, Math.min(newSize, 300))}px`;
        });
    } catch (error) {
        console.error("Error starting screen recording: ", error);
    }
};

document.getElementById("startBtn").addEventListener("click", startRecording);
