import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Trash2, ChevronRight } from 'lucide-react-native';
import { formatImageUrl } from '../../../lib/api';

export const ObjectCard = ({ object, onDelete, onPress }: any) => {
    return (
        <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
            <Image source={{ uri: formatImageUrl(object.imageUrl) }} style={styles.image} />
            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.title} numberOfLines={1}>{object.title}</Text>
                    <TouchableOpacity onPress={() => onDelete(object.id)}>
                        <Trash2 size={18} color="#ef4444" />
                    </TouchableOpacity>
                </View>
                <Text style={styles.description} numberOfLines={2}>{object.description}</Text>
                <View style={styles.footer}>
                    <Text style={styles.date}>{new Date(object.createdAt).toLocaleDateString()}</Text>
                    <ChevronRight size={16} color="#94a3b8" />
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: { flexDirection: 'row', backgroundColor: 'white', borderRadius: 16, marginBottom: 12, overflow: 'hidden', borderWidth: 1, borderColor: '#f1f5f9', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
    image: { width: 100, height: 100 },
    content: { flex: 1, padding: 12, justifyContent: 'space-between' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    title: { fontSize: 16, fontWeight: '700', color: '#1e293b', flex: 1, marginRight: 8 },
    description: { fontSize: 13, color: '#64748b', marginVertical: 4 },
    footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    date: { fontSize: 11, color: '#94a3b8', fontWeight: '500' }
});
