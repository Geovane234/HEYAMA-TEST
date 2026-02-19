import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, StatusBar, Modal, Image, TouchableOpacity } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { objectsApi, getSocketUrl, formatImageUrl } from './src/lib/api';
import { ObjectCard } from './src/features/objects/components/ObjectCard';
import { ObjectCreationForm } from './src/features/objects/components/ObjectCreationForm';
import { io } from 'socket.io-client';
import { SOCKET_EVENTS } from '@repo/shared';
import { Package, X } from 'lucide-react-native';

const queryClient = new QueryClient();

function AppContent() {
    const queryClient = useQueryClient();
    const [selectedObject, setSelectedObject] = React.useState<any>(null);

    const { data: objects = [], isLoading } = useQuery({
        queryKey: ['objects'],
        queryFn: objectsApi.getAll,
    });

    const createMutation = useMutation({
        mutationFn: objectsApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['objects'] });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: objectsApi.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['objects'] });
        },
    });

    useEffect(() => {
        const socket = io(getSocketUrl());

        socket.on(SOCKET_EVENTS.OBJECT_CREATED, (newObject) => {
            queryClient.setQueryData(['objects'], (old: any) => [newObject, ...(old || [])]);
        });

        socket.on(SOCKET_EVENTS.OBJECT_DELETED, (data) => {
            queryClient.setQueryData(['objects'], (old: any) => (old || []).filter((obj: any) => obj.id !== data.id));
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    return (
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
            <StatusBar barStyle="dark-content" />
            <View style={styles.header}>
                <View style={styles.logoContainer}>
                    <Package color="white" size={24} />
                </View>
                <Text style={styles.headerTitle}>HEYAMA <Text style={{ color: '#6366f1' }}>MOBILE</Text></Text>
            </View>

            <FlatList
                data={objects}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <ObjectCard
                        object={item}
                        onDelete={(id: string) => deleteMutation.mutate(id)}
                        onPress={() => setSelectedObject(item)}
                    />
                )}
                ListHeaderComponent={() => (
                    <View style={styles.formContainer}>
                        <ObjectCreationForm
                            onSubmit={(fd: any) => createMutation.mutate(fd)}
                            isLoading={createMutation.isPending}
                        />
                        <Text style={styles.listTitle}>My Collection</Text>
                    </View>
                )}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={() => !isLoading && (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No objects yet.</Text>
                    </View>
                )}
            />

            <Modal visible={!!selectedObject} animationType="slide" transparent={true}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <TouchableOpacity style={styles.closeButton} onPress={() => setSelectedObject(null)}>
                            <X size={24} color="#1e293b" />
                        </TouchableOpacity>
                        {selectedObject && (
                            <>
                                <Image source={{ uri: formatImageUrl(selectedObject.imageUrl) }} style={styles.modalImage} />
                                <View style={styles.modalBody}>
                                    <Text style={styles.modalTitle}>{selectedObject.title}</Text>
                                    <Text style={styles.modalDescription}>{selectedObject.description}</Text>
                                    <Text style={styles.modalDate}>Added on {new Date(selectedObject.createdAt).toLocaleDateString()}</Text>
                                </View>
                            </>
                        )}
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

export default function App() {
    return (
        <SafeAreaProvider>
            <QueryClientProvider client={queryClient}>
                <AppContent />
            </QueryClientProvider>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8fafc' },
    header: { flexDirection: 'row', alignItems: 'center', padding: 20, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
    logoContainer: { backgroundColor: '#4f46e5', borderRadius: 10, padding: 6, marginRight: 12 },
    headerTitle: { fontSize: 22, fontWeight: '900', color: '#1e293b' },
    listContent: { padding: 20 },
    formContainer: { marginBottom: 30 },
    listTitle: { fontSize: 24, fontWeight: '800', color: '#1e293b', marginTop: 24, marginBottom: 12 },
    emptyContainer: { padding: 40, alignItems: 'center' },
    emptyText: { color: '#94a3b8', fontSize: 16 },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.8)', justifyContent: 'flex-end' },
    modalContent: { backgroundColor: 'white', borderTopLeftRadius: 32, borderTopRightRadius: 32, height: '85%', overflow: 'hidden' },
    closeButton: { alignSelf: 'flex-end', padding: 20 },
    modalImage: { width: '100%', height: 300 },
    modalBody: { padding: 24 },
    modalTitle: { fontSize: 28, fontWeight: '800', color: '#1e293b', marginBottom: 16 },
    modalDescription: { fontSize: 16, color: '#475569', lineHeight: 24, marginBottom: 24 },
    modalDate: { fontSize: 14, color: '#94a3b8', fontWeight: '500' },
});
