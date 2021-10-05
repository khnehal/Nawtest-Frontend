const randomString = require("randomstring");
const faker = require("faker");
const dayjs = require("dayjs");

const randomBool = (probability = 2) =>
  Math.ceil(Math.random() * probability) === 1;

const generatePayment = (date) => ({
  paymentAmount: faker.finance.amount(),
  paymentCurrency: "GBP",
  paymentType: randomBool() ? "CHAPS" : "FASTER",
  paymentDate: date.format("DD-MMM-YYYY"),
  paymentStatus: randomBool(3) ? "C" : randomBool(2) ? "P" : "A",
  toAccaunt: {
    accountName: faker.finance.accountName(),
    sortCode: randomString.generate({ length: 6, charset: "numeric" }),
    accountNumber: randomString.generate({ length: 8, charset: "numeric" }),
  },
  fromAccount: {
    accountName: faker.finance.accountName(),
    sortCode: randomString.generate({ length: 6, charset: "numeric" }),
    accountNumber: randomString.generate({ length: 8, charset: "numeric" }),
  },
});

const generatePayments = (amount) => {
  let payments = new Array(amount);
  let date = dayjs();
  for (let i = 0; i < amount; i++) {
    payments[i] = generatePayment(date);

    if (randomBool(6)) {
      date = date.add(1, "day");
    }
  }

  return payments;
};

module.exports = generatePayments;
