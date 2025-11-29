import React from 'react';

const StatCard = ({ icon, label, value, trend, color = 'blue' }) => {
    const colorClasses = {
        blue: 'from-blue-500 to-blue-600',
        green: 'from-green-500 to-green-600',
        purple: 'from-purple-500 to-purple-600',
        orange: 'from-orange-500 to-orange-600',
        red: 'from-red-500 to-red-600'
    };

    const gradientClass = colorClasses[color] || colorClasses.blue;

    return (
        <div className={`bg-gradient-to-br ${gradientClass} rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow duration-200`}>
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-white/80 text-sm font-medium mb-1">{label}</p>
                    <h3 className="text-3xl font-bold mb-2">{value?.toLocaleString() || '0'}</h3>
                    {trend && (
                        <div className="flex items-center gap-1 text-sm">
                            {trend > 0 ? (
                                <>
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                    </svg>
                                    <span>+{trend}%</span>
                                </>
                            ) : (
                                <>
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    <span>{trend}%</span>
                                </>
                            )}
                        </div>
                    )}
                </div>
                <div className="bg-white/20 rounded-lg p-3">
                    {icon}
                </div>
            </div>
        </div>
    );
};

export default StatCard;
