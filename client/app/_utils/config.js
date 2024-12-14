import dishImagePlaceholder from "@/public/Alacarte-Menu-Thumbnail.png";
import imageUploaderPlaceholder from "@/public/imageUploaderPlaceholder.svg";
import clientPattern from "@/public/line-group.svg";
import clientDishImagePlaceholder from "@/public/clientDishPlaceholder.png";
import imagePlaceholder from "@/public/image_placeholder.png";

export const CONFIG = {
  IMAGE_PLACEHOLDER: imagePlaceholder,
  DISH_IMAGE_PLACEHOLDER: dishImagePlaceholder,
  IMAGE_UPLOADER_PLACEHOLDER: imageUploaderPlaceholder,
  CLIENT_PATTERN: clientPattern,
  CLIENT_DISH_IMAGE_PLACEHOLDER: clientDishImagePlaceholder,
  ITEMS_PER_PAGE: [5, 10, 20, 50, 80, 100],
  BOOKING_STATUS: [
    {
      key: "pending",
      label: "Chờ xử lý",
    },
    {
      key: "processing",
      label: "Đang xử lý",
    },
    {
      key: "success",
      label: "Thành công",
    },
    {
      key: "cancel",
      label: "Đã hủy",
    },
  ],
  MENU_STATUS: [
    {
      key: "active",
      label: "Hoạt động",
    },
    {
      key: "deleted",
      label: "Đã xóa",
    },
  ],
  STAGE_STATUS: [
    {
      key: "Không hoạt động",
      label: "Không hoạt động",
    },
    {
      key: "Đang tổ chức",
      label: "Đang tổ chức",
    },
    {
      key: "Sắp diễn ra",
      label: "Sắp diễn ra",
    },
    {
      key: "Không có tiệc",
      label: "Không có tiệc",
    },
    {
      key: "Đã hoàn thành",
      label: "Đã hoàn thành",
    },
  ],
};

export const roles = [
  {
    key: "admin",
    label: "Admin",
  },
  {
    key: "manager",
    label: "Manager",
  },
  {
    key: "chef",
    label: "Chef",
  },
  {
    key: "accountant",
    label: "Accountant",
  },
];

export const partyTypes = [
  {
    key: "wedding",
    label: "Wedding",
  },
  {
    key: "birthday",
    label: "Birthday",
  },
  {
    key: "corporate",
    label: "Corporate",
  },
  {
    key: "other",
    label: "Other",
  },
];

export const dishCategories = [
  {
    id: 1,
    key: "appetizer",
    label: "Khai vị",
  },
  {
    id: 2,
    key: "mainCourse",
    label: "Món chính",
  },
  {
    id: 3,
    key: "dessert",
    label: "Món tráng miệng",
  },
];

export const beverageCategories = [
  {
    id: 1,
    key: "nuoc-ngot",
    label: "Nước ngọt",
  },
  {
    id: 2,
    key: "do-uong-co-con",
    label: "Đồ uống có cồn",
  },
  {
    id: 4,
    key: "nuoc-tinh-khiet",
    label: "Nước tinh khiết",
  },
];
