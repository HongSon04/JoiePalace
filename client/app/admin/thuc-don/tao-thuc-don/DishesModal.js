import Dish from "@/app/_components/Dish";
import { getDishes } from "@/app/_lib/features/dishes/dishesSlice";
import { capitalize } from "@/app/_utils/helpers";
import {
  Button,
  Checkbox,
  CheckboxGroup,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { Col, Row } from "antd";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "@chakra-ui/react";

function DishesModal({
  isOpen,
  category,
  onAddingDishes,
  menuDishes,
  menuInfo,
  onOpenChange,
  selectedMenuDishes,
  setSelectedMenuDishes,
}) {
  const toast = useToast();
  const { dishes } = useSelector((state) => state.dishes);
  const categoryDishes = dishes.filter((dish) => dish.category === category);
  const [isUnCheckAll, setIsUnCheckAll] = React.useState(false);
  const dispatch = useDispatch();

  const handleAddSelectedMenuDishes = (selectedMenuDish) => {
    setSelectedMenuDishes((prev) => [...prev, selectedMenuDish]);
  };

  const handleRemoveSelectedMenuDishes = (selectedMenuDish) => {
    setSelectedMenuDishes((prev) =>
      prev.filter((dish) => dish.id !== selectedMenuDish.id)
    );
  };

  const handleValueChange = (dish) => {
    if (selectedMenuDishes.map((dish) => dish.id).includes(dish.id)) {
      handleRemoveSelectedMenuDishes(dish);
    } else {
      handleAddSelectedMenuDishes(dish);
    }
  };

  React.useEffect(() => {
    dispatch(getDishes());
  }, [dispatch]);

  React.useEffect(() => {
    if (isOpen) {
      setSelectedMenuDishes(menuDishes[category]);
    }
  }, [isOpen, menuDishes, menuInfo, category, setSelectedMenuDishes]);

  React.useEffect(() => {
    if (selectedMenuDishes.length === 0) setIsUnCheckAll(false);
    else setIsUnCheckAll(true);
  }, [selectedMenuDishes]);

  return (
    <Modal scrollBehavior="inside" isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader
              className={`flex ${isUnCheckAll ? "gap-3 items-center" : ""}`}
            >
              <h2 className="text-base font-semibold p-3 rounded-md bg-zinc-100 text-gray-600 w-fit">
                {capitalize(category)}
              </h2>
              {isUnCheckAll && (
                <Button
                  variant="flat"
                  color="danger"
                  onClick={() => {
                    setIsUnCheckAll(true);
                    onAddingDishes([], category);
                  }}
                >
                  Bỏ chọn
                </Button>
              )}
            </ModalHeader>
            <ModalBody>
              <CheckboxGroup
                value={selectedMenuDishes.map((dish) => dish.id)}
                lazy
                // isDisabled={isDisabled}
              >
                <Row gutter={[12, 12]}>
                  {categoryDishes.map((dish, index) => (
                    <Col span={24} key={index} className="w-full">
                      <Checkbox
                        className="w-full max-w-none"
                        value={dish.id}
                        name="dish"
                        classNames={{
                          label: "w-full",
                        }}
                        onChange={(e) => handleValueChange(dish)}
                      >
                        <Dish
                          key={dish.id}
                          dish={dish}
                          mode="dark"
                          className={"w-full z-0 relative"}
                          navigate={false}
                        />
                      </Checkbox>
                    </Col>
                  ))}
                </Row>
              </CheckboxGroup>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Đóng
              </Button>
              <Button
                color="primary"
                onPress={() => {
                  // validate number of dishes before adding
                  if (
                    selectedMenuDishes.length >
                    menuInfo[`max${capitalize(category)}`]
                  ) {
                    toast({
                      title: "Chưa chọn đúng số lượng món ăn",
                      description:
                        "Vui lòng chọn lại, hoặc điều chỉnh số lượng món ăn",
                      status: "warning",
                      duration: 2000,
                      isClosable: true,
                    });
                    return;
                  }
                  onAddingDishes(selectedMenuDishes, category);
                  setSelectedMenuDishes([]);
                  onClose();
                }}
              >
                Chọn
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

export default DishesModal;
