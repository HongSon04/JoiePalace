#!/bin/sh

# Chạy lệnh Prisma generate
npx prisma generate

# Chạy lệnh Prisma migrate
npx prisma migrate dev

# Chạy ứng dụng
npm run start:prod
