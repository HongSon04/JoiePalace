import React from "react";
import { Button, Popover, PopoverContent, PopoverTrigger, Tooltip } from "@nextui-org/react";
import { CheckIcon, PlusIcon } from "@heroicons/react/24/outline";
import { useSelector, useDispatch } from "react-redux";
import { useToast } from "@chakra-ui/react";
import { updateMenu } from "../_lib/features/menu/menuSlice";
import { formatDate } from "../_utils/format";
import Image from "next/image";

function AddToMenuButton({
    dish,
    userMenuList,
    handleUpdateMenu,
    addable = false,
    tooltipClassName = "",
    isAdded = false,
    usePopover = false,
}) {
    const { isUpdatingMenu } = useSelector((store) => store.menu);
    const dispatch = useDispatch();
    const toast = useToast();
    const [isLogedin, setIsLogedIn] = React.useState(false);

    React.useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser) setIsLogedIn(true);
    }, []);

    const handleAddToMenu = async (menu, dish) => {
        const menuProducts = Object.keys(menu.products).reduce(
            (acc, cur) => {
                return [...acc, ...menu.products[cur]];
            },
            [dish]
        );

        const price = menuProducts.reduce((acc, cur) => {
            return (acc += cur.price);
        }, 0);

        const data = {
            name: menu.name,
            products: JSON.stringify([
                ...new Set([...menuProducts.map((p) => p.id), dish.id]),
            ]),
            price,
            images: dish.images, 
        };
        console.log('data menu update---->',data);
        
        try {
            const result = await dispatch(updateMenu({ id: menu.id, data })).unwrap();
            if (result.success) {
                toast({
                    title: "Thành công",
                    description: `Đã thêm món ${dish.name} vào thực đơn ${menu.name}`,
                    status: "success",
                });
                handleUpdateMenu();
            } else {
                toast({
                    title: "Lỗi",
                    description: "Không thể thêm món vào thực đơn, vui lòng thử lại.",
                    status: "error",
                });
            }
        } catch (error) {
            toast({
                title: "Lỗi",
                description: "Đã xảy ra lỗi trong quá trình cập nhật thực đơn.",
                status: "error",
            });
            console.error(error);
        }
    };
    console.log(dish);
    
    return (
        <>
            {addable &&
                (isAdded && !usePopover ? (
                    <Tooltip
                        content="Xóa món ăn"
                        className={`backdrop-blur-sm text-white ${tooltipClassName}`}
                    >
                        <Button
                            isIconOnly
                            className="bg-gold rounded-full"
                            size="md"
                            onClick={() => toast({ title: "Đã xóa món ăn", status: "success" })}
                        >
                            <CheckIcon className="w-5 h-5 text-white" />
                        </Button>
                    </Tooltip>
                ) : (
                    <Popover placement="bottom">
                        <PopoverTrigger>
                            <Button
                                isIconOnly
                                className="bg-gold rounded-full"
                                size="md"
                                isLoading={isUpdatingMenu}
                            >
                                <PlusIcon className="w-5 h-5 text-white" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent>
                            <div className="max-h-[400px] overflow-y-auto py-2">
                                {isUpdatingMenu ? (
                                    <div>Update...</div>
                                ) : isLogedin ? (
                                    userMenuList && userMenuList.length > 0 ? (
                                        userMenuList.map((item, index) => {
                                            const menuProducts = Object.keys(
                                                item.products
                                            ).reduce((acc, cur) => {
                                                return [...acc, ...item.products[cur]];
                                            }, []);

                                            const isAdded = menuProducts
                                                .map((p) => p.id)
                                                .includes(dish.id);
                                            // const isAdded = false;

                                            return (
                                                <div
                                                    key={index}
                                                    className={`flex gap-2 items-center bg-white rounded-lg p-2 mb-2 hover:brightness-90 transition ${isAdded && "opacity-80"
                                                        }`}
                                                >
                                                    <div className="flex flex-center h-full">
                                                        <Button
                                                            onClick={() => handleAddToMenu(item, dish)}
                                                            isIconOnly
                                                            className="bg-transparent w-fit h-fit min-w-0"
                                                            isDisabled={isAdded}
                                                        >
                                                            {isAdded ? (
                                                                <CheckIcon className="w-5 h-5 text-gray-600" />
                                                            ) : (
                                                                <PlusIcon className="w-5 h-5 text-gray-600" />
                                                            )}
                                                        </Button>
                                                    </div>
                                                    <div className="relative w-[60px] h-[88px] rounded-lg overflow-hidden bg-blackAlpha-200 flex-center">
                                                        <Image
                                                            src={item.images.at(0)}
                                                            alt={item.name}
                                                            sizes="100px"
                                                            className="object-cover rounded-lg"
                                                            fill
                                                        />
                                                    </div>
                                                    <div className="flex flex-col gap-3 justify-start h-full">
                                                        <p className="text-base font-semibold text-gray-600">
                                                            {item.name}
                                                        </p>
                                                        <p className="text-gray-600">
                                                            Tạo ngày {formatDate(item.created_at)}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className="flex-center">
                                            <p className="text-md text-gold">
                                                Bạn chưa có thực đơn nào
                                            </p>
                                            <Link
                                                href={"/client/tao-thuc-don"}
                                                className="text-gold underline"
                                            >
                                                Tạo ngay
                                            </Link>
                                        </div>
                                    )
                                ) : (
                                    <div className="flex-center">
                                        <p className="text-md text-gold">
                                            Bạn cần phải đăng nhập để thực hiện thao tác trên
                                        </p>
                                    </div>
                                )}
                            </div>
                        </PopoverContent>
                    </Popover>
                ))}
        </>
    );
}

export default AddToMenuButton;
