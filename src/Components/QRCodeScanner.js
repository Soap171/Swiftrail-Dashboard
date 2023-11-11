import React, { useRef, useState } from 'react';
import jsQR from 'jsqr';

function QRCodeScanner({ onQRScan }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [availableBalance, setAvailableBalance] = useState('N/A');

  const scanQRCode = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: 'environment' } })
      .then(function (stream) {
        video.srcObject = stream;
        video.setAttribute('playsinline', true);
        video.play();
      })
      .catch(function (err) {
        console.error('Error accessing the camera:', err);
      });

    const drawFrame = () => {
      requestAnimationFrame(drawFrame);
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.height = video.videoHeight;
        canvas.width = video.videoWidth;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

        // Use jsQR to try to find a QR code in the image
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        if (code) {
          // QR code found
          setAvailableBalance(code.data);
          onQRScan(code.data); // Pass the scanned value to the parent component
          video.srcObject.getTracks().forEach(track => track.stop()); // Stop the camera
        }
      }
    };
    drawFrame();
  };

  return (
    <div className="container-fluid">
      <h1 className="mt-4">QR Code Scanner</h1>
      <div className="row mt-4">
        <div className="col">
          <div id="scanner">
            <video ref={videoRef} className="w-100"></video>
            <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
          </div>
        </div>
      </div>
      <div className="row mt-4">
        <div className="col">
          <div id="result">
            <button onClick={scanQRCode} className="btn btn-primary mb-2">Start Scanning</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QRCodeScanner;
