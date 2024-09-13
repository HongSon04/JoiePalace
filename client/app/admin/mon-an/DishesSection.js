import Dish from "@/app/_components/Dish";
import { PlusIcon } from "@heroicons/react/24/outline";
import { Button } from "@nextui-org/react";
import { Col, Row } from "antd";

function DishesSection({ dishesType }) {
  const dishes = {
    "Khai Vị": [
      {
        id: 1,
        name: "Gỏi cuốn",
        price: 2600000,
        image:
          "https://plus.unsplash.com/premium_photo-1661771822467-e516ca075314?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8ZGlzaHxlbnwwfHwwfHx8MA%3D%3D",
      },
      {
        id: 2,
        name: "Gỏi ngó súng",
        price: 2600000,
        image:
          "https://plus.unsplash.com/premium_photo-1661771822467-e516ca075314?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8ZGlzaHxlbnwwfHwwfHx8MA%3D%3D",
      },
      {
        id: 3,
        name: "Gỏi ngó sen",
        price: 2600000,

        image:
          "https://plus.unsplash.com/premium_photo-1661771822467-e516ca075314?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8ZGlzaHxlbnwwfHwwfHx8MA%3D%3D",
      },
      {
        id: 4,
        name: "Gỏi ngó súng",
        price: 2600000,
        image:
          "https://plus.unsplash.com/premium_photo-1661771822467-e516ca075314?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8ZGlzaHxlbnwwfHwwfHx8MA%3D%3D",
      },
    ],
    "Món chính": [
      {
        id: 3,
        name: "Cá kho tộ",
        price: 100000,
        image:
          "https://plus.unsplash.com/premium_photo-1661771822467-e516ca075314?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8ZGlzaHxlbnwwfHwwfHx8MA%3D%3D",
      },
      {
        id: 4,
        name: "Gà nướng",
        price: 100000,
        image:
          "https://plus.unsplash.com/premium_photo-1661771822467-e516ca075314?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8ZGlzaHxlbnwwfHwwfHx8MA%3D%3D",
      },
    ],
    "Món tráng miệng": [
      {
        id: 5,
        name: "Chè",
        price: 30000,
        image:
          "https://plus.unsplash.com/premium_photo-1661771822467-e516ca075314?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8ZGlzaHxlbnwwfHwwfHx8MA%3D%3D",
      },
      {
        id: 6,
        name: "Kem",
        price: 20000,
        image:
          "https://plus.unsplash.com/premium_photo-1661771822467-e516ca075314?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8ZGlzaHxlbnwwfHwwfHx8MA%3D%3D",
      },
    ],
  }[dishesType];

  return (
    <div className="mb-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-600">{dishesType}</h2>
        <Button
          radius="full"
          className="glass text-white font-semibold !shrink-0"
          isIconOnly
        >
          <PlusIcon width={20} height={20} />
        </Button>
      </div>
      <Row gutter={[12, 12]} className="mt-3">
        {dishes.map((dish, index) => (
          <Dish key={index} dish={dish} />
        ))}
        {/* Add button */}
        <Col
          span={8}
          md={{
            span: 6,
          }}
        >
          <div className="bg-white p-3 group rounded-lg shadow-md flex items-center hover:brightness-95 flex-center h-full">
            <Button isIconOnly className="bg-blackAlpha-100" radius="full">
              <PlusIcon className="w-5 h-5 text-gray-600 font-semibold" />
            </Button>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default DishesSection;
