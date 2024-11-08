import React, { useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import axios from "axios";

const QrCodeVoting = () => {
  const [qrResult, setQrResult] = useState("");
  const [voteCount, setVoteCount] = useState(10); // Number of votes
  const [delay, setDelay] = useState(1000); // Delay in ms
  const [isVoting, setIsVoting] = useState(false); // Voting state

  // Handle QR code image upload and decode
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const html5QrCode = new Html5Qrcode("qr-reader");

      // Use the library to scan the uploaded image
      html5QrCode
        .scanFile(file, true)
        .then((decodedText) => {
          setQrResult(decodedText); // Store the decoded URL
          console.log(`QR Code URL: ${decodedText}`);
          html5QrCode.clear(); // Clear the scanner
        })
        .catch((err) => console.error("QR Code scan error:", err));
    }
  };

  // Function to start automated voting
  const startVoting = async () => {
    if (!qrResult) {
      alert("Please upload a QR code image first.");
      return;
    }

    setIsVoting(true);

    const proxyUrl = "https://cors-anywhere.herokuapp.com/";
    const targetUrl = qrResult;
    const voteCount = 10;   // Number of votes
    const delay = 1000;     // Delay in milliseconds between each vote
    
    const startVoting = async () => {
      if (!qrResult) {
        alert("Please provide a valid QR code URL.");
        return;
      }
    
      for (let i = 0; i < voteCount; i++) {
        try {
          const response = await axios.get(proxyUrl + targetUrl);  // Use proxy URL for each request
          if (response.status === 200) {
            console.log(`Vote ${i + 1} cast successfully!`);
          } else {
            console.log(`Failed to cast vote ${i + 1}: ${response.status}`);
          }
        } catch (error) {
          console.error(`Error casting vote ${i + 1}:`, error);
        }
    
        // Wait for the specified delay before sending the next request
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    };
    
    // Example function call (start voting)
    startVoting();
    

    setIsVoting(false);
  };

  return (
    <div>
      <h1>QR Code Voting System</h1>

      <div>
        <label>Upload QR Code Image:</label>
        <input type="file" accept="image/*" onChange={handleImageUpload} />
      </div>

      <div id="qr-reader" style={{ display: "none" }}></div>

      <p>
        Decoded URL: <strong>{qrResult}</strong>
      </p>

      <div>
        <label>Number of Votes:</label>
        <input
          type="number"
          value={voteCount}
          onChange={(e) => setVoteCount(Number(e.target.value))}
        />
      </div>

      <div>
        <label>Delay between Votes (ms):</label>
        <input
          type="number"
          value={delay}
          onChange={(e) => setDelay(Number(e.target.value))}
        />
      </div>

      <button onClick={startVoting} disabled={isVoting}>
        {isVoting ? "Voting..." : "Start Voting"}
      </button>
    </div>
  );
};

export default QrCodeVoting;
