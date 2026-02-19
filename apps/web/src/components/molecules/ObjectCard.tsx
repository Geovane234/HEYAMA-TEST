import { Trash2, Calendar, ZoomIn } from 'lucide-react';
import { Button } from '../atoms/Button';
import { cn } from '@/lib/utils';
import { ObjectEntity } from '@repo/shared';
import { formatImageUrl } from '@/lib/api';

interface ObjectCardProps {
    object: ObjectEntity;
    onDelete: (id: string) => void;
    onView: (object: ObjectEntity) => void;
    className?: string;
}

export const ObjectCard = ({ object, onDelete, onView, className }: ObjectCardProps) => {
    return (
        <div className={cn(
            "group relative overflow-hidden bg-white rounded-2xl border border-slate-100 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1",
            className
        )}>
            <div className="aspect-[4/3] overflow-hidden relative">
                <img
                    src={formatImageUrl(object.imageUrl)}
                    alt={object.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                    <Button
                        variant="secondary"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all"
                        onClick={() => onView(object)}
                    >
                        <ZoomIn className="w-4 h-4 mr-1" /> View Details
                    </Button>
                </div>
            </div>

            <div className="p-4 space-y-2">
                <div className="flex justify-between items-start">
                    <h4 className="text-lg font-bold text-slate-900 line-clamp-1">{object.title}</h4>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-slate-400 hover:text-rose-600 p-1 h-auto"
                        onClick={() => onDelete(object.id)}
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
                <p className="text-sm text-slate-500 line-clamp-2 min-h-[40px]">{object.description}</p>
                <div className="pt-2 flex items-center text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    <Calendar className="w-3 h-3 mr-1" />
                    {new Date(object.createdAt).toLocaleDateString()}
                </div>
            </div>
        </div>
    );
};
