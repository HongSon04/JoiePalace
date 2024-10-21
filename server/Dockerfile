# Sử dụng Node.js làm base image
FROM node:20

# Thiết lập thư mục làm việc
WORKDIR /usr/src/app

# Sao chép package.json và package-lock.json
COPY package*.json ./

# Cài đặt các dependencies
RUN npm install

# Sao chép toàn bộ mã nguồn vào container
COPY . .

# Biên dịch ứng dụng
RUN npm run build

# Mở cổng mà ứng dụng sẽ chạy
EXPOSE 5000

# Sao chép script vào container
COPY start.sh ./
RUN chmod +x start.sh

# Chạy script
CMD ["./start.sh"]
