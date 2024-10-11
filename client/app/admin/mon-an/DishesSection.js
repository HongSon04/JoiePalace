import CustomInput from "@/app/_components/CustomInput";
import Dish from "@/app/_components/Dish";
import { getDishesByCategory } from "@/app/_lib/features/dishes/dishesSlice";
import { dishCategories } from "@/app/_utils/config";
import { _require } from "@/app/_utils/validations";
import { PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/modal";
import { Button, Spinner } from "@nextui-org/react";
import { Col, Row } from "antd";
import { Suspense, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

function DishesSection({ dishCategory }) {
  const dispatch = useDispatch();

  const { categoryDishes: dishes, status } = useSelector(
    (state) => state.dishes
  );

  useEffect(() => {
    function fetchCategoryDishes(dishCategory) {
      // Fetch dishes by category
      dispatch(getDishesByCategory(dishCategory));
    }

    fetchCategoryDishes(dishCategory.key);

    return () => {};
  }, [dishCategory, dispatch]);

  const methods = useForm();

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      {status === "loading" && (
        <div className="flex justify-center items-center">
          <Spinner size="large" />
        </div>
      )}
      {status === "failed" && (
        <div className="flex justify-center items-center">
          <p className="text-red-500">Failed to load dishes</p>
        </div>
      )}
      {status === "succeeded" && (
        <div className="mb-5">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">
              {dishCategory.label}
            </h2>
            <Button
              isIconOnly
              className="bg-whiteAlpha-100"
              radius="full"
              onClick={onOpen}
            >
              <PlusIcon className="w-5 h-5 text-white font-semibold" />
            </Button>
          </div>
          <Row gutter={[12, 12]} className="mt-3">
            {dishes.map((dish, index) => (
              <Col
                span={8}
                md={{
                  span: 6,
                }}
                key={index}
              >
                <Dish dish={dish} />
              </Col>
            ))}
            {/* Add button */}
            <Col
              span={8}
              md={{
                span: 6,
              }}
            >
              <Button
                onPress={onOpen}
                isIconOnly
                className="bg-whiteAlpha-100 p-3 group rounded-lg shadow-md flex items-center hover:whiteAlpha-200 cursor-pointer flex-center h-full w-full"
                radius="full"
              >
                <PlusIcon className="w-5 h-5 text-white font-semibold" />
              </Button>
            </Col>
          </Row>

          {/* MODAL */}
          {isOpen && (
            <Suspense fallback={<Spinner color="secondary" />}>
              <>
                <Modal
                  isOpen={isOpen}
                  onOpenChange={onOpenChange}
                  placement="top-center"
                >
                  <ModalContent>
                    {(onClose) => (
                      <FormProvider {...methods}>
                        <form>
                          <ModalHeader className="flex flex-col gap-1">
                            Thêm món ăn
                          </ModalHeader>
                          <ModalBody>
                            <CustomInput
                              name="name"
                              ariaLabel={"Tên món ăn"}
                              autoFocus={true}
                              label="Tên món"
                              placeholder="Nhập tên món"
                              variant="bordered"
                              validation={_require}
                              classNames={{
                                input: "bg-blackAlpha-100",
                                label: "text-gray-600 font-semibold",
                              }}
                            />
                            <CustomInput
                              name="price"
                              ariaLabel={"Giá món"}
                              label="Giá món / 1 suất"
                              placeholder="Nhập giá món"
                              type="password"
                              variant="bordered"
                              validation={_require}
                              className={"mt-5"}
                              classNames={{
                                input: "bg-blackAlpha-100",
                                label: "text-gray-600 font-semibold",
                              }}
                            />
                            <div className="flex flex-col">
                              <h4 className="text-gray-600 font-semibold text-small mb-1">
                                Danh mục món ăn
                              </h4>
                              <select
                                required
                                className="w-full bg-gray-100"
                                label="Danh mục món ăn"
                                areaLabel="Danh mục món ăn"
                                name="dishCategory"
                              >
                                {dishCategories.map((category) => (
                                  <option
                                    key={category.id}
                                    value={category.key}
                                  >
                                    {category.label}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </ModalBody>
                          <ModalFooter>
                            <Button
                              color="danger"
                              onPress={onClose}
                              startContent={<XMarkIcon />}
                            >
                              Hủy
                            </Button>
                            <Button
                              className="bg-blue-400 hover:bg-blue-500 text-white"
                              onPress={onClose}
                              startContent={<PlusIcon className="w-4 h-4" />}
                            >
                              Thêm
                            </Button>
                          </ModalFooter>
                        </form>
                      </FormProvider>
                    )}
                  </ModalContent>
                </Modal>
              </>
            </Suspense>
          )}
        </div>
      )}
    </>
  );
}

export default DishesSection;
