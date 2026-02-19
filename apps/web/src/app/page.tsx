"use client";

import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { objectsApi, formatImageUrl } from '@/lib/api';
import { useAppStore } from '@/store/useAppStore';
import { useSocket } from '@/hooks/useSocket';
import { ObjectForm } from '@/components/organisms/ObjectForm';
import { ObjectGrid } from '@/components/organisms/ObjectGrid';
import { Button } from '@/components/atoms/Button';
import { Package, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
    useSocket();
    const queryClient = useQueryClient();
    const { objects, setObjects, selectedObject, setSelectedObject } = useAppStore();

    const { isLoading } = useQuery({
        queryKey: ['objects'],
        queryFn: async () => {
            const data = await objectsApi.getAll();
            setObjects(data);
            return data;
        },
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

    return (
        <main className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="sticky top-0 z-40 w-full glass shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="bg-indigo-600 p-2 rounded-xl">
                            <Package className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-2xl font-black tracking-tight text-slate-900 font-outfit">
                            HEYAMA <span className="text-indigo-600">CLOUD</span>
                        </h1>
                    </div>
                    <div className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                        Real-time Sync Active
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar / Form */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24">
                            <ObjectForm
                                onSubmit={(data: any) => createMutation.mutate(data)}
                                isLoading={createMutation.isPending}
                            />
                        </div>
                    </div>

                    {/* Main Content / Grid */}
                    <div className="lg:col-span-3">
                        <div className="mb-6">
                            <h2 className="text-3xl font-extrabold text-slate-900 mb-2">My Collection</h2>
                            <p className="text-slate-500">Manage your stored items in real-time across all devices.</p>
                        </div>

                        {isLoading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="h-64 bg-slate-200 animate-pulse rounded-2xl" />
                                ))}
                            </div>
                        ) : (
                            <ObjectGrid
                                objects={objects}
                                onDelete={(id: string) => deleteMutation.mutate(id)}
                                onView={setSelectedObject}
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* Modal / Detail View */}
            <AnimatePresence>
                {selectedObject && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedObject(null)}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl"
                        >
                            <button
                                onClick={() => setSelectedObject(null)}
                                className="absolute top-4 right-4 p-2 bg-white/80 hover:bg-white rounded-full text-slate-900 z-10 shadow-lg"
                            >
                                <X className="w-5 h-5" />
                            </button>
                            <div className="h-80 w-full overflow-hidden">
                                <img
                                    src={formatImageUrl(selectedObject.imageUrl)}
                                    alt={selectedObject.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="p-8">
                                <h3 className="text-3xl font-bold text-slate-900 mb-4">{selectedObject.title}</h3>
                                <p className="text-slate-600 text-lg leading-relaxed">{selectedObject.description}</p>
                                <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
                                    <span className="text-sm text-slate-400">Created on {new Date(selectedObject.createdAt).toLocaleDateString()}</span>
                                    <Button variant="outline" onClick={() => setSelectedObject(null)}>Close</Button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </main>
    );
}
