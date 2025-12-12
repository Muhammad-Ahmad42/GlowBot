import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Alert, Platform } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '../../utils/Colors';
import { ms, textScale, verticalScale, horizontalScale } from '../../utils/SizeScalingUtility';
import { SafeScreen } from '../../components';

const { width, height } = Dimensions.get('window');

// Check if WebRTC is available (not in Expo Go)
let isWebRTCAvailable = false;
let RTCView: any = null;
let mediaDevices: any = null;
let RTCPeerConnection: any = null;
let RTCSessionDescription: any = null;
let RTCIceCandidate: any = null;

try {
    const webrtc = require('react-native-webrtc');
    RTCView = webrtc.RTCView;
    mediaDevices = webrtc.mediaDevices;
    RTCPeerConnection = webrtc.RTCPeerConnection;
    RTCSessionDescription = webrtc.RTCSessionDescription;
    RTCIceCandidate = webrtc.RTCIceCandidate;
    isWebRTCAvailable = true;
} catch (e) {
    console.warn('WebRTC not available - requires development build');
}

// Fallback component when WebRTC is not available
const WebRTCUnavailable = ({ onGoBack }: { onGoBack: () => void }) => (
    <SafeScreen backgroundColor='#000'>
        <View style={styles.unavailableContainer}>
            <Ionicons name="videocam-off" size={80} color="#FFF" />
            <Text style={styles.unavailableTitle}>Video Calling Unavailable</Text>
            <Text style={styles.unavailableText}>
                Video calling requires a development build.{'\n'}
                Please run with a custom dev client or production build.
            </Text>
            <TouchableOpacity style={styles.goBackButton} onPress={onGoBack}>
                <Text style={styles.goBackText}>Go Back</Text>
            </TouchableOpacity>
        </View>
    </SafeScreen>
);

function CallScreen() {
    const navigation = useNavigation();
    const route = useRoute<any>();
    const insets = useSafeAreaInsets();
    
    // Show fallback if WebRTC is not available
    if (!isWebRTCAvailable) {
        return <WebRTCUnavailable onGoBack={() => navigation.goBack()} />;
    }

    // Lazy load dependencies that depend on WebRTC being available
    const { socketService } = require('../../services/SocketService');
    const { createPeerConnection, sessionConstraints, stopStream } = require('../../utils/WebRTCUtils');
    const { useAuthStore } = require('../../store/AuthStore');
    const { user } = useAuthStore();
    
    const { connectionId, otherUserId, isCaller, offer, otherUserName } = route.params || {};

    const [localStream, setLocalStream] = useState<any>(null);
    const [remoteStream, setRemoteStream] = useState<any>(null);
    const [isMuted, setIsMuted] = useState(false);
    const [isCameraOff, setIsCameraOff] = useState(false);
    const [callStatus, setCallStatus] = useState<string>(isCaller ? 'Calling...' : 'Connecting...');
    const [duration, setDuration] = useState(0);
    const [isActive, setIsActive] = useState(true);

    const peerConnection = useRef<any>(null);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        if (!connectionId || !user?.uid) {
            Alert.alert("Error", "Invalid call parameters");
            navigation.goBack();
            return;
        }

        let mounted = true;

        const startCall = async () => {
            try {
                const stream = await mediaDevices.getUserMedia({
                    audio: true,
                    video: {
                        width: 640,
                        height: 480,
                        frameRate: 30,
                        facingMode: 'user',
                    },
                });

                if (mounted) {
                    setLocalStream(stream);
                }

                const pc = createPeerConnection();
                peerConnection.current = pc;

                stream.getTracks().forEach((track: any) => {
                    pc.addTrack(track, stream);
                });

                pc.ontrack = (event: any) => {
                    if (event.streams && event.streams[0]) {
                         if (mounted) setRemoteStream(event.streams[0]);
                    }
                };

                pc.onicecandidate = (event: any) => {
                    if (event.candidate) {
                        socketService.sendIceCandidate(connectionId, event.candidate, user.uid);
                    }
                };

                if (isCaller) {
                    const offerDescription = await pc.createOffer(sessionConstraints);
                    await pc.setLocalDescription(offerDescription);
                    socketService.sendCallRequest(connectionId, offerDescription, user.uid);
                } else {
                    if (offer) {
                        await pc.setRemoteDescription(new RTCSessionDescription(offer));
                        const answerDescription = await pc.createAnswer();
                        await pc.setLocalDescription(answerDescription);
                        socketService.sendCallAccepted(connectionId, answerDescription, user.uid);
                        if (mounted) setCallStatus('Connected');
                        startTimer();
                    }
                }

            } catch (error) {
                console.error("Error starting call:", error);
                Alert.alert("Error", "Failed to access camera/microphone");
                navigation.goBack();
            }
        };

        startCall();

        const unsubAccepted = socketService.onCallAccepted(async (data: any) => {
           if (!isCaller) return;
           try {
               if (peerConnection.current) {
                   await peerConnection.current.setRemoteDescription(new RTCSessionDescription(data.answer));
                   if (mounted) setCallStatus('Connected');
                   startTimer();
               }
           } catch (err) {
               console.error("Error handling call accepted:", err);
           }
        });

        const unsubRejected = socketService.onCallRejected(() => {
            Alert.alert("Call Rejected", "The user is busy or declined your call.");
            leaveCall(); 
        });

        const unsubIce = socketService.onIceCandidate(async (data: any) => {
            try {
                if (peerConnection.current && data.candidate) {
                    await peerConnection.current.addIceCandidate(new RTCIceCandidate(data.candidate));
                }
            } catch (err) {
                console.error("Error adding ice candidate:", err);
            }
        });

        const unsubEnd = socketService.onEndCall(() => {
            Alert.alert("Call Ended", "The other user ended the call.");
            leaveCall();
        });

        return () => {
            mounted = false;
            leaveCall(false);
            unsubAccepted();
            unsubRejected();
            unsubIce();
            unsubEnd();
        };

    }, []);

    const startTimer = () => {
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
            setDuration(prev => prev + 1);
        }, 1000);
    };

    const leaveCall = (notify = true) => {
        if (!isActive) return;
        setIsActive(false);

        if (timerRef.current) clearInterval(timerRef.current);

        if (localStream) {
            stopStream(localStream);
            setLocalStream(null);
        }
        
        if (peerConnection.current) {
            peerConnection.current.close();
            peerConnection.current = null;
        }

        if (notify && connectionId && user?.uid) {
            socketService.sendEndCall(connectionId, user.uid);
        }

        setTimeout(() => {
             navigation.goBack();
        }, 100);
    };

    const toggleMute = () => {
        if (localStream) {
            localStream.getAudioTracks().forEach((track: any) => {
                track.enabled = !track.enabled;
            });
            setIsMuted(!isMuted);
        }
    };

    const toggleCamera = () => {
        if (localStream) {
            localStream.getVideoTracks().forEach((track: any) => {
                track.enabled = !track.enabled;
            });
            setIsCameraOff(!isCameraOff);
        }
    };

    const switchCamera = () => {
        if (localStream) {
            localStream.getVideoTracks().forEach((track: any) => {
                track._switchCamera?.();
            });
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <SafeScreen backgroundColor='#000'>
            <View style={styles.container}>
                {remoteStream && RTCView ? (
                    <RTCView
                        streamURL={remoteStream.toURL()}
                        style={styles.remoteVideo}
                        objectFit="cover"
                        mirror={false}
                    />
                ) : (
                    <View style={styles.remoteVideoPlaceholder}>
                        <Text style={styles.statusText}>{callStatus}</Text>
                        <Text style={styles.nameText}>{otherUserName}</Text>
                    </View>
                )}

                <View style={[styles.header, { top: Math.max(insets.top, 20) }]}>
                    <View style={styles.timerContainer}>
                        {callStatus === 'Connected' && (
                             <Text style={styles.timerText}>{formatTime(duration)}</Text>
                        )}
                    </View>
                </View>

                 {localStream && !isCameraOff && RTCView && (
                    <View style={styles.localVideoContainer}>
                        <RTCView
                            streamURL={localStream.toURL()}
                            style={styles.localVideo}
                            objectFit="cover"
                            mirror={true}
                            zOrder={1}
                        />
                    </View>
                )}

                <View style={[styles.controls, { bottom: Math.max(insets.bottom, 30) }]}>
                    <TouchableOpacity style={[styles.controlBtn, isMuted && styles.controlBtnActive]} onPress={toggleMute}>
                        <Ionicons name={isMuted ? "mic-off" : "mic"} size={28} color={Colors.WhiteColor} />
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={[styles.controlBtn, styles.endCallBtn]} onPress={() => leaveCall(true)}>
                        <Ionicons name="call" size={32} color={Colors.WhiteColor} />
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.controlBtn, isCameraOff && styles.controlBtnActive]} onPress={toggleCamera}>
                        <Ionicons name={isCameraOff ? "videocam-off" : "videocam"} size={28} color={Colors.WhiteColor} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.controlBtn} onPress={switchCamera}>
                        <Ionicons name="camera-reverse" size={28} color={Colors.WhiteColor} />
                    </TouchableOpacity>
                </View>
            </View>
        </SafeScreen>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    unavailableContainer: {
        flex: 1,
        backgroundColor: '#202124',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    unavailableTitle: {
        color: '#FFF',
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
    },
    unavailableText: {
        color: '#AAA',
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 24,
    },
    goBackButton: {
        marginTop: 30,
        backgroundColor: '#FF6B4A',
        paddingHorizontal: 30,
        paddingVertical: 12,
        borderRadius: 8,
    },
    goBackText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
    },
    remoteVideo: {
        width: width,
        height: height,
        backgroundColor: '#111',
    },
    remoteVideoPlaceholder: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1a1a1a',
    },
    localVideoContainer: {
        position: 'absolute',
        right: 20,
        bottom: 120,
        width: 100,
        height: 150,
        borderRadius: 10,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#333',
        backgroundColor: '#000',
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
    localVideo: {
        flex: 1,
    },
    header: {
        position: 'absolute',
        left: 0,
        right: 0,
        alignItems: 'center',
        zIndex: 2,
    },
    timerContainer: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingHorizontal: 15,
        paddingVertical: 5,
        borderRadius: 20,
    },
    timerText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    statusText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '500',
        marginBottom: 10,
    },
    nameText: {
        color: Colors.ButtonPink,
        fontSize: 24,
        fontWeight: 'bold',
    },
    controls: {
        position: 'absolute',
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    controlBtn: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    controlBtnActive: {
        backgroundColor: Colors.ButtonPink,
    },
    endCallBtn: {
        width: 65,
        height: 65,
        borderRadius: 35,
        backgroundColor: '#FF3B30',
    },
});

export default CallScreen;
