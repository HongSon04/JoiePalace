"use client";

function NotificationBox() {
  // type: newParty, event, payment, update, remind, feedback
  const notifications = [
    {
      id: 1,
      title: "Đơn đặt tiệc mới",
      content:
        "Có đơn đặt tiệc mới từ khách hàng. Vui lòng kiểm tra và xử lý kịp thời.",
      dateTime: new Date(),
      haveRead: false,
      type: "newParty",
    },
    {
      id: 2,
      title: "Liên hệ mới từ khách hàng",
      content:
        "Có liên hệ mới từ khách hàng. Vui lòng kiểm tra và phản hồi kịp thời để hỗ trợ khách hàng.",
      dateTime: new Date(),
      haveRead: false,
      type: "contact",
    },
    {
      id: 3,
      title: "Lịch trình sự kiện",
      content:
        "Thông báo về sự kiện tiệc cưới sắp tới. Địa điểm, thời gian, số lượng khách mời và yêu cầu đặc biệt.",
      dateTime: new Date(),
      haveRead: true,
      type: "event",
    },
    {
      id: 4,
      title: "Thông báo thanh toán",
      content:
        "Có thanh toán mới từ khách hàng. Thông tin về số tiền, phương thức thanh toán và trạng thái thanh toán.",
      dateTime: new Date(),
      haveRead: true,
      type: "payment",
    },
    {
      id: 5,
      title: "Cập nhật sơ đồ bàn tiệc",
      content:
        "Cần cập nhật sơ đồ bàn tiệc. Thay đổi về bố trí bàn, số lượng khách và yêu cầu đặc biệt từ khách hàng.",
      dateTime: new Date(),
      haveRead: false,
      type: "update",
    },
    {
      id: 6,
      title: "Nhắc nhở công việc hàng ngày",
      content:
        "Nhắc nhở nhân viên về công việc cần hoàn thành hàng ngày. Chuẩn bị thực đơn, kiểm tra sơ đồ bàn tiệc và không gian tiệc.",
      dateTime: new Date(),
      haveRead: true,
      type: "remind",
    },
    {
      id: 7,
      title: "Phản hồi từ khách hàng",
      content:
        "Có phản hồi mới từ khách hàng về dịch vụ và trải nghiệm tại nhà hàng tiệc cưới.",
      dateTime: new Date(),
      haveRead: false,
      type: "feedback",
    },
  ];

  return <div></div>;
}

export default NotificationBox;
