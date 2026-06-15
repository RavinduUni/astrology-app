import { Router } from "express"
import {
    register,
    login,
    logout,
    getProfile,
    updateProfile,
    getHoroscope,
    getAuspiciousTimes,
    getDailyReports,
    getDomainReports,
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

const mainRouter = Router();

mainRouter.post("/register",register)
mainRouter.post("/login",login)
mainRouter.post("/logout",logout)

mainRouter.get("/profile",getProfile)
mainRouter.put("/profile",updateProfile)

mainRouter.get("/horoscope",getHoroscope)
mainRouter.get("/auspicious-times",getAuspiciousTimes)

mainRouter.get("/reports",getDailyReports)
mainRouter.get("/reports/:domain",getDomainReports)

export default mainRouter;