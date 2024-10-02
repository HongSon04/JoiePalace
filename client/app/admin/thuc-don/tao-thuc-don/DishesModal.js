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
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

function DishesModal({
  isOpen,
  category,
  onAddingDishes,
  menuDishes,
  menuInfo,
  disabled,
}) {
  const { dishes } = useSelector((state) => state.dishes);
  const categoryDishes = dishes.filter((dish) => dish.category === category);
  const [selectedMenuDishes, setSelectedMenuDishes] = React.useState([]);
  const [isDisabled, setIsDisabled] = React.useState(false);
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

  const handleUnCheckAll = () => {
    setSelectedMenuDishes([]);
    setIsDisabled(false);
  };

  React.useEffect(() => {
    dispatch(getDishes());
  }, []);

  React.useEffect(() => {
    if (selectedMenuDishes.length >= menuInfo[`max${capitalize(category)}`])
      setIsDisabled(true);
    else setIsDisabled(false);
  }, [selectedMenuDishes]);

  return (
    <Modal scrollBehavior="inside" isOpen={isOpen}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader
              className={`flex ${isDisabled ? "gap-3 items-center" : ""}`}
            >
              <h2 className="text-base font-semibold p-3 rounded-md bg-zinc-100 text-gray-600 w-fit">
                {capitalize(category)}
              </h2>
              {isDisabled && (
                <Button
                  variant="flat"
                  color="danger"
                  onClick={handleUnCheckAll}
                >
                  Bỏ chọn
                </Button>
              )}
            </ModalHeader>
            <ModalBody>
              <CheckboxGroup
                defaultValue={
                  disabled || menuDishes[category].map((dish) => dish.id)
                }
                isDisabled={isDisabled}
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
                        // isSelected={}
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
