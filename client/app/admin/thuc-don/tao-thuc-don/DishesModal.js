import Dish from "@/app/_components/Dish";
import { getDishes } from "@/app/_lib/features/dishes/dishesSlice";
import { capitalize } from "@/app/_utils/helpers";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { Col, Row } from "antd";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

function DishesModal({ isOpen, onOpenChange, category }) {
  const { dishes } = useSelector((state) => state.dishes);
  const categoryDishes = dishes.filter((dish) => dish.category === category);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getDishes());
  }, []);

  return (
    <Modal
      scrollBehavior="inside"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      classNames={{
        // header: "p-3 rounded-md bg-whiteAlpha-200",
        base: "bg-blackAlpha-800",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <h2 className="text-base font-semibold p-3 rounded-md bg-whiteAlpha-200 text-white w-fit">
                {capitalize(category)}
              </h2>
            </ModalHeader>
            <ModalBody>
              <Row gutter={[12, 12]}>
                {categoryDishes.map((dish, index) => (
                  <Col span={24} key={index}>
                    <Dish key={dish.id} dish={dish} className={"w-full"} />
                  </Col>
                ))}
              </Row>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
              <Button color="primary" onPress={onClose}>
                Action
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

export default DishesModal;
