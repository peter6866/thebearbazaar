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

describe("generateMatches", () => {
  beforeAll(() => {
    process.env.PGUSER = "mock_random";
    process.env.PGPASSWORD = "mock_random";
    process.env.PGDATABASE = "mock_random";
    process.env.PGHOST = "mock_random";
    process.env.JWT_SECRET = "mock_random";
    process.env.JWT_EXPIRES_IN = "90d";
    process.env.SENDGRID_API_KEY =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890ABCDEFGHIJKL";
    process.env.NODE_DEV_ENV = "development";
    process.env.ACCESS_KEY_ID = "ABCDEFGHIJKLMNOPQRST";
    process.env.SECRET_ACCESS_KEY = "abcdefghijklmnopqrstuvwxyz1234567890";
  });

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
      { buyer_id: 1, seller_id: 3, price: 90 },
      { buyer_id: 2, seller_id: 4, price: 90 },
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

    delete process.env.PGUSER;
    delete process.env.PGPASSWORD;
    delete process.env.PGDATABASE;
    delete process.env.PGHOST;
    delete process.env.JWT_SECRET;
    delete process.env.JWT_EXPIRES_IN;
    delete process.env.SENDGRID_API_KEY;
    delete process.env.NODE_DEV_ENV;
    delete process.env.ACCESS_KEY_ID;
    delete process.env.SECRET_ACCESS_KEY;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
});
