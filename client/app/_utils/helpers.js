import jwt from "jsonwebtoken";

/**
 * Decodes a JWT access token and returns the payload.
 * @param {string} token - The JWT access token to decode.
 * @returns {object|null} - The decoded payload or null if the token is invalid.
 */
export const decodeJwt = (token) => {
  try {
    // Decode the token without verifying the signature
    const decoded = jwt.decode(token);
    return decoded; // Return the decoded payload
  } catch (error) {
    console.error("Error decoding JWT:", error);
    return null; // Return null if decoding fails
  }
};

/**
 * Capitalizes the first letter of a string.
 * @param {string} str - The string to capitalize.
 * @returns {string} - The capitalized string.
 */
export const capitalize = (str) => {
  if (!str) return;
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export function generateUniqueWeddingPackageName() {
  const adjectives = [
    "Thanh Lịch",
    "Lãng Mạn",
    "Duyên Dáng",
    "Mơ Mộng",
    "Vĩnh Cửu",
    "Huyền Bí",
    "Xa Hoa",
    "Gần Gũi",
    "Rực Rỡ",
    "Lôi Cuốn",
    "Tươi Sáng",
    "Ngọt Ngào",
    "Quyến Rũ",
    "Đầy Màu Sắc",
    "Tuyệt Vời",
    "Hạnh Phúc",
    "Thú Vị",
    "Mới Mẻ",
    "Sang Trọng",
    "Thơ Mộng",
  ];

  const nouns = [
    "Lễ Kỷ Niệm",
    "Liên Minh",
    "Buổi Lễ",
    "Sự Kiện",
    "Tụ Họp",
    "Tiệc",
    "Chương Trình",
    "Trải Nghiệm",
    "Hành Trình",
    "Cuộc Gặp Gỡ",
    "Buổi Tiệc",
    "Lễ Hội",
    "Ngày Đặc Biệt",
    "Chuyến Đi",
    "Kỷ Niệm",
    "Cuộc Tụ Họp",
    "Lễ Đính Hôn",
    "Tiệc Cưới",
    "Buổi Họp Mặt",
    "Sự Gặp Gỡ",
  ];

  const themes = [
    "Dưới Những Vì Sao",
    "Bên Bờ Biển",
    "Trong Vườn",
    "Phong Cách Mộc Mạc",
    "Sang Trọng Cổ Điển",
    "Tình Yêu Hiện Đại",
    "Cổ Tích",
    "Lãng Mạn Cổ Điển",
    "Hạnh Phúc Bohemian",
    "Đêm Lấp Lánh",
    "Khu Vườn Bí Mật",
    "Chuyến Đi Mơ Ước",
    "Bữa Tiệc Ngọt Ngào",
    "Hành Trình Tình Yêu",
    "Mùa Xuân Tươi Đẹp",
    "Đêm Huyền Ảo",
    "Lễ Hội Ánh Sáng",
    "Khung Cảnh Lãng Mạn",
    "Chạm Vào Tình Yêu",
    "Bầu Trời Đầy Sao",
    "Hơi Thở Của Biển",
  ];

  // Randomly select one from each list
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const theme = themes[Math.floor(Math.random() * themes.length)];

  // Get current timestamp
  const timestamp = Date.now();

  // Create a unique package name
  const packageName = `${noun} ${adjective} - ${theme} #${timestamp}`;
  return packageName;
}

export function decodeWeddingPackageName(packageName) {
  // Split the package name by the '#' character
  const [namePart, codePart] = packageName.split("#");

  // Trim any whitespace
  const userFriendlyName = namePart.trim();

  // Return the user-friendly name and the code
  return {
    userFriendlyName,
    code: codePart ? codePart.trim() : null,
  };
}

export function generateMenuName() {
  const adjectives = [
    "Tinh Tế",
    "Sang Trọng",
    "Quý Phái",
    "Đẳng Cấp",
    "Huyền Ảo",
    "Lộng Lẫy",
    "Nguy Nga",
    "Thượng Hạng",
    "Độc Đáo",
    "Mê Hoặc",
    "Rực Rỡ",
    "Thú Vị",
    "Ngọt Ngào",
    "Tuyệt Vời",
    "Hạnh Phúc",
    "Mới Mẻ",
  ];

  const nouns = [
    "Thực Đơn",
    "Bữa Tiệc",
    "Tiệc Tối",
    "Chương Trình Ẩm Thực",
    "Buổi Tiệc Sang Trọng",
    "Trải Nghiệm Ẩm Thực",
    "Bữa Tiệc Đặc Biệt",
    "Thực Đơn Đẳng Cấp",
    "Tiệc Cưới",
    "Buổi Gặp Gỡ",
    "Lễ Kỷ Niệm",
    "Tiệc Chiêu Đãi",
    "Bữa Tiệc Lãng Mạn",
    "Chuyến Đi Ẩm Thực",
    "Buổi Tiệc Huyền Bí",
    "Tiệc Ngọt",
  ];

  const themes = [
    "Dưới Ánh Nến",
    "Bên Bờ Biển Sang Trọng",
    "Trong Vườn Hoa",
    "Phong Cách Cổ Điển",
    "Hương Vị Từ Biển",
    "Mùa Xuân Tươi Đẹp",
    "Đêm Lấp Lánh",
    "Khung Cảnh Lãng Mạn",
    "Hành Trình Ẩm Thực",
    "Bữa Tiệc Ngọt Ngào",
    "Hơi Thở Của Biển",
    "Chạm Vào Tình Yêu",
    "Bầu Trời Đầy Sao",
    "Lễ Hội Ánh Sáng",
    "Chuyến Đi Mơ Ước",
    "Khung Cảnh Huyền Ảo",
  ];

  // Randomly select one from each list
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const theme = themes[Math.floor(Math.random() * themes.length)];

  // Get current timestamp
  const timestamp = Date.now();

  // Create a unique menu name
  const menuName = `${noun} ${adjective} - ${theme} #${timestamp}`;
  return menuName;
}

export function decodeRandomName(name) {
  // Split the package name by the '#' character
  const [namePart, codePart] = name.split("#");

  // Trim any whitespace
  const userFriendlyName = namePart.trim();

  // Return the user-friendly name and the code
  return {
    userFriendlyName,
    code: codePart ? codePart.trim() : null,
  };
}
