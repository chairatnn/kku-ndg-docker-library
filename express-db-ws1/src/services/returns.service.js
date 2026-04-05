const returnsRepo = require("../repositories/returns.repo");

async function returnBook({ borrowId, userId, userRole }) {
  // 1. ตรวจสอบว่ามีรายการยืมนี้จริงหรือไม่ (404)
  const borrow = await returnsRepo.getBorrowById(borrowId);
  if (!borrow) {
    const error = new Error("Borrow record not found");
    error.status = 404;
    throw error;
  }

  // 🚩 2. ปรับปรุงการตรวจสอบสิทธิ์ (หัวใจสำคัญ)
  const isStaff = userRole === "Admin" || userRole === "Librarian";
  const isOwner = Number(borrow.userId) === Number(userId);

  // ถ้าไม่ใช่เจ้าของ และ ไม่ใช่เจ้าหน้าที่ ให้ปฏิเสธ (403)
  if (!isOwner && !isStaff) {
    const error = new Error("You do not have permission to return this book");
    error.status = 403;
    throw error;
  }

  // 3. ตรวจสอบว่าคืนไปหรือยัง (409)
  if (borrow.returnedAt) {
    const error = new Error("This book has already been returned");
    error.status = 409;
    throw error;
  }

  // 4. ทำการคืนหนังสือในฐานข้อมูล
  return await returnsRepo.returnBorrow({ borrowId });
}

module.exports = { returnBook };
