import { ObjectCard } from '../molecules/ObjectCard';
import { ObjectEntity } from '@repo/shared';
import { motion, AnimatePresence } from 'framer-motion';

interface ObjectGridProps {
    objects: ObjectEntity[];
    onDelete: (id: string) => void;
    onView: (object: ObjectEntity) => void;
}

export const ObjectGrid = ({ objects, onDelete, onView }: ObjectGridProps) => {
    if (objects.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
                <p className="text-slate-400 font-medium">No objects found. Create your first one!</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
                {objects.map((obj) => (
                    <motion.div
                        key={obj.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                    >
                        <ObjectCard object={obj} onDelete={onDelete} onView={onView} />
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};
