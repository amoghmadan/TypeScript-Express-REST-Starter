/** @type {import('jest')}.Config */
const config = {
  transform: {
    "^.+\\.[t|j]sx?$": "ts-jest",
  },
  verbose: true,
};

module.exports = config;
