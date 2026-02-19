import React from 'react';

export const SharedButton = ({ label, onClick }: { label: string; onClick: () => void }) => (
    <button onClick={onClick} style={{ padding: '10px 20px', borderRadius: '8px' }}>
        {label}
    </button>
);
