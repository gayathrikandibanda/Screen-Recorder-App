MERN Take-Home Assignment: Screen Recorder App
Goal
Build and deploy a small web app that records the active browser tab’s screen with microphone audio and allows users to preview, download, and upload the recording to a simple MERN backend.
Requirements
Frontend (React)
Record the current tab (Chrome required)
Capture video + mic audio using navigator.mediaDevices.getDisplayMedia and MediaRecorder.
Provide Start / Stop buttons.
Show a live timer.
Limit: max 3 minutes per recording.
Playback & Download
After stopping, show a preview player.
Provide a Download button.
Upload to Backend
Upload the recording to a Node/Express API.
Display a success/failure message.
Recordings List
Simple page that lists uploaded recordings with:
Title, size, created date
Inline play option
