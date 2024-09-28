import { Col, Row } from "antd";
import Menu from "./Menu";

function MenuList({ menuList, isSelectAll, onCheckboxChange }) {
  // console.log(menuList);
  return (
    <Row gutter={[16, 16]} className="mt-8 w-full">
      {menuList.map((menu, index) => {
        return (
          <Col key={index} span={6} className="overflow-hidden">
            <Menu
              menu={menu}
              isSelectAll={isSelectAll}
              onCheckboxChange={onCheckboxChange}
            />
          </Col>
        );
      })}
    </Row>
  );
}

export default MenuList;
