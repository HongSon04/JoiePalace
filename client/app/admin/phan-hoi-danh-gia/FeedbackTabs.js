"use client";

import CanNotAccess from "@/app/_components/CanNotAccess";
import CustomPagination from "@/app/_components/CustomPagination";
import Error from "@/app/_components/Error";
import useApiServices from "@/app/_hooks/useApiServices";
import useBranchAccess from "@/app/_hooks/useBranchGuard";
import useCustomToast from "@/app/_hooks/useCustomToast";
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
import { useParams } from "next/navigation";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../loading";

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
  const [selectedTab, setSelectedTab] = React.useState(0);
  const [date, setDate] = React.useState({
    start: parseDate(
      format(new Date(new Date().getFullYear(), 0, 1), "yyyy-MM-dd")
    ),
    end: parseDate(
      format(new Date(new Date().getFullYear(), 11, 31), "yyyy-MM-dd")
    ),
  });
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

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
    pagination,
  } = useSelector((store) => store.feedbacks);

  const filteredFeedbacks = feedbacks.filter(
    (f) => f.created_at >= date.start && f.created_at <= date.end
  );

  const { currentBranch } = useSelector((store) => store.branch);

  const [currentPage, setCurrentPage] = React.useState(1);

  const getFeedbacks = async (
    params = {
      page: currentPage,
      branch_id: currentBranch.id,
    }
  ) => {
    dispatch(fetchFeedbacksRequest());

    // Check if the current branch is the general branch -> remove branch_id from the params
    if (currentBranch.slug === API_CONFIG.GENERAL_BRANCH) {
      delete params.branch_id;
    }

    const data = await makeAuthorizedRequest(
      API_CONFIG.FEEDBACKS.GET_ALL(params)
    );

    console.log(data);

    if (data.success) {
      dispatch(fetchFeedbacksSuccess(data));
    } else {
      dispatch(fetchFeedbacksFailure(data));
    }
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

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  React.useEffect(() => {
    async function fetchData() {
      await getFeedbacks({
        is_approved: false,
        page: currentPage,
        branch_id: currentBranch.id,
      });
    }

    fetchData();

    return () => {
      console.log("Cleanup get initial feedbacks");
    };
  }, [currentPage]);

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
      dispatch(approvingFeedbackSuccess());

      toast({
        title: "Duyệt phản hồi thành công",
        description: "Phản hồi đã được duyệt. Đang lấy dữ liệu mới",
      });

      dispatch(fetchFeedbacksRequest());

      const feedbackData = await getFeedbacks();

      if (!feedbackData) return;

      if (feedbackData.success) {
        dispatch(fetchFeedbacksSuccess(feedbackData.data));

        toast({
          title: "Lấy dữ liệu mới thành công",
        });
        dispatch(approvingFeedbackSuccess(feedbackData.data));
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
      dispatch(hidingFeedbackSuccess());

      toast({
        title: "Ẩn phản hồi thành công",
        description: "Phản hồi đã được ẩn. Đang lấy dữ liệu mới",
      });

      dispatch(fetchFeedbacksRequest());

      const feedbackData = await getFeedbacks();

      if (!feedbackData) return;

      if (feedbackData.success) {
        toast({
          title: "Lấy dữ liệu mới thành công",
        });
        dispatch(fetchFeedbacksSuccess(feedbackData.data));
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

  const handleUnApprove = async (feedback) => {
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
        is_approved: false,
      }
    );

    if (data.success) {
      dispatch(approvingFeedbackSuccess());

      toast({
        title: "Hủy duyệt phản hồi thành công",
        description: "Phản hồi đã được hủy duyệt. Đang lấy dữ liệu mới",
      });

      dispatch(fetchFeedbacksRequest());

      const feedbackData = await getFeedbacks();

      if (!feedbackData) return;

      if (feedbackData.success) {
        dispatch(fetchFeedbacksSuccess(feedbackData.data));

        toast({
          title: "Lấy dữ liệu mới thành công",
        });
        dispatch(approvingFeedbackSuccess(feedbackData.data));
      }

      dispatch(fetchFeedbacksFailure());
      toast({
        title: "Lấy dữ liệu mới không thành công",
        description: "Vui lòng thử lại sau",
      });
    }

    dispatch(approvingFeedbackFailure());
    toast({
      title: "Hủy duyệt phản hồi không thành công",
      description: "Vui lòng thử lại sau",
      type: "error",
    });
  };

  const handleShowFeedback = async (feedback) => {
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
        is_show: true,
        is_approved: feedback.is_approved,
      }
    );

    if (data.success) {
      dispatch(hidingFeedbackSuccess());

      toast({
        title: "Hiện phản hồi thành công",
        description: "Phản hồi đã được hiện. Đang lấy dữ liệu mới",
      });

      dispatch(fetchFeedbacksRequest());

      const feedbackData = await getFeedbacks();

      if (!feedbackData) return;

      if (feedbackData.success) {
        toast({
          title: "Lấy dữ liệu mới thành công",
        });
        dispatch(fetchFeedbacksSuccess(feedbackData.data));
      }

      dispatch(fetchFeedbacksFailure());
      toast({
        title: "Lấy dữ liệu mới không thành công",
        description: "Vui lòng thử lại sau",
      });
    }

    dispatch(hidingFeedbackFailure());
    toast({
      title: "Hiện phản hồi không thành công",
      description: "Vui lòng thử lại sau",
      type: "error",
    });
  };

  const handleUpdateFeedback = async (feedback, action) => {
    switch (action) {
      case "approve":
        await handleApprove(feedback);
        onClose();
        break;
      case "hide":
        await handleHide(feedback);
        onClose();
        break;
      case "unapprove":
        await handleUnApprove(feedback);
        onClose();
        break;
      case "show":
        await handleShowFeedback(feedback);
        onClose();
        break;

      default:
        throw new Error("Ation not found");
        break;
    }
  };

  React.useEffect(() => {
    async function fetchData() {
      await fetchFeedbacksByCategory(selectedTab);
    }

    fetchData();

    return () => {
      console.log("Cleanup fetchFeedbacksByCategory");
    };
  }, [selectedTab]);

  const fetchFeedbacksByCategory = async (tabIndex) => {
    dispatch(fetchFeedbacksRequest());

    try {
      let feedbacks;
      if (tabIndex === 0) {
        feedbacks = await getFeedbacks({
          is_approved: false,
          page: currentPage,
          branch_id: currentBranch.id,
        });
        console.log(feedbacks);
      } else if (tabIndex === 1) {
        feedbacks = await getFeedbacks({
          is_approved: true,
          page: currentPage,
          branch_id: currentBranch.id,
        });
        console.log(feedbacks);
      } else if (tabIndex === 2) {
        feedbacks = await getFeedbacks({
          is_show: false,
          page: currentPage,
          branch_id: currentBranch.id,
        });
        console.log(feedbacks);
      }

      dispatch(fetchFeedbacksSuccess(feedbacks));
    } catch (err) {
      dispatch(fetchFeedbacksFailure());
    }
  };

  const handleTabChange = (index) => {
    // console.log("index", index);
    setSelectedTab(index);
  };

  return (
    <>
      {/*  LOADING */}
      {isLoading && <Loading />}
      {/*  CAN NOT ACCESS */}
      {!canAccess && <CanNotAccess retryUrl={retryUrl} />}
      {error && <Error error={error} />}
      {canAccess && !isLoading && !error && (
        <>
          <Tabs
            className="mt-8"
            variant={"unstyled"}
            onChange={handleTabChange}
          >
            <TabList width={"fit-content"} className="!w-full flex">
              {categories.map((c, i) => (
                <Tab
                  key={i}
                  color={"white"}
                  className="aria-[selected=true]:opacity-100 opacity-45 aria-[selected=true]:font-semibold transition text-lg flex items-center gap-2"
                >
                  {c.name}
                  {/* <Chip
                    color="default"
                    classNames={{
                      base: "shrink-0 max-w-3 min-w-5 h-3 min-h-5 text-xs rounded-md",
                      content: "font-bold",
                    }}
                    size="small"
                  >
                    
                  </Chip> */}
                </Tab>
              ))}

              {/* HIDEN FEEDBACKS TAB */}
              <Tab
                color={"white"}
                className="aria-[selected=true]:opacity-100 opacity-45 aria-[selected=true]:font-semibold transition text-lg flex items-center gap-2"
              >
                Ẩn
                {/* <Chip
                  color="default"
                  classNames={{
                    base: "shrink-0 max-w-3 min-w-5 h-3 min-h-5 text-xs rounded-md",
                    content: "font-bold",
                  }}
                  size="small"
                >
                  1
                </Chip> */}
              </Tab>
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
            <TabIndicator
              mt="1.5px"
              height="2px"
              bg="white"
              borderRadius="2px"
            />
            <TabPanels>
              <TabPanel className="mt-3 rounded-md" key={1}>
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
                            <DropdownItem
                              variant="flat"
                              key="approve"
                              onClick={() =>
                                handleUpdateFeedback(feedback, "approve")
                              }
                            >
                              Duyệt
                            </DropdownItem>
                            <DropdownItem
                              variant="flat"
                              key="hide"
                              onClick={() =>
                                handleUpdateFeedback(feedback, "hide")
                              }
                            >
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
                {/* Pagination Component */}{" "}
                <CustomPagination
                  key={"pagination-1"}
                  total={pagination.lastPage}
                  onChange={handlePageChange}
                  page={currentPage}
                  className="mt-5"
                />
              </TabPanel>
              <TabPanel className="mt-3 rounded-md" key={2}>
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
                            <DropdownItem
                              variant="flat"
                              key="approve"
                              onClick={() =>
                                handleUpdateFeedback(feedback, "unapprove")
                              }
                            >
                              Bỏ duyệt
                            </DropdownItem>
                            <DropdownItem
                              variant="flat"
                              key="hide"
                              onClick={() =>
                                handleUpdateFeedback(feedback, "hide")
                              }
                            >
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
                {/* Pagination Component */}{" "}
                <CustomPagination
                  key={"pagination-2"}
                  total={pagination.lastPage}
                  onChange={handlePageChange}
                  page={currentPage}
                  className="mt-5"
                />
              </TabPanel>
              <TabPanel className="mt-3 rounded-md" key={3}>
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
                            <DropdownItem
                              variant="flat"
                              key="hide"
                              onClick={() =>
                                handleUpdateFeedback(feedback, "show")
                              }
                            >
                              Hiện
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
                {/* Pagination Component */}{" "}
                <CustomPagination
                  key={"pagination-3"}
                  total={pagination.lastPage}
                  onChange={handlePageChange}
                  page={currentPage}
                  className="mt-5"
                />
              </TabPanel>
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
                    {selectedFeedback.is_show ? (
                      <>
                        <Button
                          color="default"
                          variant="flat"
                          onPress={() =>
                            handleUpdateFeedback(selectedFeedback, "hide")
                          }
                          isLoading={isHiding}
                        >
                          {isHiding ? "Đang ẩn..." : "Ẩn"}
                        </Button>
                        {!selectedFeedback.is_approved ? (
                          <Button
                            className="bg-teal-400 text-white"
                            onPress={() =>
                              handleUpdateFeedback(selectedFeedback, "approve")
                            }
                            isLoading={isApproving}
                          >
                            {isApproving ? "Đang duyệt..." : "Duyệt"}
                          </Button>
                        ) : (
                          <Button
                            color="default"
                            variant="flat"
                            onPress={() =>
                              handleUpdateFeedback(
                                selectedFeedback,
                                "unapprove"
                              )
                            }
                            isLoading={isApproving}
                          >
                            {isApproving ? "Đang bỏ duyệt..." : "Bỏ duyệt"}
                          </Button>
                        )}
                      </>
                    ) : (
                      <Button
                        color="default"
                        variant="flat"
                        onPress={() =>
                          handleUpdateFeedback(selectedFeedback, "show")
                        }
                        isLoading={isHiding}
                      >
                        {isHiding ? "Đang hiện..." : "Hiện"}
                      </Button>
                    )}
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
        </>
      )}
    </>
  );
}

export default FeedbackTabs;
