"use client";

import CustomPagination from "@/app/_components/CustomPagination";
import useApiServices from "@/app/_hooks/useApiServices";
import useRoleGuard from "@/app/_hooks/useRoleGuard";
import {
  approvingFeedbackFailure,
  approvingFeedbackRequest,
  approvingFeedbackSuccess,
  fetchFeedbacksFailure,
  fetchFeedbacksRequest,
  fetchFeedbacksSuccess,
  hidingFeedbackFailure,
  hidingFeedbackRequest,
  hidingFeedbackSuccess,
  updatingFeedbackFailure,
  updatingFeedbackRequest,
  updatingFeedbackSuccess,
} from "@/app/_lib/features/feedbacks/feedbacksSlice";
import { API_CONFIG } from "@/app/_utils/api.config";
import { formatDateTime, formatFullDateTime } from "@/app/_utils/formaters";
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
import Loading from "../loading";
import { useParams } from "next/navigation";
import useCustomToast from "@/app/_hooks/useCustomToast";
import CanNotAccess from "@/app/_components/CanNotAccess";
import useBranchAccess from "@/app/_hooks/useBranchGuard";
import Error from "@/app/_components/Error";

function FeedbackTabs() {
  const { branchSlug } = useParams();
  const { canAccess, retryUrl } = useBranchAccess(branchSlug);

  const { isLoading } = useRoleGuard();

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
    start: parseDate(
      format(new Date(new Date().getFullYear(), 0, 1), "yyyy-MM-dd")
    ),
    end: parseDate(
      format(new Date(new Date().getFullYear(), 11, 31), "yyyy-MM-dd")
    ),
  });

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

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
  const {
    feedbacks,
    categories,
    isLoading: isFetchingFeedback,
    isError: isFetchingFeedbackError,
    isApproving,
    isHiding,
    error,
  } = useSelector((store) => store.feedbacks);

  const filteredFeedbacks = feedbacks.filter(
    (f) => f.created_at >= date.start && f.created_at <= date.end
  );

  const { currentBranch } = useSelector((store) => store.branch);

  // LATER: check if branch slug equal to general branch, then change the api url
  const endpoint =
    branchSlug === API_CONFIG.GENERAL_BRANCH
      ? API_CONFIG.FEEDBACKS.GET_ALL_SHOW
      : API_CONFIG.FEEDBACKS.GET_BY_BRANCH(currentBranch.id);

  const getFeedbacks = async () => {
    dispatch(fetchFeedbacksRequest());

    const data = await makeAuthorizedRequest(endpoint, "GET", null);

    if (data.success) {
      dispatch(fetchFeedbacksSuccess(data.data));
    }

    dispatch(fetchFeedbacksFailure());
  };

  const getRate = (rate) => {
    if (rate < 10) {
      return "Rất hài lòng";
    } else if (rate < 8) {
      return "Hài lòng";
    } else if (rate < 6) {
      return "Bình thường";
    } else if (rate < 4) {
      return "Không hài lòng";
    } else if (rata < 2) {
      return "Rất không hài lòng";
    }
  };

  React.useEffect(() => {
    getFeedbacks();
  }, []);

  const [currentPage, setCurrentPage] = React.useState(1);
  const perPage = 5; // Number of items per page

  // Calculate the index of the last feedback on the current page
  const indexOfLastFeedback = currentPage * perPage;
  // Calculate the index of the first feedback on the current page
  const indexOfFirstFeedback = indexOfLastFeedback - perPage;
  // Get the current feedbacks to display
  const currentFeedbacks = filteredFeedbacks.slice(
    indexOfFirstFeedback,
    indexOfLastFeedback
  );

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const toast = useCustomToast();

  const handleApprove = async (feedback) => {
    dispatch(approvingFeedbackRequest());

    const data = await makeAuthorizedRequest(
      API_CONFIG.FEEDBACKS.UPDATE(feedback.id),
      "PATCH",
      {
        branch_id: feedback.branch_id,
        booking_id: feedback.booking_id,
        user_id: feedback.bookings.user_id,
        name: feedback.name,
        rate: feedback.rate,
        comments: feedback.comments,
        is_show: feedback.is_show,
        is_approved: true,
      }
    );

    if (data.success) {
      dispatch(approvingFeedbackSuccess(data.data));

      toast({
        title: "Duyệt phản hồi thành công",
        description: "Phản hồi đã được duyệt. Đang lấy dữ liệu mới",
      });

      dispatch(fetchFeedbacksRequest());

      const data = await getFeedbacks();

      if (!data) return;

      if (data.success) {
        dispatch(fetchFeedbacksSuccess(data.data));

        toast({
          title: "Lấy dữ liệu mới thành công",
        });
        dispatch(approvingFeedbackSuccess(data.data));
      }

      dispatch(fetchFeedbacksFailure());
      toast({
        title: "Lấy dữ liệu mới không thành công",
        description: "Vui lòng thử lại sau",
      });
    }

    dispatch(approvingFeedbackFailure());
    toast({
      title: "Duyệt phản hồi không thành công",
      description: "Vui lòng thử lại sau",
      type: "error",
    });
  };

  const handleHide = async (feedback) => {
    dispatch(hidingFeedbackRequest());

    const data = await makeAuthorizedRequest(
      API_CONFIG.FEEDBACKS.UPDATE(feedback.id),
      "PATCH",
      {
        branch_id: feedback.branch_id,
        booking_id: feedback.booking_id,
        user_id: feedback.bookings.user_id,
        name: feedback.name,
        rate: feedback.rate,
        comments: feedback.comments,
        is_show: false,
        is_approved: feedback.is_approved,
      }
    );

    if (data.success) {
      dispatch(hidingFeedbackSuccess(data.data));

      toast({
        title: "Ẩn phản hồi thành công",
        description: "Phản hồi đã được ẩn. Đang lấy dữ liệu mới",
      });

      dispatch(fetchFeedbacksRequest());
      const data = await getFeedbacks();

      if (!data) return;

      if (data.success) {
        toast({
          title: "Lấy dữ liệu mới thành công",
        });
        dispatch(fetchFeedbacksSuccess(data.data));
      }

      dispatch(fetchFeedbacksFailure());
      toast({
        title: "Lấy dữ liệu mới không thành công",
        description: "Vui lòng thử lại sau",
      });
    }

    dispatch(hidingFeedbackFailure());
    toast({
      title: "Ẩn phản hồi không thành công",
      description: "Vui lòng thử lại sau",
      type: "error",
    });
  };

  return (
    <>
      {/*  LOADING */}
      {isLoading && <Loading />}
      {/*  CAN NOT ACCESS */}
      {!canAccess && <CanNotAccess retryUrl={retryUrl} />}
      {error && <Error error={error} />}
      {/*  TABS */}
      <Tabs className="mt-8" variant={"unstyled"}>
        <TabList width={"fit-content"} className="!w-full flex">
          {categories.map((c, i) => (
            <Tab
              key={i}
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
          {categories.map((item, index) => {
            // Filter feedbacks based on the current category's isApproved and isShow properties
            const filteredFeedbacks = currentFeedbacks.filter(
              (f) =>
                f.is_approved === item.isApproved && f.is_show === item.isShow
            );

            return (
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
                {filteredFeedbacks.length > 0 ? (
                  filteredFeedbacks.map((feedback) => (
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
                                {`${
                                  formatFullDateTime(feedback.created_at).time
                                } ${
                                  formatFullDateTime(feedback.created_at).date
                                }`}
                              </span>
                            </div>
                            <p className="text-md leading-6 truncate max-w-[90%]">
                              {feedback.comments}
                            </p>
                          </div>
                        </div>
                      </Col>
                      <Col span={3} className="flex items-center">
                        {feedback.bookings.name}
                      </Col>
                      <Col span={3} className="flex items-center">
                        <Chip
                          color="default"
                          variant="flat"
                          classNames={{
                            content: "text-white",
                          }}
                        >
                          {capitalize(getRate(feedback.rate))}
                        </Chip>
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
                              className={
                                "bg-whiteAlpha-100 text-white font-bold"
                              }
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
                          </DropdownMenu>
                        </Dropdown>
                      </Col>
                    </Row>
                  ))
                ) : (
                  <p className="text-gray-400 text-center text-base p-8">
                    Không có dữ liệu
                  </p>
                )}
                {/* Pagination Component */}
                <CustomPagination
                  total={Math.ceil(filteredFeedbacks.length / perPage)} // Total number of pages
                  initialPage={currentPage} // Start on the first page
                  onPageChange={handlePageChange} // Handle page change
                  className="mt-4" // Add margin for spacing
                />
              </TabPanel>
            );
          })}
        </TabPanels>
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
                      Mức độ hài lòng: {getRate(selectedFeedback.rate)}
                    </h2>
                    <span className="text-xs text-gray-400">
                      {formatDateTime(new Date())}
                    </span>
                  </div>
                </div>
              </ModalHeader>
              <ModalBody>
                {selectedFeedback.comments.split("\n").map((f, i) => (
                  <p key={i} className="text-md">
                    {f}
                  </p>
                ))}
              </ModalBody>
              <ModalFooter>
                {selectedFeedback.is_show && (
                  <Button
                    color="default"
                    variant="flat"
                    onPress={() => handleHide(selectedFeedback)}
                    isLoading={isFetchingFeedback}
                  >
                    {isHiding ? "Đang ẩn..." : "Ẩn"}
                  </Button>
                )}
                {!selectedFeedback.is_approved && (
                  <Button
                    className="bg-teal-400 text-white"
                    onPress={() => handleApprove(selectedFeedback)}
                    isLoading={isFetchingFeedback}
                  >
                    {isApproving ? "Đang duyệt..." : "Duyệt"}
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
