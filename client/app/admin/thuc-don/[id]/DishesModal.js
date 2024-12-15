import Dish from "@/app/_components/Dish";
import useCustomToast from "@/app/_hooks/useCustomToast";
import { API_CONFIG, makeAuthorizedRequest } from "@/app/_utils/api.config";
import { capitalize } from "@/app/_utils/helpers";
import {
  Button,
  Checkbox,
  CheckboxGroup,
  Skeleton,
  extendVariants,
} from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import { Col, Modal, Row } from "antd";
import { useSearchParams } from "next/navigation";
import React from "react";

const CustomCheckbox = extendVariants(Checkbox, {
  variants: {
    color: {
      teal: {
        wrapper: "data-[selected=true]:after:!bg-teal-400",
      },
    },
  },
});

function DishesModal({
  isOpen,
  categories,
  onOpenChange,
  selectedMenuDishes,
  setSelectedMenuDishes,
  setMenuDishes,
  menuDishes,
  onRemoveAllDishes,
}) {
  const toast = useCustomToast();
  const searchParams = useSearchParams();
  const [page, setPage] = React.useState(1);
  const [search, setSearch] = React.useState("");
  const [category, setCategory] = React.useState("");

  React.useEffect(() => {
    const dishesCategorySlug = searchParams.get("dishesCategory");
    const category = categories
      ?.at(0)
      ?.childrens?.find((item) => item.slug === dishesCategorySlug);
    setCategory(category);
  }, [searchParams, categories]);

  const {
    data: categoryDishes,
    isLoading: isFetchingCategoryDishes,
    isError: isFetchingCategoryDishesError,
  } = useQuery({
    queryKey: ["categoryDishes", category?.id, page, search],
    queryFn: async () => {
      const abortController = new AbortController();
      const signal = abortController.signal;

      const response = await makeAuthorizedRequest(
        API_CONFIG.PRODUCTS.GET_BY_CATEGORY(
          category?.id,
          {
            page,
            search,
          },
          signal
        )
      );

      if (response.success) {
        return response;
      } else {
        throw new Error(response.message);
      }
    },
    enabled: !!category,
  });

  const handleAddDish = (dishes, category) => {
    setMenuDishes((prev) => {
      const existingDishes = prev[category.id] || [];
      const newDishes = dishes.filter(
        (dish) => !existingDishes.some((item) => item.id === dish.id)
      );

      return {
        ...prev,
        [category.id]: [...existingDishes, ...newDishes],
      };
    });
  };

  React.useEffect(() => {
    if (isOpen) {
      setSelectedMenuDishes(menuDishes[category?.id] || []);
    } else {
      setSelectedMenuDishes([]);
    }
  }, [isOpen, menuDishes, category]);

  return (
    <Modal
      title={
        <h2 className="text-base font-semibold p-3 rounded-md bg-zinc-100 text-gray-600 w-fit">
          {capitalize(category?.name)}
        </h2>
      }
      footer={[
        <Button
          variant="flat"
          key={"cancel"}
          className="rounded-full mr-3"
          onClick={() => onOpenChange(false)}
        >
          Đóng
        </Button>,
        <Button
          key={"choose"}
          className="bg-teal-400 text-white rounded-full"
          onClick={() => {
            handleAddDish(selectedMenuDishes, category);
            setSelectedMenuDishes([]);
            onOpenChange(false);
          }}
        >
          Chọn
        </Button>,
      ]}
      centered
      open={isOpen}
      onOk={() => onOpenChange(false)}
      onCancel={() => onOpenChange(false)}
      width={1000}
    >
      {isFetchingCategoryDishes ? (
        <DishesSkeleton />
      ) : (
        <CheckboxGroup
          value={selectedMenuDishes.map((dish) => dish.id)} // Use dish.id for value
          onValueChange={(selectedIds) => {
            const selectedDishes = categoryDishes?.data?.filter((dish) =>
              selectedIds.includes(dish.id)
            );
            setSelectedMenuDishes(selectedDishes || []);
          }}
          lazy
        >
          <Row gutter={[12, 12]} className="w-full">
            {categoryDishes?.data?.map((dish, index) => (
              <Col span={12} key={index}>
                <div className="max-w-full">
                  <CustomCheckbox
                    color="teal"
                    className="w-full max-w-none"
                    value={dish.id}
                    name="dish"
                    classNames={{
                      label: "w-full",
                    }}
                  >
                    <Dish
                      key={dish.id}
                      dish={dish}
                      mode="dark"
                      className={"!w-full z-0 relative !bg-gray-100"}
                      navigate={false}
                    />
                  </CustomCheckbox>
                </div>
              </Col>
            ))}
          </Row>
        </CheckboxGroup>
      )}
    </Modal>
  );
}

export default DishesModal;

function DishesSkeleton() {
  return (
    <div className="columns-2">
      {[...Array(6)].map((_, index) => (
        <div key={index}>
          <Skeleton width="100%" height="200px" className="rounded-lg" />
        </div>
      ))}
    </div>
  );
}
