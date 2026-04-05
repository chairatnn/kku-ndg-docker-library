const pool = require("../db/pool");
const env = require("../config/env");

function qualify(table) {
  return `${env.dbSchema}.${table}`;
}

async function bookExists(bookId) {
  const sql = `SELECT 1 AS ok FROM ${qualify("books")} WHERE book_id = $1`;
  const result = await pool.query(sql, [bookId]);
  return result.rowCount > 0;
}

async function borrowBook({ userId, bookId, dueDate }) {
  const sql = `
    WITH claimed AS (
      UPDATE ${qualify("books")}
      SET available = false
      WHERE book_id = $1 AND available = true
      RETURNING book_id
    ), inserted AS (
      INSERT INTO ${qualify("borrows")} (user_id, book_id, due_date)
      SELECT $2, claimed.book_id, $3
      FROM claimed
      RETURNING *
    )
    SELECT
      id, 
      user_id AS "userId", 
      book_id AS "bookId", 
      borrowed_at AS "borrowedAt", 
      due_date AS "dueDate", 
      returned_at AS "returnedAt"
    FROM inserted
  `;
  const result = await pool.query(sql, [bookId, userId, dueDate]);
  return result.rows[0] || null;
}

async function listAllBorrows() {
  const sql = `
    SELECT 
      br.id,
      br.user_id, -- เพิ่มมาเพื่อให้ Frontend เช็คสิทธิ์ได้ง่ายขึ้น
      u.name AS user_name,
      b.title AS book_title,
      br.borrowed_at,
      br.due_date,
      br.returned_at,
      CASE 
        WHEN br.returned_at IS NOT NULL THEN 'Returned'
        WHEN br.due_date < CURRENT_DATE THEN 'Overdue'
        ELSE 'Borrowed' -- เปลี่ยนจาก Borrowing เป็น Borrowed ให้ตรงกับมาตรฐานหน้าอื่น
      END AS status
    FROM ${qualify("borrows")} br
    JOIN ${qualify("users")} u ON br.user_id = u.id
    JOIN ${qualify("books")} b ON br.book_id = b.book_id
    ORDER BY (br.returned_at IS NULL) DESC, br.due_date ASC;
  `;
  const result = await pool.query(sql);
  return result.rows;
}

// เพิ่มฟังก์ชัน listBorrowsByUser (หน้าประวัติการยืมต้องใช้)
async function listBorrowsByUser(userId) {
  const sql = `
    SELECT 
      br.id,
      b.title AS book_title,
      br.borrowed_at,
      br.due_date,
      br.returned_at
    FROM ${qualify("borrows")} br
    JOIN ${qualify("books")} b ON br.book_id = b.book_id
    WHERE br.user_id = $1
    ORDER BY br.id DESC;
  `;
  const result = await pool.query(sql, [userId]);
  return result.rows;
}

async function listAvailableBooks() {
  const sql = `
    SELECT book_id, title 
    FROM ${qualify("books")} 
    WHERE available = true 
    ORDER BY title ASC
  `;
  const result = await pool.query(sql);
  return result.rows;
}

async function listAllUsers() {
  const sql = `
    SELECT id, name, email 
    FROM ${qualify("users")} 
    WHERE role != 'admin' -- หรือถ้าอยากให้เลือก admin ด้วยก็เอาบรรทัดนี้ออก
    ORDER BY name ASC
  `;
  const result = await pool.query(sql);
  return result.rows;
}

/**
 * ค้นหาข้อมูลการยืมจาก ID (เพื่อให้ Admin ตรวจสอบได้ทุกคน)
 */
async function findBorrowById(borrowId) {
  const sql = `
    SELECT 
      br.id, 
      br.user_id, 
      br.book_id, 
      br.returned_at,
      u.name AS user_name,
      b.title AS book_title
    FROM ${qualify("borrows")} br
    JOIN ${qualify("users")} u ON br.user_id = u.id
    JOIN ${qualify("books")} b ON br.book_id = b.book_id
    WHERE br.id = $1
    LIMIT 1
  `;
  const result = await pool.query(sql, [borrowId]);
  return result.rows[0] || null;
}

module.exports = {
  bookExists,
  borrowBook,
  listAllBorrows,
  listBorrowsByUser,
  listAvailableBooks,
  listAllUsers,
  findBorrowById,
};
