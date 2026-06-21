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

mainRouter.post("/auth/register",register)
mainRouter.post("/auth/login",login)
mainRouter.post("/auth/logout",logout)

mainRouter.get("/user/profile",getProfile)
mainRouter.put("/user/profile",updateProfile)

mainRouter.get("/horoscope",getHoroscope)
mainRouter.get("/horoscope/auspicious-times",getAuspiciousTimes)

mainRouter.get("/reports",getDailyReports)
mainRouter.get("/reports/:domain",getDomainReports)

export default mainRouter;