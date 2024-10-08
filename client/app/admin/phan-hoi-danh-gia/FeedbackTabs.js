"use client";

import { formatDateTime } from "@/app/_utils/formaters";
import { capitalize } from "@/app/_utils/helpers";
import {
  Tab,
  TabIndicator,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline";
import {
  Avatar,
  Button,
  Chip,
  DateRangePicker,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { Col, Row } from "antd";

function FeedbackTabs() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const status = ["received", "approved"];

  const feedbacks = [
    {
      id: 1,
      name: "Nguyễn Văn A",
      feedback:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec nec odio vitae nunc. Donec nec odio vitae nunc. Donec nec odio vitae nunc.",
      status: "received",
      dateTime: "2024-10-07T11:34:55.082Z",
      bookingId: "FDK-ED2-291",
      satisLevel: "good",
    },
    {
      id: 2,
      name: "Nguyễn Văn B",
      feedback:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec nec odio vitae nunc. Donec nec odio vitae nunc. Donec nec odio vitae nunc.",
      status: "approved",
      dateTime: "2024-10-07T11:34:55.082Z",
      bookingId: "FDK-ED2-292",
      satisLevel: "good",
    },
    {
      id: 3,
      name: "Nguyễn Văn C",
      feedback:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec nec odio vitae nunc. Donec nec odio vitae nunc. Donec nec odio vitae nunc.",
      status: "received",
      dateTime: "2024-10-07T11:34:55.082Z",
      bookingId: "FDK-ED2-293",
      satisLevel: "good",
    },
    {
      id: 4,
      name: "Nguyễn Văn D",
      feedback:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec nec odio vitae nunc. Donec nec odio vitae nunc. Donec nec odio vitae nunc.",
      status: "approved",
      dateTime: "2024-10-07T11:34:55.082Z",
      bookingId: "FDK-ED2-294",
      satisLevel: "bad",
    },
    {
      id: 5,
      name: "Nguyễn Văn E",
      feedback:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec nec odio vitae nunc. Donec nec odio vitae nunc. Donec nec odio vitae nunc.",
      status: "received",
      dateTime: "2024-10-07T11:34:55.082Z",
      bookingId: "FDK-ED2-295",
      satisLevel: "good",
    },
    {
      id: 6,
      name: "Nguyễn Văn F",
      feedback:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec nec odio vitae nunc. Donec nec odio vitae nunc. Donec nec odio vitae nunc.",
      status: "approved",
      dateTime: "2024-10-07T11:34:55.082Z",
      bookingId: "FDK-ED2-296",
      satisLevel: "normal",
    },
    {
      id: 7,
      name: "Nguyễn Văn G",
      feedback:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec nec odio vitae nunc. Donec nec odio vitae nunc. Donec nec odio vitae nunc.",
      status: "received",
      dateTime: "2024-10-07T11:34:55.082Z",
      bookingId: "FDK-ED2-297",
      satisLevel: "bad",
    },
    {
      id: 8,
      name: "Nguyễn Văn H",
      feedback:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec nec odio vitae nunc. Donec nec odio vitae nunc. Donec nec odio vitae nunc.",
      status: "approved",
      dateTime: "2024-10-07T11:34:55.082Z",
      bookingId: "FDK-ED2-298",
      satisLevel: "good",
    },
    {
      id: 9,
      name: "Nguyễn Văn I",
      feedback:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec nec odio vitae nunc. Donec nec odio vitae nunc. Donec nec odio vitae nunc.",
      status: "received",
      dateTime: "2024-10-07T11:34:55.082Z",
      bookingId: "FDK-ED2-299",
      satisLevel: "normal",
    },
    {
      id: 10,
      name: "Nguyễn Văn J",
      feedback:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec nec odio vitae nunc. Donec nec odio vitae nunc. Donec nec odio vitae nunc.",
      status: "approved",
      dateTime: "2024-10-07T11:34:55.082Z",
      bookingId: "FDK-ED2-300",
      satisLevel: "great",
    },
  ];

  return (
    <>
      <Tabs className="mt-8" variant={"unstyled"}>
        <TabList width={"fit-content"}>
          <Tab
            color={"white"}
            className="aria-[selected=true]:opacity-100 opacity-45 aria-[selected=true]:font-semibold transition text-lg flex items-center gap-2"
          >
            Đã nhận
            <Chip
              color="danger"
              classNames={{
                base: "shrink-0 max-w-3 min-w-5 h-3 min-h-5 text-xs rounded-md",
                content: "font-bold",
              }}
              size="small"
            >
              1
            </Chip>
          </Tab>
          <Tab
            color={"white"}
            className="aria-[selected=true]:opacity-100 opacity-45 aria-[selected=true]:font-semibold transition text-lg flex items-center gap-2"
          >
            Đã duyệt
            <Chip
              color="default"
              classNames={{
                base: "shrink-0 max-w-3 min-w-5 h-3 min-h-5 text-xs rounded-md",
                content: "font-bold",
              }}
              size="small"
            >
              1
            </Chip>
          </Tab>
          <DateRangePicker />
        </TabList>
        <TabIndicator mt="1.5px" height="2px" bg="white" borderRadius="2px" />
        <TabPanels>
          {status.map((item, index) => (
            <TabPanel className="mt-3 rounded-md bg-whiteAlpha-100" key={index}>
              {/* HEADER */}
              <Row className="mb-3">
                <Col className="font-semibold text-base text-white" span={12}>
                  Đánh giá
                </Col>
                <Col className="font-semibold text-base text-white" span={3}>
                  Tiệc
                </Col>
                <Col className="font-semibold text-base text-white" span={3}>
                  Độ hài lòng
                </Col>
                <Col className="font-semibold text-base text-white" span={3}>
                  Chi tiết
                </Col>
                <Col className="font-semibold text-base text-white" span={3}>
                  Hành động
                </Col>
              </Row>
              {feedbacks
                .filter((f) => f.status === item)
                .map((feedback) => (
                  <Row
                    key={feedback.id}
                    className={`p-2 rounded-md bg-whiteAlpha-100 text-white hover:bg-whiteAlpha-200 mb-2`}
                  >
                    <Col span={12}>
                      <div className="flex items-center gap-3">
                        <Avatar className="shrink-0" />
                        <div>
                          <div className="flex items-center gap-3 w-full">
                            <h2 className="text-md leading-6 font-semibold">
                              {feedback.name}
                            </h2>
                            <span className="text-xs leading-4 font-normal text-gray-400">
                              {formatDateTime(feedback.dateTime)}
                            </span>
                          </div>
                          <p className="text-md leading-6 truncate max-w-[90%]">
                            {feedback.feedback}
                          </p>
                        </div>
                      </div>
                    </Col>
                    <Col span={3} className="flex items-center">
                      {feedback.bookingId}
                    </Col>
                    <Col span={3} className="flex items-center">
                      {feedback.satisLevel === "normal" && (
                        <Chip
                          color="default"
                          variant="flat"
                          classNames={{
                            content: "text-white",
                          }}
                        >
                          {capitalize(feedback.satisLevel)}
                        </Chip>
                      )}

                      {feedback.satisLevel === "good" && (
                        <Chip
                          variant="flat"
                          classNames={{
                            base: "bg-primary/30",
                            content: "text-primary",
                          }}
                        >
                          {capitalize(feedback.satisLevel)}
                        </Chip>
                      )}

                      {feedback.satisLevel === "great" && (
                        <Chip color="success" variant="flat">
                          {capitalize(feedback.satisLevel)}
                        </Chip>
                      )}

                      {feedback.satisLevel === "bad" && (
                        <Chip color="danger" variant="flat">
                          {capitalize(feedback.satisLevel)}
                        </Chip>
                      )}
                    </Col>
                    <Col span={3} className="flex items-center">
                      <Button
                        size="sm"
                        className={"bg-whiteAlpha-100 text-white font-bold"}
                        onPress={onOpen}
                      >
                        Xem
                      </Button>
                    </Col>
                    <Col span={3} className="flex items-center">
                      <Dropdown>
                        <DropdownTrigger>
                          <Button
                            size="sm"
                            className={"bg-whiteAlpha-100 text-white font-bold"}
                            isIconOnly
                          >
                            <EllipsisHorizontalIcon className="w-5 h-5" />
                          </Button>
                        </DropdownTrigger>
                        <DropdownMenu aria-label="Static Actions">
                          <DropdownItem key="approve">Duyệt</DropdownItem>
                          <DropdownItem key="hide">Ẩn</DropdownItem>
                          <DropdownItem key="edit">Chỉnh sửa</DropdownItem>
                          <DropdownItem
                            key="delete"
                            className="text-danger"
                            color="danger"
                          >
                            Delete file
                          </DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    </Col>
                  </Row>
                ))}
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Modal Title
              </ModalHeader>
              <ModalBody>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Nullam pulvinar risus non risus hendrerit venenatis.
                  Pellentesque sit amet hendrerit risus, sed porttitor quam.
                </p>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Nullam pulvinar risus non risus hendrerit venenatis.
                  Pellentesque sit amet hendrerit risus, sed porttitor quam.
                </p>
                <p>
                  Magna exercitation reprehenderit magna aute tempor cupidatat
                  consequat elit dolor adipisicing. Mollit dolor eiusmod sunt ex
                  incididunt cillum quis. Velit duis sit officia eiusmod Lorem
                  aliqua enim laboris do dolor eiusmod. Et mollit incididunt
                  nisi consectetur esse laborum eiusmod pariatur proident Lorem
                  eiusmod et. Culpa deserunt nostrud ad veniam.
                </p>
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
    </>
  );
}

export default FeedbackTabs;
