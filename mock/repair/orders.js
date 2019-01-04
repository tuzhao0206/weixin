// https://github.com/Marak/faker.js/wiki
const faker = require('faker');

let list = [];
for (let i = 0; i < 20; i++) {
  list.push({
    id: faker.random.number(),
    name: faker.name.jobArea(),
  });
}

module.exports = {
  code: 0,
  data: { list },
};
