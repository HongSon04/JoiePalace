"use client";

import AdminHeader from "@/app/_components/AdminHeader";
import CustomInput from "@/app/_components/CustomInput";
import Dish from "@/app/_components/Dish";
import SaveIcon from "@/app/_components/SaveIcon";
import FileUploadButton from "@/app/_components/Uploader";
import { fetchMenu } from "@/app/_lib/features/menu/menuSlice";
import { dishCategories } from "@/app/_utils/config";
import { formatPrice } from "@/app/_utils/formaters";
import { capitalize } from "@/app/_utils/helpers";
import { _require } from "@/app/_utils/validations";
import docScan from "@/public/document_scanner.svg";
import pizza from "@/public/local_pizza.svg";
import restaurant from "@/public/restaurant.svg";
import setMeal from "@/public/set_meal.svg";
import textSnippet from "@/public/text_snippet.svg";
import {
  DocumentArrowUpIcon,
  PlusIcon,
  SquaresPlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { Button, Chip, useDisclosure } from "@nextui-org/react";
import { Col, Row } from "antd";
import Image from "next/image";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import React, { useCallback } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import DishesModal from "../[id]/DishesModal";

function Page() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [dishCategory, setDishCategory] = React.useState([]);
  const [selectedMenuDishes, setSelectedMenuDishes] = React.useState([]);
  const [imageSrc, setImageSrc] = React.useState(""); // State to store image source
  const [appetizer, setAppetizer] = React.useState([]); // Array of dishes
  const [mainCourse, setMainCourse] = React.useState([]); // Array of dishes
  const [dessert, setDessert] = React.useState([]); // Array of dishes

  const [menuDishes, setMenuDishes] = React.useState({
    appetizer,
    mainCourse,
    dessert,
  });

  const handleAddingDishes = (dishes, category) => {
    setMenuDishes((prevMenuDishes) => {
      return {
        ...prevMenuDishes,
        [category]: [...dishes],
      };
    });
  };

  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name, value) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  React.useEffect(() => {
    const dishCategory = searchParams.get("dishesCategory");
    setDishCategory(dishCategory);
  }, [searchParams]);

  React.useEffect(() => {
    setMenuDishes({
      appetizer,
      mainCourse,
      dessert,
    });
  }, [appetizer, mainCourse, dessert]);

  const methods = useForm();

  const { id } = params;

  const { menu, status } = useSelector((store) => store.menu);

  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(fetchMenu(id));
  }, [dispatch, id]);

  // FORM HANDLING
  const [formState, setFormState] = React.useState({
    name: "",
    maxDishes: 8,
    maxAppetizer: 2,
    maxMainCourse: 4,
    maxDessert: 2,
    description: "",
    menuDishes,
  });

  // Function to handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = methods.handleSubmit((data) => {
    console.log(data);
  });

  // Function to handle file upload
  const handleFileUpload = (files) => {
    const file = files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageSrc(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      {/* HEADER */}
      <AdminHeader
        title="Thực đơn"
        path="Thực đơn"
        showNotificationButton={true}
        showHomeButton={true}
        showSearchForm={false}
        className="flex-1"
      />

      {/* BREADCRUMBS */}
      {/* <MenuBreadcrumbs></MenuBreadcrumbs> */}

      {/* MAIN CONTENT */}
      {status === "loading" && <p>Loading...</p>}
      {status === "failed" && <p>Failed to load data</p>}
      {status === "succeeded" && (
        <>
          <div className="flex gap-5 mt-8 w-fit">
            {/* IMAGE & UPLOADER */}
            <FileUploadButton
              size="md"
              accept="image/*"
              onUpload={handleFileUpload}
              className="w-fit relative h-fit bg-whiteAlpha-200 rounded-md"
              acceptProps={{ className: "bg-green-200" }}
              rejectProps={{ className: "bg-red-200" }}
            >
              <Image
                src={imageSrc}
                alt="Upload the menu image here"
                width={345}
                height={440}
              />
              {/* ACTIONS */}
              <div className="flex p-5 gap-5 bg-whiteAlpha-300 rounded-md absolute bottom-3 left-3 right-3 flex-center">
                {/* DELETE */}
                <Button
                  startContent={<TrashIcon />}
                  className="bg-red-400 text-white rounded-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    setImageSrc("");
                  }}
                >
                  Xóa
                </Button>
                {/* UPLOADER */}
                <Button
                  size="md"
                  startContent={
                    <DocumentArrowUpIcon width={20} height={20} color="white" />
                  }
                  className="bg-teal-400 text-white rounded-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    document.querySelector('input[type="file"]').click();
                  }}
                >
                  Upload
                </Button>
              </div>
            </FileUploadButton>
            {/* FORM */}
            <FormProvider {...methods}>
              <form
                onSubmit={(e) => e.preventDefault()}
                noValidate
                className="form h-fit [&>div]:mb-5 [&>div>h4]:font-semibold [&>div>h4]:mb-3 [&>div>h4]:text-white p-5 rounded-md bg-whiteAlpha-100 min-w-[400px]"
              >
                {/* MENU NAME */}
                <div className="flex flex-col">
                  <h4 className="flex gap-3">
                    <Image src={docScan} width={20} height={20} alt="icon" />
                    Tên thực đơn
                  </h4>
                  <CustomInput
                    name="name"
                    value={formState.name}
                    validation={_require}
                    label=""
                    ariaLabel={"Tên thực đơn"}
                    onChange={handleInputChange}
                    placeholder="Ex: Thực đơn tiệc cưới"
                  ></CustomInput>
                </div>
                {/* MAX OF DISHES */}
                <div className="flex flex-col">
                  <h4 className="flex gap-3">
                    <SquaresPlusIcon width={20} height={20} color="white" />
                    Số lượng món tối đa
                  </h4>
                  <CustomInput
                    name="maxDishes"
                    value={formState.maxDishes}
                    validation={_require}
                    label=""
                    ariaLabel={"Tên thực đơn"}
                    onChange={handleInputChange}
                  ></CustomInput>
                </div>
                {/* MAX OF APPETIZER */}
                <div className="flex flex-col">
                  <h4 className="flex gap-3">
                    <Image src={pizza} width={20} height={20} alt="icon" />
                    Số lượng món khai vị
                  </h4>
                  <CustomInput
                    name="maxAppetizer"
                    value={formState.maxAppetizer}
                    validation={_require}
                    label=""
                    ariaLabel={"Số lượng món khai vị"}
                    onChange={handleInputChange}
                  ></CustomInput>
                </div>
                {/* MAX OF MAIN COURSE */}
                <div className="flex flex-col">
                  <h4 className="flex gap-3">
                    <Image src={restaurant} width={20} height={20} alt="icon" />
                    Số lượng món chính
                  </h4>
                  <CustomInput
                    name="maxMainCourse"
                    value={formState.maxMainCourse}
                    validation={_require}
                    label=""
                    ariaLabel={"Số lượng món chính"}
                    onChange={handleInputChange}
                  ></CustomInput>
                </div>
                {/* MAX OF DESSERT */}
                <div className="flex flex-col">
                  <h4 className="flex gap-3">
                    <Image src={setMeal} width={20} height={20} alt="icon" />
                    Số lượng món tráng miệng
                  </h4>
                  <CustomInput
                    name="maxDessert"
                    value={formState.maxDessert}
                    validation={_require}
                    label=""
                    ariaLabel={"Số lượng món tráng miệng"}
                    onChange={handleInputChange}
                  ></CustomInput>
                </div>
                {/* MENU DESCRIPTION */}
                <div className="flex flex-col">
                  <h4 className="flex gap-3">
                    <Image
                      src={textSnippet}
                      width={20}
                      height={20}
                      alt="icon"
                    />
                    Mô tả thực đơn
                  </h4>
                  <CustomInput
                    name="description"
                    value={formState.description}
                    validation={_require}
                    label=""
                    ariaLabel={"Số lượng món khai vị"}
                    multiLine={true}
                    onChange={handleInputChange}
                    placeholder="Ex: Thực đơn giành cho chú rể Nguyễn Văn A và cô dâu Trần Thị B"
                  ></CustomInput>
                </div>
                <footer className="flex justify-end">
                  <Button
                    className="bg-teal-400 text-white font-semibold rounded-full"
                    size="medium"
                    color="primary"
                    startContent={<SaveIcon width={20} height={20} />}
                    onClick={handleSubmit}
                  >
                    Lưu
                  </Button>
                </footer>
              </form>
            </FormProvider>
            {/* DISHES LIST */}
            <Row gutter={[20, 20]}>
              {dishCategories.map((category, index) => (
                <Col span={24} key={index}>
                  {/* HEADER */}
                  <div className="flex justify-between items-center w-full p-3 rounded-xl bg-whiteAlpha-100">
                    <div className="flex flex-col gap-1">
                      <h4 className="text-lg leading-7 font-semibold text-white">
                        {category.label} -{" "}
                        {formState[`max${capitalize(category.key)}`]} món
                      </h4>
                      <p className="text-md leading-6 font-normal text-white">
                        Tổng:{" "}
                        {formatPrice(
                          menuDishes[category.key]
                            .filter((dish) => dish.category === category.key)
                            .map((dish) => dish.price)
                            .reduce((a, b) => a + b, 0)
                        )}
                      </p>
                    </div>
                    <Chip className="bg-whiteAlpha-100 text-white">
                      {(() => {
                        const maxDishes = Number(
                          formState[`max${capitalize(category.key)}`]
                        );
                        const currentDishes = Number(
                          menuDishes[category.key].length
                        );
                        const remainingDishes = maxDishes - currentDishes;
                        return remainingDishes > 0
                          ? `Còn ${remainingDishes}`
                          : "Đã đủ";
                      })()}
                    </Chip>
                  </div>
                  {/* DISHES LIST */}
                  {menu.dishes.map((dish) => {
                    if (dish.category === category.key) {
                      return (
                        <Dish
                          key={dish.id}
                          dish={dish}
                          className={"mt-3 !h-fit !hover:brightness-95"}
                        />
                      );
                    }
                  })}
                  <>
                    <Button
                      isIconOnly
                      onClick={() => {
                        router.push(
                          pathname +
                            "?" +
                            createQueryString("dishesCategory", category.key)
                        );
                        onOpen();
                      }}
                      className="bg-whiteAlpha-100 p-3 group rounded-lg shadow-md flex items-center hover:whiteAlpha-200 cursor-pointer flex-center h-fit w-full mt-3"
                      radius="full"
                    >
                      <PlusIcon className="w-5 h-5 text-white font-semibold" />
                    </Button>
                    <DishesModal
                      category={dishCategory}
                      isOpen={isOpen}
                      onOpenChange={onOpenChange}
                      onAddingDishes={handleAddingDishes}
                      menuDishes={menuDishes}
                      menuInfo={formState}
                      selectedMenuDishes={selectedMenuDishes}
                      setSelectedMenuDishes={setSelectedMenuDishes}
                    />
                  </>
                </Col>
              ))}
            </Row>
          </div>
        </>
      )}
    </div>
  );
}

export default Page;
