const UserCard = ({ type, color, count, title }) => {
    return (
        <div className={`rounded-2xl ${color} p-4 flex-1 min-w-[130px]`}>
            <div className="flex justify-between items-center">
                <span className="text-[10px] bg-white px-2 py-1 rounded-full text-green-600">
                    {new Date().getFullYear()}/{new Date().getFullYear() + 1}
                </span>
                <img src="/more.png" alt="" className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-semibold my-4">{count || 0}</h1>
            <h2 className="capitalize text-sm font-medium text-gray-500">{title || `${type}s`}</h2>
        </div>
    );
};

export default UserCard;