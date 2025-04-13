jest.mock("../db/redis", () => ({
  createClient: jest.fn(() => ({
    get: jest.fn().mockResolvedValue(null),
    set: jest.fn().mockResolvedValue("OK"),
    del: jest.fn().mockResolvedValue(1),
    hget: jest.fn().mockResolvedValue(null),
    hset: jest.fn().mockResolvedValue("OK"),
    hmset: jest.fn().mockResolvedValue("OK"),
    hgetall: jest.fn().mockResolvedValue({}),
    expire: jest.fn().mockResolvedValue(1),
    ttl: jest.fn().mockResolvedValue(300),
    exec: jest.fn().mockResolvedValue([]),
    multi: jest.fn().mockReturnThis(),
    on: jest.fn(),
    disconnect: jest.fn(),
  })),
  closeConnection: jest.fn(),
  getClient: jest.fn(),
}));

const { generateMatches } = require("./bidsController");
const BuyBids = require("../models/buyBidsModel");
const SellBids = require("../models/sellBidsModel");
const User = require("../models/userModel");
const PhoneNum = require("../models/phoneNumModel");
const MatchBids = require("../models/matchBidsModel");

jest.mock("../models/buyBidsModel", () => ({
  findAll: jest.fn(),
  destroy: jest.fn(),
}));
jest.mock("../models/sellBidsModel", () => ({
  findAll: jest.fn(),
  destroy: jest.fn(),
}));
jest.mock("../models/userModel", () => ({
  findByPk: jest.fn(),
  findAll: jest.fn(),
}));
jest.mock("../models/phoneNumModel", () => ({
  findOne: jest.fn(),
}));
jest.mock("../models/matchBidsModel", () => ({
  bulkCreate: jest.fn(),
}));
jest.mock("../utils/emailTransporter", () => ({
  sendMail: jest
    .fn()
    .mockImplementation((mailOptions, callback) => callback(null, true)),
}));
jest.mock("nodemailer");
const nodemailer = require("nodemailer");
nodemailer.createTransport.mockReturnValue({
  sendMail: jest.fn(),
});

describe("generateMatches", () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it("should create matches if there are buy bids higher than sell bids", async () => {
    // Setup mock data
    const buyBids = [
      { user_id: 1, price: 100, bidTimeStamp: new Date() },
      { user_id: 2, price: 90, bidTimeStamp: new Date() },
    ];
    const sellBids = [
      { user_id: 3, price: 80, bidTimeStamp: new Date() },
      { user_id: 4, price: 90, bidTimeStamp: new Date() },
      { user_id: 5, price: 110, bidTimeStamp: new Date() },
    ];

    // Mock implementations
    BuyBids.findAll.mockResolvedValue(buyBids);
    SellBids.findAll.mockResolvedValue(sellBids);
    User.findByPk.mockImplementation((id) =>
      Promise.resolve({
        id,
        email: `user${id}@example.com`,
        sendMatchNotifications: true,
      })
    );
    PhoneNum.findOne.mockResolvedValue(null);
    User.findAll.mockResolvedValue([]);

    // Call the function
    const matches = await generateMatches();

    const expectedMatches = [
      { buyer_id: 1, seller_id: 3, price: 90, isValid: true },
      { buyer_id: 2, seller_id: 4, price: 90, isValid: true },
    ];

    // Assertions
    expect(matches.length).toBe(expectedMatches.length);
    expect(MatchBids.bulkCreate).toHaveBeenCalled();
    expect(matches).toEqual(expectedMatches);
    expect(User.findByPk).toHaveBeenCalledTimes(2 * expectedMatches.length); // once for each user
    expect(BuyBids.destroy).toHaveBeenCalledWith({
      where: { user_id: [1, 2] },
    });
    expect(SellBids.destroy).toHaveBeenCalledWith({
      where: { user_id: [3, 4] },
    });
  });

  it("should not create matches if no buy bids", async () => {
    // Setup mock data
    const buyBids = [];
    const sellBids = [
      { user_id: 3, price: 80, bidTimeStamp: new Date() },
      { user_id: 4, price: 90, bidTimeStamp: new Date() },
      { user_id: 5, price: 110, bidTimeStamp: new Date() },
    ];

    // Mock implementations
    BuyBids.findAll.mockResolvedValue(buyBids);
    SellBids.findAll.mockResolvedValue(sellBids);
    User.findByPk.mockImplementation((id) =>
      Promise.resolve({
        id,
        email: `user${id}@example.com`,
        sendMatchNotifications: true,
      })
    );
    PhoneNum.findOne.mockResolvedValue(null);
    User.findAll.mockResolvedValue([]);

    // Call the function
    const matches = await generateMatches();

    const expectedMatches = [];

    // Assertions
    expect(matches.length).toBe(expectedMatches.length);
    expect(MatchBids.bulkCreate).toHaveBeenCalled();
    expect(matches).toEqual(expectedMatches);
    expect(User.findByPk).not.toHaveBeenCalled();
    expect(BuyBids.destroy).toHaveBeenCalledWith({
      where: { user_id: [] },
    });
    expect(SellBids.destroy).toHaveBeenCalledWith({
      where: { user_id: [] },
    });
  });

  it("should not create matches if no sell bids", async () => {
    // Setup mock data
    const buyBids = [
      { user_id: 1, price: 100, bidTimeStamp: new Date() },
      { user_id: 2, price: 90, bidTimeStamp: new Date() },
    ];
    const sellBids = [];

    // Mock implementations
    BuyBids.findAll.mockResolvedValue(buyBids);
    SellBids.findAll.mockResolvedValue(sellBids);
    User.findByPk.mockImplementation((id) =>
      Promise.resolve({
        id,
        email: `user${id}@example.com`,
        sendMatchNotifications: true,
      })
    );
    PhoneNum.findOne.mockResolvedValue(null);
    User.findAll.mockResolvedValue([]);

    // Call the function
    const matches = await generateMatches();

    const expectedMatches = [];

    // Assertions
    expect(matches.length).toBe(expectedMatches.length);
    expect(MatchBids.bulkCreate).toHaveBeenCalled();
    expect(matches).toEqual(expectedMatches);
    expect(User.findByPk).not.toHaveBeenCalled();
    expect(BuyBids.destroy).toHaveBeenCalledWith({
      where: { user_id: [] },
    });
    expect(SellBids.destroy).toHaveBeenCalledWith({
      where: { user_id: [] },
    });
  });

  it("should not create matches if no buy bids higher than sell bids", async () => {
    // Setup mock data
    const buyBids = [
      { user_id: 1, price: 79, bidTimeStamp: new Date() },
      { user_id: 2, price: 70, bidTimeStamp: new Date() },
    ];
    const sellBids = [
      { user_id: 3, price: 80, bidTimeStamp: new Date() },
      { user_id: 4, price: 90, bidTimeStamp: new Date() },
      { user_id: 5, price: 95, bidTimeStamp: new Date() },
    ];

    // Mock implementations
    BuyBids.findAll.mockResolvedValue(buyBids);
    SellBids.findAll.mockResolvedValue(sellBids);
    User.findByPk.mockImplementation((id) =>
      Promise.resolve({
        id,
        email: `user${id}@example.com`,
        sendMatchNotifications: true,
      })
    );

    PhoneNum.findOne.mockResolvedValue(null);
    User.findAll.mockResolvedValue([]);

    // Call the function
    const matches = await generateMatches();

    const expectedMatches = [];

    // Assertions
    expect(matches.length).toBe(expectedMatches.length);
    expect(MatchBids.bulkCreate).toHaveBeenCalled();
    expect(matches).toEqual(expectedMatches);
    expect(User.findByPk).not.toHaveBeenCalled();
    expect(BuyBids.destroy).toHaveBeenCalledWith({
      where: { user_id: [] },
    });
    expect(SellBids.destroy).toHaveBeenCalledWith({
      where: { user_id: [] },
    });
  });

  afterAll(async () => {
    await BuyBids.destroy({ where: {} });
    await SellBids.destroy({ where: {} });

    const redisModule = require("../db/redis");
    redisModule.closeConnection();
  });

  afterEach(() => {
    jest.restoreAllMocks();

    // Clear Redis mock statistics
    const redisModule = require("../db/redis");
    const redisClient = redisModule.getClient();
    if (redisClient) {
      Object.values(redisClient).forEach((mockFn) => {
        if (typeof mockFn === "function" && mockFn.mockClear) {
          mockFn.mockClear();
        }
      });
    }
  });
});
