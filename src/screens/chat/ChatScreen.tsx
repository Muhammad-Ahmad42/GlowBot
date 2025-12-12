import React, { useState, useEffect, useRef } from "react";
import { 
  StyleSheet, View, Text, TextInput, TouchableOpacity, FlatList, 
  KeyboardAvoidingView, Platform, Alert, Image 
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';
import { SafeScreen, Header } from "@/src/components";
import EllipsisModal from "../../components/EllipsisModal";
import Colors from "../../utils/Colors";
import { horizontalScale, ms, textScale, verticalScale } from "../../utils/SizeScalingUtility";
import { useConnectionStore, ChatMessage } from "../../store/ConnectionStore";
import { useAuthStore } from "../../store/AuthStore";
import { socketService } from "../../services/SocketService";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import IncomingCallModal from "../../components/IncomingCallModal";
import { CallRequestData } from "../../services/SocketService";

const ChatScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { connectionId, expertName, expertAvatar } = route.params || {};
  const { user } = useAuthStore();
  const { messages, fetchMessages } = useConnectionStore();
  const flatListRef = useRef<FlatList>(null);
  const insets = useSafeAreaInsets();
  
  const [inputText, setInputText] = useState("");
  const [sending, setSending] = useState(false);
  const [localMessages, setLocalMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const [incomingCall, setIncomingCall] = useState<CallRequestData | null>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Initialize socket and fetch initial messages
  useEffect(() => {
    if (!connectionId || !user?.uid) return;

    // Connect socket and join room
    socketService.connect();
    socketService.joinRoom(connectionId, user.uid);

    // Fetch initial messages
    fetchMessages(connectionId);

    // Listen for new messages
    const unsubMessage = socketService.onMessage((message) => {
      setLocalMessages(prev => {
        // Avoid duplicates
        if (prev.some(m => m.id === message.id)) return prev;
        return [...prev, message];
      });
      
      // Scroll to bottom
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    });

    // Listen for typing
    const unsubTyping = socketService.onTyping(({ userId }) => {
      if (userId !== user.uid) {
        setIsTyping(true);
      }
    });

    const unsubCallRequest = socketService.onCallRequest((data) => {
      setIncomingCall(data);
    });

    const unsubStopTyping = socketService.onStopTyping(({ userId }) => {
      if (userId !== user.uid) {
        setIsTyping(false);
      }
    });

    // Cleanup
    return () => {
      socketService.leaveRoom(connectionId);
      unsubMessage();
      unsubTyping();

      unsubStopTyping();
      unsubCallRequest();
    };
  }, [connectionId, user?.uid]);

  // Sync store messages with local state
  useEffect(() => {
    if (messages[connectionId]) {
      setLocalMessages(messages[connectionId]);
    }
  }, [messages, connectionId]);

  const handleSend = () => {
    if (!inputText.trim() || !user?.uid || !connectionId || sending) return;
    
    setSending(true);
    
    // Send via socket
    socketService.sendMessage(connectionId, user.uid, 'user', inputText.trim());
    setInputText("");
    setSending(false);
    
    // Stop typing indicator
    socketService.sendStopTyping(connectionId, user.uid);
  };

  const handleTextChange = (text: string) => {
    setInputText(text);
    
    if (!user?.uid || !connectionId) return;
    
    // Send typing indicator
    if (text.length > 0) {
      socketService.sendTyping(connectionId, user.uid);
      
      // Clear previous timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      // Stop typing after 2 seconds of inactivity
      typingTimeoutRef.current = setTimeout(() => {
        socketService.sendStopTyping(connectionId, user.uid);
      }, 2000);
    } else {
      socketService.sendStopTyping(connectionId, user.uid);
    }
  };

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 0.8,
      base64: true, // Request base64
    });

    if (!result.canceled && user?.uid) {
      // Use the base64 string if available, otherwise just use the URI (which won't work across devices without upload)
      // For a real production app, you'd upload connectionId/timestamp.jpg to storage and get a URL.
      // For this prototype, we'll assume the backend handles it or we send base64 data URI.
      
      const imageUri = result.assets[0].uri;
      const base64 = result.assets[0].base64;
      
      // Construct a data URI if base64 is available
      const imageData = base64 ? `data:image/jpeg;base64,${base64}` : imageUri;

      socketService.sendMessage(connectionId, user.uid, 'user', '', imageData);
    }
  };

  const handleClearChat = () => {
    Alert.alert("Clear Chat", "Are you sure you want to clear this chat?", [
      { text: "Cancel", style: "cancel" },
      { text: "Clear", style: "destructive", onPress: () => setLocalMessages([]) }
    ]);
  };

  const handleBlockUser = () => {
    Alert.alert("Block User", "Are you sure you want to block this user?", [
      { text: "Cancel", style: "cancel" },
      { text: "Block", style: "destructive", onPress: () => navigation.goBack() }
    ]);
  };

  const handleVideoCall = () => {
    navigation.navigate("CallScreen", {
      connectionId,
      otherUserId: 'expert_id_placeholder', // You might need to fetch this or pass it via params
      otherUserName: expertName,
      isCaller: true,
    });
  };

  const handleAcceptCall = () => {
    if (incomingCall) {
      setIncomingCall(null);
      navigation.navigate("CallScreen", {
        connectionId: incomingCall.connectionId,
        otherUserId: incomingCall.callerId,
        otherUserName: expertName, // Ideally get name from callerId or look up
        isCaller: false,
        offer: incomingCall.offer
      });
    }
  };

  const handleRejectCall = () => {
    if (incomingCall && user?.uid) {
      socketService.sendCallRejected(incomingCall.connectionId, user.uid);
      setIncomingCall(null);
    }
  };

  const renderMessageItem = ({ item }: { item: ChatMessage }) => {
    const isMe = item.senderType === 'user';
    return (
      <View style={[styles.messageBubble, isMe ? styles.myMessage : styles.theirMessage]}>
        {item.image ? (
          <Image source={{ uri: item.image }} style={styles.messageImage} resizeMode="cover" />
        ) : null}
        {item.text ? (
          <Text style={[styles.messageText, isMe ? styles.myMessageText : styles.theirMessageText]}>
            {item.text}
          </Text>
        ) : null}
        
        <View style={styles.metaParams}>
          <Text style={[styles.messageTime, isMe ? styles.myMessageTime : styles.theirMessageTime]}>
            {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
          {isMe && (
            <View style={styles.statusContainer}>
              <Ionicons 
                name={item.status === 'seen' ? "checkmark-done" : "checkmark"} 
                size={12} 
                color={item.status === 'seen' ? "#4FC3F7" : "rgba(255,255,255,0.7)"} 
              />
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeScreen backgroundColor={Colors.DashboardBackground}>
      <View style={styles.container}>
        <Header
          heading={expertName || "Chat"}
          showBackButton={true}
          onBackPress={() => navigation.goBack()}
          centerTitle={false}
          containerStyle={styles.header}
          rightIcon={
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity onPress={handleVideoCall} style={{ marginRight: 15 }}>
                <Ionicons name="videocam" size={24} color={Colors.textPrimary} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setModalVisible(true)}>
                <Ionicons name="ellipsis-vertical" size={24} color={Colors.textPrimary} />
              </TouchableOpacity>
            </View>
          }
          onRightIconPress={() => {}} // Hanlded individually
        />

        <IncomingCallModal 
          visible={!!incomingCall}
          callerName={expertName || "Dermatologist"} // Fallback or lookup
          onAccept={handleAcceptCall}
          onReject={handleRejectCall}
        />

        <EllipsisModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          options={[
            { label: "Clear Chat", icon: "trash-outline", onPress: handleClearChat, color: Colors.StatusBadText },
            { label: "Block User", icon: "ban-outline", onPress: handleBlockUser, color: Colors.StatusBadText },
          ]}
        />

        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
          style={styles.keyboardView}
        >
          <FlatList
            ref={flatListRef}
            data={localMessages}
            keyExtractor={item => item.id}
            renderItem={renderMessageItem}
            contentContainerStyle={styles.messagesList}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
          />

          {isTyping && (
            <View style={styles.typingContainer}>
              <Text style={styles.typingText}>{expertName} is typing...</Text>
            </View>
          )}

          <View style={[styles.inputContainer, { paddingBottom: Math.max(insets.bottom, 10) }]}>
            <TouchableOpacity style={styles.attachButton} onPress={handlePickImage}>
              <Ionicons name="add" size={28} color={Colors.ButtonPink} />
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              placeholder="Type a message..."
              value={inputText}
              onChangeText={handleTextChange}
              multiline
            />
            <TouchableOpacity 
              style={[styles.sendButton, sending && styles.sendingButton]} 
              onPress={handleSend}
              disabled={sending}
            >
              <Ionicons name="send" size={18} color={Colors.WhiteColor} />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </SafeScreen>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: horizontalScale(10),
  },
  keyboardView: {
    flex: 1,
  },
  messagesList: {
    paddingHorizontal: horizontalScale(15),
    paddingBottom: verticalScale(20),
    paddingTop: verticalScale(10),
  },
  messageBubble: {
    maxWidth: '75%',
    padding: ms(10),
    borderRadius: ms(16),
    marginBottom: verticalScale(10),
    minWidth: ms(80),
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.ButtonPink,
    borderTopRightRadius: 2,
  },
  theirMessage: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.WhiteColor,
    borderTopLeftRadius: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  messageText: {
    fontSize: textScale(15),
    marginBottom: verticalScale(2),
  },
  myMessageText: {
    color: Colors.WhiteColor,
  },
  theirMessageText: {
    color: Colors.textPrimary,
  },
  metaParams: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: verticalScale(2),
  },
  messageTime: {
    fontSize: textScale(10),
  },
  myMessageTime: {
    color: 'rgba(255,255,255,0.7)',
  },
  theirMessageTime: {
    color: Colors.textMuted,
  },
  statusContainer: {
    marginLeft: horizontalScale(4),
  },
  typingContainer: {
    paddingHorizontal: horizontalScale(20),
    paddingVertical: verticalScale(5),
  },
  typingText: {
    fontSize: textScale(12),
    color: Colors.textMuted,
    fontStyle: 'italic',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: ms(10),
    backgroundColor: Colors.WhiteColor,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  attachButton: {
    padding: ms(8),
  },
  input: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: ms(20),
    paddingHorizontal: horizontalScale(15),
    paddingVertical: verticalScale(8),
    fontSize: textScale(15),
    marginHorizontal: horizontalScale(5),
    maxHeight: verticalScale(100),
  },
  sendButton: {
    backgroundColor: Colors.ButtonPink,
    width: ms(40),
    height: ms(40),
    borderRadius: ms(20),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: horizontalScale(5),
  },
  sendingButton: {
    opacity: 0.6,
  },
  messageImage: {
    width: ms(200),
    height: ms(200),
    borderRadius: ms(8),
    marginBottom: verticalScale(5),
  },
});
