import { create } from 'zustand';
import { ObjectEntity } from '@repo/shared';

interface AppState {
    objects: ObjectEntity[];
    setObjects: (objects: ObjectEntity[]) => void;
    addObject: (object: ObjectEntity) => void;
    removeObject: (id: string) => void;
    selectedObject: ObjectEntity | null;
    setSelectedObject: (object: ObjectEntity | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
    objects: [],
    setObjects: (objects) => set({ objects }),
    addObject: (object) => set((state) => ({
        objects: [object, ...state.objects.filter(o => o.id !== object.id)]
    })),
    removeObject: (id) => set((state) => ({
        objects: state.objects.filter((o) => o.id !== id)
    })),
    selectedObject: null,
    setSelectedObject: (selectedObject) => set({ selectedObject }),
}));
