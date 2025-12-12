// WebRTC utilities with Expo Go compatibility
// WebRTC requires a development build - this file provides safe fallbacks for Expo Go

let RTCPeerConnection: any = null;
let isWebRTCAvailable = false;

try {
  const webrtc = require('react-native-webrtc');
  RTCPeerConnection = webrtc.RTCPeerConnection;
  isWebRTCAvailable = true;
} catch (e) {
  console.warn('WebRTC not available - requires development build');
}

export { isWebRTCAvailable };

export const peerConstraints = {
  iceServers: [
    {
      urls: 'stun:stun.l.google.com:19302',
    },
    {
       urls: 'stun:stun1.l.google.com:19302',
    },
  ],
};

export const sessionConstraints = {
  mandatory: {
    OfferToReceiveAudio: true,
    OfferToReceiveVideo: true,
    VoiceActivityDetection: true,
  },
};

export const createPeerConnection = () => {
  if (!isWebRTCAvailable || !RTCPeerConnection) {
    throw new Error('WebRTC is not available. Please use a development build.');
  }
  return new RTCPeerConnection(peerConstraints);
};

export const stopStream = (stream: any) => {
  if (stream) {
    if (stream.getTracks) {
        stream.getTracks().forEach((track: any) => track.stop());
    } else {
        stream.release();
    }
  }
};
