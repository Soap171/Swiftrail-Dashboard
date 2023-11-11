import React, { useState } from 'react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import Hero from '../Components/Hero';
import qRImg from '../Assets/QR.jpg';
import QRCodeScanner from '../Components/QRCodeScanner';
import supabase from '../config/supabaseClient';
import axios from 'axios';

function QR_Scanner() {
  const [customerNIC, setCustomerNIC] = useState('');
  const [balance, setBalance] = useState('');
  const [fee, setFee] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [scannedQR, setScannedQR] = useState(null);
  const [transactionID, setTransactionID] = useState('');
  const { v4: uuidv4 } = require('uuid');
  const uniqueIdentifier = uuidv4();


  const handleQRScan = (scannedData) => {
    const parsedData = JSON.parse(scannedData);
    setScannedQR(parsedData);
  
    if (parsedData.customerNIC) {
      setCustomerNIC(parsedData.customerNIC);
    }
  
    if (parsedData.balance) {
      setBalance(parsedData.balance);
  }

  
  if (parsedData.transactionID) {
    setTransactionID(parsedData.transactionID);
  }
};
  

  const handleUpdateBalance = async () => {


    if (scannedQR && customerNIC && balance !== '' && phoneNumber !== '') {
     
      const updatedBalance = parseFloat(balance) - parseFloat(fee);
     

      try {
        const { data, error } = await supabase
          .from('customerSubscription')
          .update({ balance: updatedBalance })
          .eq('customerNIC', customerNIC)
          .eq('subscriptionId', transactionID);

        if (error) {
          console.error('Error updating balance:', error.message);
        } else {
          alert('Balance updated successfully');
          const smsMessage = `Deducted Amount: ${fee} on ${new Date()}. Unique Identifier: ${uniqueIdentifier} valid for 24 Hours`;
         //sendSMS(phoneNumber, smsMessage); 
         console.log(smsMessage)
        }
      } catch (error) {
        console.error('Error updating balance:', error.message);
      }
    } else {
      alert('Please provide all necessary details');
    }
  };

  const sendSMS = async () => {
    let formattedPhoneNumber = phoneNumber;
    if (!phoneNumber.startsWith('94')) {
      formattedPhoneNumber = `94${phoneNumber}`;
    }
  
    console.log('Formatted Phone Number:', formattedPhoneNumber);
  
    const data = {
      message: `Deducted Amount: ${fee} on ${new Date()}. Unique Identifier: ${uniqueIdentifier} valid for 24 Hours`,
      phoneNumber: formattedPhoneNumber,
    };
  
    try {
      const response = await axios.post('https://doubtful-hare-sweatshirt.cyclic.app/send-sms', data);
      console.log('SMS sent:', response.data);
    } catch (error) {
      console.error('Failed to send SMS:', error);
    }
    
  };

  const handleUpdateAndSendSMS = async () => {
    // Call the function to update the balance
    await handleUpdateBalance();
    
    // Call the function to send SMS
    await sendSMS();
  };
  

  return (
    <>
      <Navbar />
      <Hero cName="hero-other" heroImg={qRImg} title="QR Ticketing" />
      <div className="container mt-4 d-flex justify-content-center align-items-center">
        <div className="mb-4">
          {scannedQR && (
            <div className="row">
              <div className="col-md-8 mx-auto p-4 border rounded">
                <p className="mb-3">Scanned QR data:</p>
                <div className="p-3">
              {Object.keys(scannedQR).map((key) => (
                <p key={key}>
                  <strong>{key}:</strong> {scannedQR[key]}
                </p>
              ))}
            </div>
                <input
                  type="number"
                  className="form-control mb-3"
                  placeholder="Enter Fee"
                  value={fee}
                  onChange={(e) => setFee(e.target.value)}
                />
                <input
                  type="text"
                  className="form-control mb-3"
                  placeholder="Enter Phone Number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
               <button onClick={handleUpdateAndSendSMS} className="btn btn-primary">
                  Update Balance and Send SMS
               </button>
              </div>
            </div>
          )}
          <QRCodeScanner onQRScan={handleQRScan} />
        </div>
      </div>
      <Footer />
    </>
  );
}

export default QR_Scanner;
