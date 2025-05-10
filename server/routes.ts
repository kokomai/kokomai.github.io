import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes for the wedding invitation app
  app.get('/api/wedding-info', (req, res) => {
    res.json({
      groomName: "김철수",
      brideName: "이영희",
      date: "2023년 12월 25일 토요일 오후 1시",
      location: "서울특별시 강남구 테헤란로 123",
      venue: "그랜드 웨딩홀 5층",
      groomParents: "김OO & 박OO",
      brideParents: "이OO & 최OO",
    });
  });

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  const httpServer = createServer(app);

  return httpServer;
}
