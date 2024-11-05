import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { MailService } from '../mail/mail.service';
import {
  BadRequestException,
  HttpException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let prismaService: PrismaService;
  let jwtService: JwtService;
  let configService: ConfigService;
  let cloudinaryService: CloudinaryService;
  let mailService: MailService;

  const mockPrismaService = {
    users: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    verify_tokens: {
      create: jest.fn(),
      findFirst: jest.fn(),
      delete: jest.fn(),
    },
  };

  const mockJwtService = {
    sign: jest.fn(),
    verifyAsync: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  const mockCloudinaryService = {
    deleteImageByUrl: jest.fn(),
  };

  const mockMailService = {
    confirmRegister: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: CloudinaryService,
          useValue: mockCloudinaryService,
        },
        {
          provide: MailService,
          useValue: mockMailService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);
    cloudinaryService = module.get<CloudinaryService>(CloudinaryService);
    mailService = module.get<MailService>(MailService);

    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    const registerDto = {
      username: 'test',
      email: 'test@test.com',
      password: 'password123',
      phone: '1234567890',
    };

    it('should register a new user successfully', async () => {
      const hashedPassword = 'hashedPassword';
      const mockUser = {
        id: 1,
        ...registerDto,
        password: hashedPassword,
        memberships: null,
      };

      mockPrismaService.users.findUnique.mockResolvedValue(null);
      mockPrismaService.users.create.mockResolvedValue(mockUser);

      jest.spyOn(service, 'hashedPassword').mockReturnValue(hashedPassword);
      jest.spyOn(service, 'generateToken').mockResolvedValue({
        access_token: 'access_token',
        refresh_token: 'refresh_token',
      });

      try {
        await service.register(registerDto);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.getStatus()).toBe(201);
        expect(error.getResponse()).toEqual({
          message:
            'Đăng ký thành công bạn vui lòng kiểm tra email để xác nhận tài khoản',
          data: {
            access_token: 'access_token',
            refresh_token: 'refresh_token',
          },
        });
      }
    });

    it('should throw BadRequestException if email already exists', async () => {
      mockPrismaService.users.findUnique.mockResolvedValue({
        email: registerDto.email,
      });
      await expect(service.register(registerDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('registerSocialUser', () => {
    const socialUserDto = {
      email: 'social@test.com',
      name: 'Social User',
      avatar: 'avatar-url',
      platform: 'google',
      password: 'password123',
      confirm_password: 'password123',
    };

    it('should register social user successfully', async () => {
      const hashedPassword = 'hashedPassword';
      const mockUser = {
        id: 1,
        username: socialUserDto.name,
        email: socialUserDto.email,
        password: hashedPassword,
        avatar: socialUserDto.avatar,
        platform: socialUserDto.platform,
        memberships: null,
      };

      mockPrismaService.users.findUnique.mockResolvedValue(null);
      mockPrismaService.users.create.mockResolvedValue(mockUser);

      jest.spyOn(service, 'hashedPassword').mockReturnValue(hashedPassword);
      jest.spyOn(service, 'generateToken').mockResolvedValue({
        access_token: 'access_token',
        refresh_token: 'refresh_token',
      });

      try {
        await service.registerSocialUser(socialUserDto);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.getStatus()).toBe(201);
      }
    });

    it('should throw BadRequestException if passwords do not match', async () => {
      const invalidDto = { ...socialUserDto, confirm_password: 'different' };
      await expect(service.registerSocialUser(invalidDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException if email already exists', async () => {
      mockPrismaService.users.findUnique.mockResolvedValue({
        email: socialUserDto.email,
      });
      await expect(service.registerSocialUser(socialUserDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('login', () => {
    const loginDto = {
      email: 'test@test.com',
      password: 'password123',
    };

    it('should login user successfully', async () => {
      const mockUser = {
        id: 1,
        email: loginDto.email,
        password: await bcrypt.hash(loginDto.password, 10),
        memberships: null,
      };

      mockPrismaService.users.findFirst.mockResolvedValue(mockUser);
      jest.spyOn(service, 'generateToken').mockResolvedValue({
        access_token: 'access_token',
        refresh_token: 'refresh_token',
      });

      try {
        await service.login(loginDto);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.getStatus()).toBe(200);
      }
    });

    it('should throw BadRequestException if user not found', async () => {
      mockPrismaService.users.findFirst.mockResolvedValue(null);
      await expect(service.login(loginDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException if password is incorrect', async () => {
      const mockUser = {
        id: 1,
        email: loginDto.email,
        password: await bcrypt.hash('differentpassword', 10),
        memberships: null,
      };

      mockPrismaService.users.findFirst.mockResolvedValue(mockUser);
      await expect(service.login(loginDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('loginSocial', () => {
    const socialLoginDto = {
      email: 'social@test.com',
      platform: 'google',
    };

    it('should login social user successfully', async () => {
      const mockUser = {
        id: 1,
        email: socialLoginDto.email,
        platform: socialLoginDto.platform,
        memberships: null,
      };

      mockPrismaService.users.findFirst.mockResolvedValue(mockUser);
      jest.spyOn(service, 'generateToken').mockResolvedValue({
        access_token: 'access_token',
        refresh_token: 'refresh_token',
      });

      try {
        await service.loginSocial(socialLoginDto);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.getStatus()).toBe(200);
      }
    });

    it('should throw BadRequestException if user not found', async () => {
      mockPrismaService.users.findFirst.mockResolvedValue(null);
      await expect(service.loginSocial(socialLoginDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('logout', () => {
    const mockUser = {
      id: 1,
      username: 'test',
      email: 'test@gmail.com',
      password: 'password123',
      phone: '1234567890',
      memberships: null,
      branch_id: null, // or any other required fields
      platform: 'email',
      active: true,
      verify_at: null,
      role: 'user',
      created_at: new Date(),
      updated_at: new Date(),
    };

    it('should logout user successfully', async () => {
      mockPrismaService.users.findUnique.mockResolvedValue(mockUser);
      mockPrismaService.users.update.mockResolvedValue({
        ...mockUser,
        refresh_token: null,
      });

      try {
        await service.logout(mockUser);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.getStatus()).toBe(200);
        expect(error.getMessage()).toBe('Đăng xuất thành công');
      }
    });

    it('should throw NotFoundException if user does not exist', async () => {
      mockPrismaService.users.findUnique.mockResolvedValue(null);
      await expect(service.logout(mockUser)).rejects.toThrow(NotFoundException);
    });
  });

  describe('changeAvatar', () => {
    const mockUser = {
      id: 1,
      username: 'test',
      email: 'test@gmail.com',
      password: 'password123',
      phone: '1234567890',
      memberships: null,
      branch_id: null, // or any other required fields
      platform: 'email',
      avatar: 'old-avatar-url',
      active: true,
      verify_at: null,
      role: 'user',
      created_at: new Date(),
      updated_at: new Date(),
    };
    const newAvatarUrl = 'new-avatar-url';

    it('should change avatar successfully', async () => {
      mockPrismaService.users.findFirst.mockResolvedValue(mockUser);
      mockPrismaService.users.update.mockResolvedValue({
        ...mockUser,
        avatar: newAvatarUrl,
      });
      mockCloudinaryService.deleteImageByUrl.mockResolvedValue(true);

      try {
        await service.changeAvatar(mockUser, newAvatarUrl);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.getStatus()).toBe(200);
        expect(error.getMessage()).toBe('Thay đổi ảnh đại diện thành công');
      }

      expect(mockCloudinaryService.deleteImageByUrl).toHaveBeenCalledWith(
        mockUser.avatar,
      );
    });

    it('should update avatar without deleting old avatar if none exists', async () => {
      const userWithoutAvatar = { ...mockUser, avatar: null } as any; //
      mockPrismaService.users.findFirst.mockResolvedValue(userWithoutAvatar);
      mockPrismaService.users.update.mockResolvedValue({
        ...userWithoutAvatar,
        avatar: newAvatarUrl,
      });

      try {
        await service.changeAvatar(userWithoutAvatar, newAvatarUrl);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.getStatus()).toBe(200);
      }

      expect(mockCloudinaryService.deleteImageByUrl).not.toHaveBeenCalled();
    });
  });

  describe('refreshToken', () => {
    const mockRefreshToken = 'valid_refresh_token';
    const mockPayload = {
      id: 1,
      username: 'test',
      email: 'test@test.com',
      role: 'user',
      phone: '1234567890',
    };

    it('should refresh token successfully', async () => {
      mockJwtService.verifyAsync.mockResolvedValue(mockPayload);
      mockPrismaService.users.findFirst.mockResolvedValue({
        ...mockPayload,
        refresh_token: mockRefreshToken,
      });
      mockJwtService.sign.mockReturnValue('new_access_token');

      mockConfigService.get.mockImplementation((key) => {
        const config = {
          REFRESH_SECRET_JWT: 'refresh_secret',
          ACCESS_SECRET_JWT: 'access_secret',
          EXP_IN_ACCESS_TOKEN: '15m',
        };
        return config[key];
      });

      try {
        await service.refreshToken(mockRefreshToken);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.getStatus()).toBe(200);
        expect(error.getResponse()).toEqual({
          message: 'Làm mới token thành công',
          access_token: 'new_access_token',
        });
      }
    });

    it('should throw UnauthorizedException if refresh token is missing', async () => {
      await expect(service.refreshToken('')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException if token verification fails', async () => {
      mockJwtService.verifyAsync.mockRejectedValue(new Error());
      await expect(service.refreshToken(mockRefreshToken)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException if user not found', async () => {
      mockJwtService.verifyAsync.mockResolvedValue(mockPayload);
      mockPrismaService.users.findFirst.mockResolvedValue(null);
      await expect(service.refreshToken(mockRefreshToken)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('sendEmailVerify', () => {
    const mockEmail = 'test@gmail.com';
    it('should send verification email successfully', async () => {
      const mockUser = {
        id: 1,
        username: 'test',
        email: mockEmail,
        password: 'password123',
        phone: '1234567890',
        memberships: null,
        branch_id: null, // or any other required fields
        platform: 'email',
        avatar: 'old-avatar-url',
        active: true,
        verify_at: null,
        role: 'user',
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockPrismaService.users.findFirst.mockResolvedValue(mockUser);
      mockPrismaService.verify_tokens.create.mockResolvedValue({
        id: 1,
        email: mockEmail,
        token: 'random-token',
        expired_at: new Date(),
      });

      await service.sendEmailVerify(mockEmail);

      expect(mockPrismaService.verify_tokens.create).toHaveBeenCalled();
      expect(mockMailService.confirmRegister).toHaveBeenCalled();
    });

    it('should throw BadRequestException if email does not exist', async () => {
      mockPrismaService.users.findFirst.mockResolvedValue(null);
      await expect(service.sendEmailVerify(mockEmail)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException if email is already verified', async () => {
      const mockUser = {
        id: 1,
        username: 'test',
        email: 'test@gmail.com',
        password: 'password123',
        phone: '1234567890',
        memberships: null,
        branch_id: null, // or any other required fields
        platform: 'email',
        avatar: 'old-avatar-url',
        active: true,
        verify_at: null,
        role: 'user',
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockPrismaService.users.findFirst.mockResolvedValue(mockUser);
      await expect(service.sendEmailVerify(mockEmail)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('verifyToken', () => {
    const mockEmail = 'test@test.com';
    const mockToken = 'valid-token';

    it('should verify token successfully', async () => {
      const mockVerifyToken = {
        id: 1,
        email: mockEmail,
        token: mockToken,
        expired_at: new Date(Date.now() + 1000 * 60 * 15), // 15 minutes in the future
      };

      mockPrismaService.verify_tokens.findFirst.mockResolvedValue(
        mockVerifyToken,
      );
      mockPrismaService.users.update.mockResolvedValue({
        email: mockEmail,
        verify_at: new Date(),
      });
      mockPrismaService.verify_tokens.delete.mockResolvedValue(mockVerifyToken);

      try {
        await service.verifyToken(mockEmail, mockToken);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.getStatus()).toBe(200);
        expect(error.getMessage()).toBe('Xác thực thành công');
      }

      expect(mockPrismaService.users.update).toHaveBeenCalledWith({
        where: { email: mockEmail },
        data: { verify_at: expect.any(Date) },
      });

      expect(mockPrismaService.verify_tokens.delete).toHaveBeenCalledWith({
        where: { id: mockVerifyToken.id },
      });
    });

    it('should throw BadRequestException if token not found', async () => {
      mockPrismaService.verify_tokens.findFirst.mockResolvedValue(null);

      await expect(service.verifyToken(mockEmail, mockToken)).rejects.toThrow(
        new BadRequestException('Token không hợp lệ hoặc email không đúng'),
      );
    });

    it('should throw BadRequestException if token is expired', async () => {
      const mockExpiredToken = {
        id: 1,
        email: mockEmail,
        token: mockToken,
        expired_at: new Date(Date.now() - 1000 * 60), // 1 minute in the past
      };

      mockPrismaService.verify_tokens.findFirst.mockResolvedValue(
        mockExpiredToken,
      );
      mockPrismaService.verify_tokens.delete.mockResolvedValue(
        mockExpiredToken,
      );

      await expect(service.verifyToken(mockEmail, mockToken)).rejects.toThrow(
        new BadRequestException('Token đã hết hạn'),
      );

      expect(mockPrismaService.verify_tokens.delete).toHaveBeenCalledWith({
        where: { id: mockExpiredToken.id },
      });
    });

    it('should handle database errors gracefully', async () => {
      mockPrismaService.verify_tokens.findFirst.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(service.verifyToken(mockEmail, mockToken)).rejects.toThrow(
        expect.objectContaining({
          message: 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        }),
      );
    });
  });

  // Test cases for generateToken
  describe('generateToken', () => {
    const mockUser = {
      id: 1,
      username: 'test',
      email: 'test@gmail.com',
      password: 'password123',
      phone: '1234567890',
      memberships: null,
      branch_id: null,
      platform: 'email',
      avatar: 'old-avatar-url',
      active: true,
      verify_at: null,
      role: 'user',
      created_at: new Date(),
      updated_at: new Date(),
    };

    it('should generate access and refresh tokens successfully', async () => {
      const mockTokens = {
        access_token: 'mock_access_token',
        refresh_token: 'mock_refresh_token',
      };

      mockJwtService.sign.mockImplementation(() => 'mock_token');
      mockConfigService.get.mockImplementation((key) => {
        const config = {
          ACCESS_SECRET_JWT: 'access_secret',
          REFRESH_SECRET_JWT: 'refresh_secret',
          EXP_IN_ACCESS_TOKEN: '15m',
          EXP_IN_REFRESH_TOKEN: '7d',
        };
        return config[key];
      });

      mockPrismaService.users.update.mockResolvedValue({
        ...mockUser,
        refresh_token: mockTokens.refresh_token,
      });

      const result = await service.generateToken(mockUser);

      expect(result).toHaveProperty('access_token');
      expect(result).toHaveProperty('refresh_token');
      expect(mockPrismaService.users.update).toHaveBeenCalledWith({
        where: { id: mockUser.id },
        data: { refresh_token: expect.any(String) },
      });
    });

    it('should handle token generation failure', async () => {
      mockJwtService.sign.mockImplementation(() => {
        throw new Error('Token generation failed');
      });

      await expect(service.generateToken(mockUser)).rejects.toThrow();
    });
  });

  // Test cases for hashedPassword
  describe('hashedPassword', () => {
    const password = 'test_password';

    it('should hash password successfully', () => {
      const hashedPassword = service.hashedPassword(password);
      expect(hashedPassword).toBeDefined();
      expect(typeof hashedPassword).toBe('string');
      expect(hashedPassword).not.toBe(password);
    });

    it('should generate different hashes for same password', () => {
      const hash1 = service.hashedPassword(password);
      const hash2 = service.hashedPassword(password);
      expect(hash1).not.toBe(hash2);
    });

    it('should generate hash with correct bcrypt format', () => {
      const hashedPassword = service.hashedPassword(password);
      expect(hashedPassword).toMatch(/^\$2[aby]\$\d{2}\$.{53}$/);
    });
  });
});
