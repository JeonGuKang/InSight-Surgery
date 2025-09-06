import React from 'react';

const Loader: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center p-8 min-h-[300px]">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-brand-blue mb-4"></div>
            <div className="text-center">
                <p className="text-xl font-semibold text-gray-700 dark:text-gray-300">Generating Simulation...</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">This can take a few moments. Please don't close the window.</p>
            </div>
        </div>
    );
};

export default Loader;