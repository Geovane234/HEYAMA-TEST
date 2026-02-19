import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';
import { useState } from 'react';
import { Plus, Image as ImageIcon } from 'lucide-react';

interface ObjectFormProps {
    onSubmit: (data: FormData) => void;
    isLoading?: boolean;
}

export const ObjectForm = ({ onSubmit, isLoading }: ObjectFormProps) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [file, setFile] = useState<File | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return;

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('file', file);

        onSubmit(formData);
        setTitle('');
        setDescription('');
        setFile(null);
    };

    return (
        <form onSubmit={handleSubmit} className="p-6 bg-white rounded-2xl border border-slate-100 shadow-xl space-y-4">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-indigo-600" />
                New Object
            </h3>
            <Input
                label="Title"
                placeholder="Enter title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
            />
            <Input
                label="Description"
                placeholder="Enter description..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
            />
            <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 ml-1">Image</label>
                <div className="relative group">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        required
                    />
                    <div className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-slate-200 rounded-lg group-hover:border-indigo-400 group-hover:bg-slate-50 transition-all">
                        <ImageIcon className="w-5 h-5 text-slate-400 group-hover:text-indigo-500" />
                        <span className="text-sm text-slate-500 group-hover:text-indigo-600">
                            {file ? file.name : 'Select an image'}
                        </span>
                    </div>
                </div>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Creating...' : 'Create Object'}
            </Button>
        </form>
    );
};
