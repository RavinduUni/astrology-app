import { Router } from "express"
import {
    register,
    login,
    logout,
    getProfile,
    updateProfile,
    getHomeDashboard,
    getReportsDashboard,
    getHoroscope,
    getAuspiciousTimes,
    getDailyReports,
    getDomainReports,
    getRemedies,
    getYearlyReports,
    getWeeklyReports,
    getMonthlyReports,
    shareReport,
    chatMessage,
    chatHistory,
    getAstrologers,
    getAstrologerById,
    getNotifications,
    markNotificationAsRead,
    getStarbaseArticles,
    getStarbaseArticleById
} from "../controllers/mainController.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import upload from "../configs/multer.js";

const mainRouter = Router();

// ── Auth ────────────────────────────────────────────────────────────────────
mainRouter.post("/auth/register", register)
mainRouter.post("/auth/login", login)
mainRouter.post("/auth/logout", logout)

// ── User ─────────────────────────────────────────────────────────────────────
mainRouter.get("/user/profile", verifyToken, getProfile)
mainRouter.put("/user/profile", verifyToken, upload.single('avatar'), updateProfile)

// ── Dashboard (new single-call endpoints) ────────────────────────────────────
mainRouter.get("/dashboard/home", verifyToken, getHomeDashboard)
mainRouter.get("/dashboard/reports", verifyToken, getReportsDashboard)

// ── Horoscope (legacy — delegates to dashboard) ───────────────────────────────
mainRouter.get("/horoscope", verifyToken, getHoroscope)
mainRouter.get("/horoscope/auspicious-times", verifyToken, getAuspiciousTimes)

// ── Reports (legacy) ─────────────────────────────────────────────────────────
mainRouter.get("/reports", verifyToken, getDailyReports)
mainRouter.get("/reports/remedies", verifyToken, getRemedies)
mainRouter.get("/reports/yearly", verifyToken, getYearlyReports)
mainRouter.get("/reports/weekly", verifyToken, getWeeklyReports)
mainRouter.get("/reports/monthly", verifyToken, getMonthlyReports)
mainRouter.get("/reports/:domain", verifyToken, getDomainReports)
mainRouter.post("/reports/share", verifyToken, shareReport)

// ── Chat ─────────────────────────────────────────────────────────────────────
mainRouter.post("/chat/message", verifyToken, chatMessage)
mainRouter.get("/chat/history", verifyToken, chatHistory)

// ── Astrologers ───────────────────────────────────────────────────────────────
mainRouter.get("/astrologers", getAstrologers)
mainRouter.get("/astrologers/:id", getAstrologerById)

// ── Notifications ─────────────────────────────────────────────────────────────
mainRouter.get("/notifications", verifyToken, getNotifications)
mainRouter.put("/notifications/:id/read", verifyToken, markNotificationAsRead)

// ── Starbase ──────────────────────────────────────────────────────────────────
mainRouter.get("/starbase/articles", getStarbaseArticles)
mainRouter.get("/starbase/articles/:id", getStarbaseArticleById)

export default mainRouter;