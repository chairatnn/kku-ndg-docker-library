# ใช้ Node.js version 20 บน Alpine Linux
FROM node:20-alpine

# กำหนดโฟลเดอร์ทำงานภายใน Container
WORKDIR /app

# คัดลอกไฟล์จัดการ package
COPY package*.json ./

# ติดตั้ง dependencies
RUN npm install

# คัดลอกซอร์สโค้ดทั้งหมด
COPY . .

# เปิดพอร์ต 3001 ตามที่คุณใช้งาน
EXPOSE 3001

# สั่งรันแอปพลิเคชัน (สำหรับ React/Next.js มักใช้ npm run dev หรือ npm start)
CMD ["npm", "run", "dev", "--", "--port", "3001", "--host", "0.0.0.0"]