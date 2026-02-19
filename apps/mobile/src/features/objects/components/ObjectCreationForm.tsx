import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Plus, Image as ImageIcon } from 'lucide-react-native';

export const ObjectCreationForm = ({ onSubmit, isLoading }: any) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState<any>(null);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0]);
        }
    };

    const handleSubmit = () => {
        if (!image) return;

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('file', {
            uri: image.uri,
            name: 'photo.jpg',
            type: 'image/jpeg',
        } as any);

        onSubmit(formData);
        setTitle('');
        setDescription('');
        setImage(null);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>New Object</Text>
            <TextInput
                style={styles.input}
                placeholder="Title"
                value={title}
                onChangeText={setTitle}
            />
            <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Description"
                multiline
                numberOfLines={3}
                value={description}
                onChangeText={setDescription}
            />

            <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
                {image ? (
                    <Image source={{ uri: image.uri }} style={styles.preview} />
                ) : (
                    <View style={styles.pickerPlaceholder}>
                        <ImageIcon size={24} color="#6366f1" />
                        <Text style={styles.pickerText}>Pick an image</Text>
                    </View>
                )}
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.button, (!title || !description || !image || isLoading) && styles.buttonDisabled]}
                onPress={handleSubmit}
                disabled={!title || !description || !image || isLoading}
            >
                {isLoading ? (
                    <ActivityIndicator color="white" />
                ) : (
                    <Text style={styles.buttonText}>Create Object</Text>
                )}
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { padding: 20, backgroundColor: 'white', borderRadius: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 5 },
    title: { fontSize: 20, fontWeight: '800', marginBottom: 16, color: '#1e293b' },
    input: { borderWidth: 2, borderColor: '#f1f5f9', borderRadius: 12, padding: 12, marginBottom: 12, fontSize: 16, backgroundColor: '#f8fafc' },
    textArea: { height: 80, textAlignVertical: 'top' },
    imagePicker: { height: 160, borderRadius: 12, borderStyle: 'dashed', borderWidth: 2, borderColor: '#e2e8f0', overflow: 'hidden', marginBottom: 16, justifyContent: 'center', alignItems: 'center' },
    preview: { width: '100%', height: '100%' },
    pickerPlaceholder: { alignItems: 'center' },
    pickerText: { marginTop: 8, color: '#6366f1', fontWeight: '600' },
    button: { backgroundColor: '#4f46e5', padding: 16, borderRadius: 12, alignItems: 'center' },
    buttonDisabled: { backgroundColor: '#a5b4fc' },
    buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});
