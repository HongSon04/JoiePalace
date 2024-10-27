"use client";

import CustomPagination from "@/app/_components/CustomPagination";
import useApiServices from "@/app/_hooks/useApiServices";
import {
  fetchFeedbacksFailure,
  fetchFeedbacksRequest,
  fetchFeedbacksSuccess,
} from "@/app/_lib/features/feedbacks/feedbacksSlice";
import { API_CONFIG } from "@/app/_utils/api.config";
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
import { parseDate } from "@internationalized/date";
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
import { format } from "date-fns";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

function FeedbackTabs() {
  const [selectedFeedback, setSelectedFeedback] = React.useState({
    id: 0,
    name: "",
    feedback: "",
    status: "",
    dateTime: "",
    bookingId: "",
    satisLevel: "",
  });

  const [date, setDate] = React.useState({
    start: parseDate(format(new Date().toDateString(), "yyyy-MM-dd")),
    end: parseDate(
      format(
        new Date(new Date().setDate(new Date().getDate() + 7)),
        "yyyy-MM-dd"
      )
    ),
  });

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const status = ["received", "approved"];

  // const feedbacks = [
  //   {
  //     id: 1,
  //     name: "Nguyễn Văn A",
  //     feedback:
  //       "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec nec odio vitae nunc. Donec nec odio vitae nunc. Donec nec odio vitae nunc.",
  //     status: "received",
  //     dateTime: "2024-10-12T11:34:55.082Z",
  //     bookingId: "FDK-ED2-291",
  //     satisLevel: "good",
  //   },
  //   {
  //     id: 2,
  //     name: "Nguyễn Văn B",
  //     feedback:
  //       "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec nec odio vitae nunc. Donec nec odio vitae nunc. Donec nec odio vitae nunc.",
  //     status: "approved",
  //     dateTime: "2024-10-10T11:34:55.082Z",
  //     bookingId: "FDK-ED2-292",
  //     satisLevel: "good",
  //   },
  //   {
  //     id: 3,
  //     name: "Nguyễn Văn C",
  //     feedback:
  //       "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec nec odio vitae nunc. Donec nec odio vitae nunc. Donec nec odio vitae nunc.",
  //     status: "received",
  //     dateTime: "2024-10-10T11:34:55.082Z",
  //     bookingId: "FDK-ED2-293",
  //     satisLevel: "good",
  //   },
  //   {
  //     id: 4,
  //     name: "Nguyễn Văn D",
  //     feedback:
  //       "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec nec odio vitae nunc. Donec nec odio vitae nunc. Donec nec odio vitae nunc.",
  //     status: "approved",
  //     dateTime: "2024-10-10T11:34:55.082Z",
  //     bookingId: "FDK-ED2-294",
  //     satisLevel: "bad",
  //   },
  //   {
  //     id: 5,
  //     name: "Nguyễn Văn E",
  //     feedback:
  //       "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec nec odio vitae nunc. Donec nec odio vitae nunc. Donec nec odio vitae nunc.",
  //     status: "received",
  //     dateTime: "2024-10-10T11:34:55.082Z",
  //     bookingId: "FDK-ED2-295",
  //     satisLevel: "good",
  //   },
  //   {
  //     id: 6,
  //     name: "Nguyễn Văn F",
  //     feedback:
  //       "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec nec odio vitae nunc. Donec nec odio vitae nunc. Donec nec odio vitae nunc.",
  //     status: "approved",
  //     dateTime: "2024-10-10T11:34:55.082Z",
  //     bookingId: "FDK-ED2-296",
  //     satisLevel: "normal",
  //   },
  //   {
  //     id: 7,
  //     name: "Nguyễn Văn G",
  //     feedback:
  //       "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec nec odio vitae nunc. Donec nec odio vitae nunc. Donec nec odio vitae nunc.",
  //     status: "received",
  //     dateTime: "2024-10-12T11:34:55.082Z",
  //     bookingId: "FDK-ED2-297",
  //     satisLevel: "bad",
  //   },
  //   {
  //     id: 8,
  //     name: "Nguyễn Văn H",
  //     feedback:
  //       "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec nec odio vitae nunc. Donec nec odio vitae nunc. Donec nec odio vitae nunc.",
  //     status: "approved",
  //     dateTime: "2024-10-12T11:34:55.082Z",
  //     bookingId: "FDK-ED2-298",
  //     satisLevel: "good",
  //   },
  //   {
  //     id: 9,
  //     name: "Nguyễn Văn I",
  //     feedback:
  //       "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec nec odio vitae nunc. Donec nec odio vitae nunc. Donec nec odio vitae nunc.",
  //     status: "received",
  //     dateTime: "2024-10-22T11:34:55.082Z",
  //     bookingId: "FDK-ED2-299",
  //     satisLevel: "normal",
  //   },
  //   {
  //     id: 10,
  //     name: "Nguyễn Văn J",
  //     feedback:
  //       "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec nec odio vitae nunc. Donec nec odio vitae nunc. Donec nec odio vitae nunc.",
  //     status: "approved",
  //     dateTime: "2024-10-22T11:34:55.082Z",
  //     bookingId: "FDK-ED2-300",
  //     satisLevel: "great",
  //   },
  // ].filter((f) => f.dateTime >= date.start && f.dateTime <= date.end);

  // const categories = [
  //   {
  //     key: "requested",
  //     name: "Đã nhận",
  //   },
  //   {
  //     key: "approved",
  //     name: "Đã duyệt",
  //   },
  // ];

  const dispatch = useDispatch();
  const { makeAuthorizedRequest } = useApiServices();
  const { feedbacks, categories } = useSelector((state) => state.feedbacks);

  const getFeedbacks = async () => {
    dispatch(fetchFeedbacksRequest());

    const data = await makeAuthorizedRequest(
      API_CONFIG.FEEDBACKS.GET_ALL_SHOW,
      "GET",
      null
    );

    console.log(data);

    if (data.success) {
      dispatch(fetchFeedbacksSuccess(data.data));
    }

    dispatch(fetchFeedbacksFailure());
  };

  React.useEffect(() => {
    getFeedbacks();
  }, []);

  return (
    <>
      {/*  TABS */}
      <Tabs className="mt-8" variant={"unstyled"}>
        <TabList width={"fit-content"} className="!w-full flex">
          {categories.map((c) => (
            <Tab
              key={c.key}
              color={"white"}
              className="aria-[selected=true]:opacity-100 opacity-45 aria-[selected=true]:font-semibold transition text-lg flex items-center gap-2"
            >
              {c.name}
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
          ))}
          <div className="flex-1 justify-end flex">
            <DateRangePicker
              value={date}
              onChange={setDate}
              className="w-fit"
              aria-label="Date Range Picker"
              classNames={{
                inputWrapper: "!bg-whiteAlpha-100",
                "start-input": "text-white *:text-white",
                "end-input": "text-white *:text-white",
                innerWrapper:
                  "text-white [&>data-[slot=start-input]>data-[slot=segment]]:text-white",
                segment:
                  "text-white data-[editable=true]:text-white data-[editable=true]:data-[placeholder=true]:text-white",
              }}
            />
          </div>
        </TabList>
        <TabIndicator mt="1.5px" height="2px" bg="white" borderRadius="2px" />
        <TabPanels>
          {status.map((item, index) => (
            <TabPanel className="mt-3 rounded-md" key={index}>
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
                    className={`p-2 rounded-md text-white hover:bg-whiteAlpha-200 mb-2 border-top-whiteAlpha-100`}
                  >
                    <Col span={12}>
                      <div className="flex items-center gap-3">
                        <Avatar className="shrink-0" />
                        <div className="w-full">
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
                        onPress={() => {
                          setSelectedFeedback(feedback);
                          onOpen();
                        }}
                      >
                        Xem
                      </Button>
                    </Col>
                    <Col span={3} className="flex items-center">
                      <Dropdown variant="flat">
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
                          <DropdownItem variant="flat" key="approve">
                            Duyệt
                          </DropdownItem>
                          <DropdownItem variant="flat" key="hide">
                            Ẩn
                          </DropdownItem>
                          <DropdownItem variant="flat" key="edit">
                            Chỉnh sửa
                          </DropdownItem>
                          <DropdownItem
                            key="delete"
                            className="text-danger"
                            color="danger"
                            variant="flat"
                          >
                            Delete
                          </DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    </Col>
                  </Row>
                ))}
            </TabPanel>
          ))}
        </TabPanels>
        <CustomPagination total={status.length} />
      </Tabs>
      {/* MODAL */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <div className="flex items-center gap-3">
                  <Avatar className="shrink-0" />
                  <div className="flex flex-col gap-1">
                    <h2 className="text-lg font-semibold">
                      Mức độ hài lòng: {selectedFeedback.satisLevel}
                    </h2>
                    <span className="text-xs text-gray-400">
                      {formatDateTime(new Date())}
                    </span>
                  </div>
                </div>
              </ModalHeader>
              <ModalBody>
                {selectedFeedback.feedback.split("\n").map((f, i) => (
                  <p key={i} className="text-md">
                    {f}
                  </p>
                ))}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Xóa
                </Button>
                <Button color="warning" variant="flat" onPress={onClose}>
                  Ẩn
                </Button>
                {selectedFeedback.status === "received" && (
                  <Button className="bg-teal-400 text-white" onPress={onClose}>
                    Duyệt
                  </Button>
                )}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default FeedbackTabs;
