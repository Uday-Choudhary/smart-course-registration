import React from "react";

const StatCard = ({ title, value, icon: Icon, color = "indigo", trend }) => {
    const colorClasses = {
        indigo: "bg-indigo-50 text-indigo-600",
        green: "bg-emerald-50 text-emerald-600",
        amber: "bg-amber-50 text-amber-600",
        rose: "bg-rose-50 text-rose-600",
        blue: "bg-blue-50 text-blue-600",
    };

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
                    <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
                    {trend && (
                        <p className={`text-xs font-medium mt-2 ${trend.positive ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {trend.positive ? '+' : ''}{trend.value} {trend.label}
                        </p>
                    )}
                </div>
                <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
                    <Icon className="h-6 w-6" />
                </div>
            </div>
        </div>
    );
};

export default StatCard;
