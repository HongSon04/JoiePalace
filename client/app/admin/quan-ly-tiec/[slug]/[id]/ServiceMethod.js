export const FoodsTitle = ({ title, foodsMap, handleDeleteFood }) => {
    return (
        <div className="flex flex-col gap-2">
            <span className="font-bold leading-6 text-base text-white">{title}</span>
            <div className="flex flex-wrap gap-[10px]">
                {foodsMap && foodsMap.length > 0 ? (
                    foodsMap.map((food) => (
                        <div key={food.id} className="bg-white border-1 rounded-lg p-2 flex gap-[6px] text-gray-600 items-center w-fit transition-transform transform hover:scale-105">
                            <span className="text-[12px] font-medium leading-4">{food.name}</span>
                            <button type='button'
                                onClick={() => handleDeleteFood(food.id)}
                                className="text-red-500 hover:text-red-700">
                                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10" fill="none">
                                    <path opacity="0.5" d="M5 3.88906L8.88906 0L10 1.11094L6.11094 5L10 8.88906L8.88906 10L5 6.11094L1.11094 10L0 8.88906L3.88906 5L0 1.11094L1.11094 0L5 3.88906Z" fill="#1A202C" />
                                </svg>
                            </button>
                        </div>
                    ))
                ) : (
                    <p className="text-white font-semibold text-base">Chưa có món ăn nào cho menu này.</p>
                )}
            </div>
        </div>
    );
};

export const TitleSpanInfo = ({ title }) => (
    <span className="font-semibold text-xl leading-7 text-white">{title}</span>
);


