/**
 * Auth Controller Tests
 * 
 * Unit tests for authentication controller.
 */

import { Request, Response } from 'express';
import AuthController from '../../controllers/auth.controller';
import userModel from '../../models/user.model';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Mock dependencies
jest.mock('../../models/user.model');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('AuthController', () => {
  let authController: AuthController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;

  beforeEach(() => {
    authController = new AuthController();
    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnValue({ json: mockJson });
    mockResponse = {
      json: mockJson,
      status: mockStatus,
    };
    mockRequest = {
      body: {},
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should return 400 if email or password is missing', async () => {
      mockRequest.body = { email: 'test@example.com' };
      await authController.login(mockRequest as Request, mockResponse as Response);
      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: expect.objectContaining({
            code: 'VALIDATION_ERROR',
          }),
        })
      );
    });

    it('should return 401 if user is not found', async () => {
      mockRequest.body = { email: 'test@example.com', password: 'password123' };
      (userModel.findByEmail as jest.Mock).mockResolvedValue(null);
      await authController.login(mockRequest as Request, mockResponse as Response);
      expect(mockStatus).toHaveBeenCalledWith(401);
    });

    it('should return 401 if password is incorrect', async () => {
      mockRequest.body = { email: 'test@example.com', password: 'wrongpassword' };
      (userModel.findByEmail as jest.Mock).mockResolvedValue({
        id: 1,
        email: 'test@example.com',
        password: 'hashedpassword',
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);
      await authController.login(mockRequest as Request, mockResponse as Response);
      expect(mockStatus).toHaveBeenCalledWith(401);
    });

    it('should return token and user data on successful login', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        role: 'admin',
        password: 'hashedpassword',
      };
      mockRequest.body = { email: 'test@example.com', password: 'password123' };
      (userModel.findByEmail as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue('mock-token');
      await authController.login(mockRequest as Request, mockResponse as Response);
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            token: 'mock-token',
            user: expect.objectContaining({
              id: 1,
              email: 'test@example.com',
            }),
          }),
        })
      );
    });
  });
});

