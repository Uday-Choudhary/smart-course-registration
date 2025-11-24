import React from 'react';

const ReportPage = () => {
    return (
        <div className="bg-white rounded-xl shadow-sm flex-1 p-6">
            <h1 className="text-2xl font-semibold text-gray-800 mb-6">System Reports</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Placeholder for report cards */}
                <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                    <h3 className="text-lg font-medium text-blue-800 mb-2">Student Enrollment</h3>
                    <p className="text-blue-600">View detailed reports on student enrollment statistics.</p>
                </div>

                <div className="bg-purple-50 p-6 rounded-xl border border-purple-100">
                    <h3 className="text-lg font-medium text-purple-800 mb-2">Course Performance</h3>
                    <p className="text-purple-600">Analyze course grades and pass rates.</p>
                </div>

                <div className="bg-green-50 p-6 rounded-xl border border-green-100">
                    <h3 className="text-lg font-medium text-green-800 mb-2">Faculty Workload</h3>
                    <p className="text-green-600">Track faculty teaching hours and assignments.</p>
                </div>
            </div>

            <div className="mt-8 p-8 text-center text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                <p>Detailed reporting features coming soon.</p>
            </div>
        </div>
    );
};

export default ReportPage;
