const express = require("express");
const authRequired = require("../middlewares/authRequired");
const borrowsService = require("../services/borrows.service");
const borrowsRepo = require("../repositories/borrows.repo");
const usersRepo = require("../repositories/users.repo");

const router = express.Router();

// ดึงข้อมูลสำหรับ Dropdown ในหน้ายืม
router.get("/options", authRequired, async (req, res, next) => {
  try {
    const users = await usersRepo.listAllUsers();
    const books = await borrowsRepo.listAvailableBooks(); // หรือเรียกผ่าน booksRepo
    res.json({ users, books });
  } catch (err) {
    next(err);
  }
});

// --- 1. GET: ดึงรายการยืมทั้งหมด (สำหรับหน้า Return และ Admin) ---
router.get("/", authRequired, async (req, res, next) => {
  try {
    const userRole = req.user.role;
    const userId = Number(req.user.sub);

    // 🚩 ถ้าเป็น Admin/Librarian ให้ดึงทั้งหมดทันที
    if (userRole === "Admin" || userRole === "Librarian") {
      const borrows = await borrowsRepo.listAllBorrows();
      return res.json({ data: borrows });
    }

    // ถ้าเป็นคนทั่วไป เห็นแค่ของตัวเอง
    const borrows = await borrowsRepo.listBorrowsByUser(userId);
    res.json({ data: borrows });
  } catch (err) {
    next(err);
  }
});

// --- 2. POST: ยืมหนังสือ ---
router.post("/", authRequired, async (req, res, next) => {
  try {
    const bookId = Number(req.body?.bookId);
    const userId = Number(req.body?.userId);
    const dueDate = req.body?.dueDate;

    if (!userId) return res.status(400).json({ message: "userId is required" });

    const borrow = await borrowsService.borrowBook({
      userId: Number(req.body.userId),
      bookId: Number(req.body.bookId),
      dueDate: req.body.dueDate,
    });

    res.status(201).json({ data: borrow });
  } catch (err) {
    if (err && err.status)
      return res.status(err.status).json({ message: err.message });
    next(err);
  }
});

module.exports = router;
