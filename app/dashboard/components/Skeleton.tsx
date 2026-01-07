import React from "react";

interface SkeletonProps {
    className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = "" }) => {
    return (
        <span className={`animate-shimmer rounded-md inline-block ${className}`} />
    );
};

export const SkeletonCircle: React.FC<SkeletonProps> = ({ className = "" }) => {
    return (
        <Skeleton className={`rounded-full ${className}`} />
    );
};

export const SkeletonText: React.FC<{ lines?: number; className?: string }> = ({
    lines = 3,
    className = ""
}) => {
    return (
        <span className={`block space-y-2 ${className}`}>
            {[...Array(lines)].map((_, i) => (
                <Skeleton
                    key={i}
                    className={`h-4 ${i === lines - 1 ? 'w-2/3' : 'w-full'}`}
                />
            ))}
        </span>
    );
};

export const SkeletonCard: React.FC<SkeletonProps> = ({ className = "" }) => {
    return (
        <div className={`bg-white rounded-2xl p-6 border border-slate-100 shadow-sm ${className}`}>
            <div className="flex items-center gap-3 mb-4">
                <SkeletonCircle className="w-10 h-10" />
                <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-3 w-1/4" />
                </div>
            </div>
            <SkeletonText lines={3} />
        </div>
    );
};
