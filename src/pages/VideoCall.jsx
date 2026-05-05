import React, { useEffect, useRef, useState, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { io } from 'socket.io-client'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'

const ICE_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ],
}

const VideoCall = () => {
  const { roomId } = useParams()
  const { backendUrl, userData } = useContext(AppContext)
  const navigate = useNavigate()

  const localVideoRef = useRef(null)
  const remoteVideoRef = useRef(null)
  const peerRef = useRef(null)
  const socketRef = useRef(null)
  const localStreamRef = useRef(null)

  const [callStatus, setCallStatus] = useState('connecting') // connecting | active | ended
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [remoteJoined, setRemoteJoined] = useState(false)
  const [callDuration, setCallDuration] = useState(0)
  const timerRef = useRef(null)

  // Determine role from URL query
  const role = new URLSearchParams(window.location.search).get('role') || 'patient'

  useEffect(() => {
    startCall()
    return () => cleanup()
  }, [])

  // Call duration timer
  useEffect(() => {
    if (callStatus === 'active') {
      timerRef.current = setInterval(() => setCallDuration(d => d + 1), 1000)
    }
    return () => clearInterval(timerRef.current)
  }, [callStatus])

  const formatDuration = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0')
    const s = (secs % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  const startCall = async () => {
    try {
      // Get local media
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      localStreamRef.current = stream
      if (localVideoRef.current) localVideoRef.current.srcObject = stream

      // Connect socket
      const socket = io(backendUrl)
      socketRef.current = socket

      // Join room
      socket.emit('join-room', { roomId, userId: userData?._id, role })

      // Other peer joined → initiate offer (first joiner waits, second sends offer)
      socket.on('user-joined', async ({ socketId, role: otherRole }) => {
        setRemoteJoined(true)
        setCallStatus('active')
        toast.success('Other participant joined!')

        // Create peer and send offer
        const peer = createPeer(stream, socket)
        peerRef.current = peer

        const offer = await peer.createOffer()
        await peer.setLocalDescription(offer)
        socket.emit('offer', { roomId, offer })
      })

      // Receive offer → send answer
      socket.on('offer', async ({ offer }) => {
        setRemoteJoined(true)
        setCallStatus('active')

        const peer = createPeer(stream, socket)
        peerRef.current = peer

        await peer.setRemoteDescription(new RTCSessionDescription(offer))
        const answer = await peer.createAnswer()
        await peer.setLocalDescription(answer)
        socket.emit('answer', { roomId, answer })
      })

      // Receive answer
      socket.on('answer', async ({ answer }) => {
        if (peerRef.current) {
          await peerRef.current.setRemoteDescription(new RTCSessionDescription(answer))
        }
      })

      // ICE candidates
      socket.on('ice-candidate', async ({ candidate }) => {
        if (peerRef.current && candidate) {
          try { await peerRef.current.addIceCandidate(new RTCIceCandidate(candidate)) } catch (e) {}
        }
      })

      // Call ended by other party
      socket.on('call-ended', () => {
        toast.info('Call ended by the other participant')
        setCallStatus('ended')
        cleanup()
      })

    } catch (error) {
      console.error('Video call error:', error)
      if (error.name === 'NotAllowedError') {
        toast.error('Camera/Microphone permission denied!')
      } else {
        toast.error('Failed to start video call: ' + error.message)
      }
    }
  }

  const createPeer = (stream, socket) => {
    const peer = new RTCPeerConnection(ICE_SERVERS)

    // Add local tracks
    stream.getTracks().forEach(track => peer.addTrack(track, stream))

    // Receive remote stream
    peer.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0]
      }
    }

    // Send ICE candidates
    peer.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit('ice-candidate', { roomId, candidate: event.candidate })
      }
    }

    return peer
  }

  const cleanup = () => {
    clearInterval(timerRef.current)
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(t => t.stop())
    }
    if (peerRef.current) peerRef.current.close()
    if (socketRef.current) socketRef.current.disconnect()
  }

  const endCall = () => {
    socketRef.current?.emit('end-call', { roomId })
    setCallStatus('ended')
    cleanup()
    toast.info('Call ended')
    setTimeout(() => navigate(-1), 1500)
  }

  const toggleMute = () => {
    const audioTrack = localStreamRef.current?.getAudioTracks()[0]
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled
      setIsMuted(!audioTrack.enabled)
    }
  }

  const toggleVideo = () => {
    const videoTrack = localStreamRef.current?.getVideoTracks()[0]
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled
      setIsVideoOff(!videoTrack.enabled)
    }
  }

  return (
    <div className="fixed inset-0 bg-gray-900 flex flex-col z-50">

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-gray-800 bg-opacity-80">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">Rx</span>
          </div>
          <div>
            <p className="text-white font-semibold text-sm">Prescripto Video Consultation</p>
            <p className="text-gray-400 text-xs">Room: {roomId}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {callStatus === 'active' && (
            <div className="flex items-center gap-2 bg-green-500 bg-opacity-20 px-3 py-1 rounded-full">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span className="text-green-400 text-sm font-medium">{formatDuration(callDuration)}</span>
            </div>
          )}
          {callStatus === 'connecting' && (
            <div className="flex items-center gap-2 bg-yellow-500 bg-opacity-20 px-3 py-1 rounded-full">
              <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
              <span className="text-yellow-400 text-sm">Waiting for other participant...</span>
            </div>
          )}
        </div>
      </div>

      {/* Video Area */}
      <div className="flex-1 relative flex items-center justify-center p-4">

        {/* Remote Video (main) */}
        <div className="w-full h-full max-w-4xl relative rounded-2xl overflow-hidden bg-gray-800">
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
          {!remoteJoined && (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center mb-4">
                <span className="text-4xl">👨‍⚕️</span>
              </div>
              <p className="text-white text-lg font-medium mb-2">
                {role === 'patient' ? 'Waiting for Doctor...' : 'Waiting for Patient...'}
              </p>
              <p className="text-gray-400 text-sm">Share the room link to connect</p>
              <div className="flex gap-2 mt-4">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay:'0ms'}}></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay:'150ms'}}></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay:'300ms'}}></div>
              </div>
            </div>
          )}
        </div>

        {/* Local Video (picture-in-picture) */}
        <div className="absolute bottom-8 right-8 w-36 h-28 sm:w-48 sm:h-36 rounded-xl overflow-hidden border-2 border-gray-600 shadow-xl bg-gray-800">
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            className={`w-full h-full object-cover ${isVideoOff ? 'hidden' : ''}`}
          />
          {isVideoOff && (
            <div className="w-full h-full flex items-center justify-center bg-gray-700">
              <span className="text-3xl">👤</span>
            </div>
          )}
          <div className="absolute bottom-1 left-2">
            <span className="text-white text-xs bg-black bg-opacity-50 px-2 py-0.5 rounded-full">
              You ({role})
            </span>
          </div>
        </div>

        {/* Call Ended overlay */}
        {callStatus === 'ended' && (
          <div className="absolute inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center rounded-2xl">
            <span className="text-5xl mb-4">📞</span>
            <p className="text-white text-xl font-bold mb-2">Call Ended</p>
            <p className="text-gray-400 mb-6">Duration: {formatDuration(callDuration)}</p>
            <button onClick={() => navigate(-1)}
              className="bg-primary text-white px-6 py-2 rounded-full hover:bg-primary-dark transition">
              Go Back
            </button>
          </div>
        )}
      </div>

      {/* Controls */}
      {callStatus !== 'ended' && (
        <div className="flex items-center justify-center gap-4 py-6 bg-gray-800 bg-opacity-80">
          {/* Mute */}
          <button onClick={toggleMute}
            className={`w-14 h-14 rounded-full flex items-center justify-center text-xl transition-all ${
              isMuted ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-600 hover:bg-gray-500'
            }`}
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? '🔇' : '🎤'}
          </button>

          {/* End Call */}
          <button onClick={endCall}
            className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center text-2xl transition-all shadow-lg"
            title="End Call"
          >
            📵
          </button>

          {/* Video toggle */}
          <button onClick={toggleVideo}
            className={`w-14 h-14 rounded-full flex items-center justify-center text-xl transition-all ${
              isVideoOff ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-600 hover:bg-gray-500'
            }`}
            title={isVideoOff ? 'Turn on camera' : 'Turn off camera'}
          >
            {isVideoOff ? '📷' : '📹'}
          </button>
        </div>
      )}

      {/* Room link share */}
      {callStatus === 'connecting' && (
        <div className="px-6 py-3 bg-gray-800 text-center">
          <p className="text-gray-400 text-xs mb-2">Share this link with the other participant:</p>
          <div className="flex items-center justify-center gap-2">
            <code className="text-primary text-xs bg-gray-700 px-3 py-1 rounded-full">
              {window.location.href}
            </code>
            <button
              onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success('Link copied!') }}
              className="text-xs bg-primary text-white px-3 py-1 rounded-full hover:bg-primary-dark transition"
            >
              Copy
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default VideoCall
