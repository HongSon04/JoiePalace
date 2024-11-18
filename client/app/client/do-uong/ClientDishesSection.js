import { Button } from "@nextui-org/react";
import { Col, Row } from "antd";
import Slider from "react-slick";
import ClientDish from "./ClientDish";
import React from "react";
import Link from "next/link";


var settings = {
  dots: true,
  infinite: false,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  variableWidth: true,
  adaptiveHeight: true,
  appendDots: (dots) => (
    <div className="flex flex-center h-8">
      <ul style={{ margin: "0px" }}> {dots} </ul>
    </div>
  ),
  customPaging: (i) => (
    <div
      style={{
        width: "30px",
        height: "2px",
        background: "#dd9",
      }}
      className="has-[slick-active]:background-gold"
    >
      {i + 1}
    </div>
  ),
};

function ClientDishesSection({
  category,
  index,
  categoryDishes = {},
  onOpenChange,
  onOpen,
  isOpen,
  onSelectCategory,
  onAddDish,
  onRemoveDish,
}) {
  const carouselRef = React.useRef(null);

  const handleNext = () => {
    console.log("Next clicked");
    carouselRef.current.slickNext();
  };

  const handlePrevious = () => {
    console.log("Previous clicked");
    carouselRef.current.slickPrev();
  };

  const renderIcon = (i) => {
    switch (i) {
      case 0:
        return (
          <svg
            width="35"
            height="75"
            viewBox="0 0 35 75"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M7.56336 33.8128L4.78571 29.3111L18.205 7.81505L30.3708 29.2465L27.8478 33.4662L20.5361 20.5857L18.2903 16.6295L15.8813 20.4885L7.56336 33.8128ZM5.19956 37.5993L0.0779506 29.2987L15.9593 3.8589L18.3683 0L20.614 3.95614L35 29.2987L30.1176 37.4647L34.922 45.9283L20.049 70.8039L17.7359 74.6726L15.369 70.8366L0 45.9283L5.19956 37.5993ZM27.7582 41.4109L30.2928 45.876L17.6821 66.9679L4.70776 45.9406L7.54352 41.3981L15.4469 54.207L17.8138 58.043L20.1269 54.1743L27.7582 41.4109ZM25.4884 37.4124L17.76 50.3383L9.90732 37.6116L18.1271 24.4446L25.4884 37.4124Z"
              fill="#B5905B"
            />
          </svg>
        );
      case 1:
        return (
          <svg
            width="52"
            height="59"
            viewBox="0 0 52 59"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M17.6821 50.8042L4.70776 29.7769L18.1271 8.28087L24.0918 18.7884L17.0084 30.135L23.6268 40.8614L17.6821 50.8042ZM25.9937 44.6974L20.049 54.6402L17.7359 58.5089L15.369 54.6729L0 29.7646L15.8813 4.32473L18.2903 0.46582L20.5361 4.42197L26.5008 14.9295L32.8898 4.69518L35.2988 0.836274L37.5445 4.79242L51.9305 30.135L37.0574 55.0106L34.7443 58.8793L32.3774 55.0433L25.9937 44.6974ZM28.7465 18.8856L35.1355 8.65132L47.3013 30.0828L34.6905 51.1746L28.3068 40.8287L34.922 29.7646L28.7465 18.8856ZM26.3375 22.7445L30.2928 29.7123L25.9399 36.9927L21.7162 30.1473L26.3375 22.7445Z"
              fill="#B5905B"
            />
          </svg>
        );
      case 2:
        return (
          <svg
            width="54"
            height="73"
            viewBox="0 0 54 73"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M27.1674 65.8246L5.17843 37.0277L27.8982 7.61922L48.5173 36.9703L27.1674 65.8246ZM0 37.0167L25.4279 4.10282L28.0778 0.672852L30.548 4.18925L53.6094 37.0167L29.771 69.2342L27.2266 72.6728L24.6231 69.2632L0 37.0167ZM26.9202 50.7537L16.0717 36.5464L27.3027 22.0089L37.475 36.489L26.9202 50.7537ZM10.8932 36.5354L24.8325 18.4925L27.4823 15.0625L29.9526 18.5789L42.5671 36.5354L29.5238 54.1633L26.9794 57.602L24.3759 54.1924L10.8932 36.5354Z"
              fill="#B5905B"
            />
          </svg>
        );
      case 3:
        return (
          <svg
            width="60"
            height="61"
            viewBox="0 0 60 61"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M9.96415 35.1217L5.70481 30.9684L9.96415 26.8634V35.1217ZM9.96415 40.6754L0 30.9594L9.96415 21.3562V13.762V9.76203H13.9641H21.9941L28.5057 3.48631L31.4249 0.672852L34.1462 3.55721L40.0004 9.76203H47.7823H51.7823V13.762V22.2496L60 30.9594L51.7823 39.2288V47.5802V51.5802H47.7823H39.508L33.2752 57.8522L30.4722 60.6728L27.604 57.8761L21.1474 51.5802H13.9641H9.96415V47.5802V40.6754ZM17.0452 47.5802H13.9641V44.5758L17.0452 47.5802ZM22.7408 47.5802L13.9641 39.0221V23.0082L23.5579 13.762H38.2007L47.7823 23.9175V37.5709L37.8356 47.5802H22.7408ZM26.843 51.5802L30.407 55.0555L33.8606 51.5802H26.843ZM43.4831 47.5802H47.7823V43.2539L43.4831 47.5802ZM51.7823 33.5458L54.3904 30.9213L51.7823 28.1571V33.5458ZM47.7823 18.01V13.762H43.7744L47.7823 18.01ZM34.4267 9.76203L31.227 6.37067L27.7082 9.76203H34.4267ZM17.8437 13.762H13.9641V17.5011L17.8437 13.762Z"
              fill="#B5905B"
            />
          </svg>
        );
    }
  };

  return (
    <div className="responsive-container font-gilroy" id={category.slug}>
      <Row gutter={[60]} align={"center"}>
        <Col xs={24} sm={24} md={24} lg={16} xl={16}>
          <div className="flex flex-col gap-6 font-gilroy relative">
            {/* HEADER */}
            <div className="flex justify-between items-center">
              <h2 className="text-4xl font-semibold flex gap-4 items-center text-gold">
                {/* ICON */}
                {renderIcon(index)}
                {category.name}
                {categoryDishes[category.slug] ? (
                  <span className="text-xl text-gold font-normal">
                    ({categoryDishes[category.slug].length} món)
                  </span>
                ) : (
                  <span className="text-xl text-gold font-normal">(0 món)</span>
                )}
              </h2>

              <div className="flex gap-3" role="button-wrapper ">
                <div className="flex gap-3" role="carousel-control">
                  <Button
                    isIconOnly
                    className="bg-transparent"
                    onClick={handlePrevious}
                    isDisabled={
                      categoryDishes[category.slug]?.length <= 2 ||
                      !categoryDishes[category.slug]
                    }
                  >
                    <svg
                      width="44"
                      height="45"
                      viewBox="0 0 44 45"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M3.66406 22.3363C3.66406 32.4563 11.8774 40.6696 21.9974 40.6696C32.1174 40.6696 40.3307 32.4563 40.3307 22.3363C40.3307 12.2163 32.1174 4.00293 21.9974 4.00293C11.8774 4.00293 3.66406 12.2163 3.66406 22.3363ZM36.6641 22.3363C36.6641 30.4396 30.1007 37.0029 21.9974 37.0029C13.8941 37.0029 7.33073 30.4396 7.33073 22.3363C7.33073 14.2329 13.8941 7.6696 21.9974 7.6696C30.1007 7.6696 36.6641 14.2329 36.6641 22.3363ZM14.6641 22.3363L21.9974 15.0029L24.5824 17.5879L21.6857 20.5029H29.3307V24.1696H21.6857L24.6007 27.0846L21.9974 29.6696L14.6641 22.3363Z"
                        fill="white"
                      />
                    </svg>
                  </Button>
                  <Button
                    isIconOnly
                    className="bg-transparent"
                    onClick={handleNext}
                    isDisabled={
                      categoryDishes[category.slug]?.length <= 2 ||
                      !categoryDishes[category.slug]
                    }
                  >
                    <svg
                      width="44"
                      height="45"
                      viewBox="0 0 44 45"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M40.3307 22.3363C40.3307 12.2163 32.1174 4.00293 21.9974 4.00293C11.8774 4.00293 3.66406 12.2163 3.66406 22.3363C3.66406 32.4563 11.8774 40.6696 21.9974 40.6696C32.1174 40.6696 40.3307 32.4563 40.3307 22.3363ZM7.33073 22.3363C7.33073 14.2329 13.8941 7.6696 21.9974 7.6696C30.1007 7.6696 36.6641 14.2329 36.6641 22.3363C36.6641 30.4396 30.1007 37.0029 21.9974 37.0029C13.8941 37.0029 7.33073 30.4396 7.33073 22.3363ZM29.3307 22.3363L21.9974 29.6696L19.4124 27.0846L22.3091 24.1696H14.6641V20.5029H22.3091L19.3941 17.5879L21.9974 15.0029L29.3307 22.3363Z"
                        fill="white"
                      />
                    </svg>
                  </Button>
                </div>
                <Button
                  className="bg-gold rounded-full text-white text-sm font-bold"
                  onClick={() => {
                    onSelectCategory(category);
                    onOpen();
                  }}
                >
                  Thêm món ăn
                </Button>
              </div>
            </div>

            {/* MENU DISHES */}
            <div className="flex flex-center mt-8">
              {categoryDishes &&
              categoryDishes[category.slug] &&
              categoryDishes[category.slug].length > 0 ? (
                <Slider
                  className="w-full overflow-hidden flex"
                  ref={carouselRef}
                  {...settings}
                >
                  {/* DISHES */}
                  {categoryDishes[category.slug].map((dish, index) => (
                    <ClientDish
                      dish={dish}
                      key={index}
                      tooltipClassName="!bg-gold"
                      size="md"
                      removable={true}
                      addable={false}
                      removeAction={() =>
                        onRemoveDish({ ...dish, categorySlug: category.slug })
                      }
                    />
                  ))}
                </Slider>
              ) : (
                <div className="flex flex-col gap-2 flex-center">
                  <div className="text-gray-400 text-xl text-center">
                    Mời quý khách chọn món ăn
                  </div>
                  <Link
                    href="/client/mon-an"
                    className="underline text-gold hover:text-gold hover:underline hover:brightness-110"
                  >
                    Xem Thêm
                  </Link>
                </div>
              )}
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default ClientDishesSection;
