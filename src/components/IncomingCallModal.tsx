import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../utils/Colors';
import { ms, textScale, verticalScale, horizontalScale } from '../utils/SizeScalingUtility';

interface IncomingCallModalProps {
    visible: boolean;
    callerName: string;
    onAccept: () => void;
    onReject: () => void;
}

const IncomingCallModal = ({ visible, callerName, onAccept, onReject }: IncomingCallModalProps) => {
    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
        >
            <View style={styles.container}>
                <View style={styles.content}>
                    <View style={styles.avatar}>
                         <Ionicons name="person" size={40} color={Colors.WhiteColor} />
                    </View>
                    <Text style={styles.title}>Incoming Call</Text>
                    <Text style={styles.caller}>{callerName || 'Unknown Caller'}</Text>
                    
                    <View style={styles.actions}>
                        <TouchableOpacity style={[styles.btn, styles.rejectBtn]} onPress={onReject}>
                            <Ionicons name="call" size={28} color={Colors.WhiteColor} style={{ transform: [{ rotate: '135deg' }] }} />
                        </TouchableOpacity>
                        
                        <TouchableOpacity style={[styles.btn, styles.acceptBtn]} onPress={onAccept}>
                            <Ionicons name="call" size={28} color={Colors.WhiteColor} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'flex-end',
        paddingBottom: verticalScale(50),
    },
    content: {
        backgroundColor: '#222',
        marginHorizontal: horizontalScale(20),
        borderRadius: ms(20),
        padding: ms(20),
        alignItems: 'center',
        elevation: 5,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: Colors.ButtonPink,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: verticalScale(15),
    },
    title: {
        color: '#ccc',
        fontSize: textScale(14),
        marginBottom: verticalScale(5),
    },
    caller: {
        color: Colors.WhiteColor,
        fontSize: textScale(20),
        fontWeight: 'bold',
        marginBottom: verticalScale(30),
    },
    actions: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-around',
    },
    btn: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    rejectBtn: {
        backgroundColor: '#FF3B30',
    },
    acceptBtn: {
        backgroundColor: '#34C759',
    },
});

export default IncomingCallModal;
