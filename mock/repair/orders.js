// https://github.com/Marak/faker.js/wiki
const faker = require('faker');

let list = [];
for (let i = 0; i < 20; i++) {
  list.push({
    waybillNumber: faker.random.number(),
    repairId: faker.random.number(),
    type: faker.random.arrayElement([0, 1]),
    date: '2018-10-08 14:34:11',
    status: faker.random.arrayElement([0, 1, 2, 3, 4, 5, 6]),
  });
}

module.exports = {
  code: 0,
  data: { list },
};
