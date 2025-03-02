/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	transform: {
		'^.+\\.tsx?$': 'ts-jest',
	},
	setupFilesAfterEnv: ['<rootDir>/src/tests/setup.ts'],
	testMatch: ['**/tests/**/*.test.ts'],
	collectCoverage: true,
	collectCoverageFrom: ['src/**/*.ts'],
	verbose: true,
	moduleNameMapper: {
		'^@utils/(.*)$': '<rootDir>/src/utils/$1',
		'^@config/(.*)$': '<rootDir>/src/config/$1',
		'^@services/(.*)$': '<rootDir>/src/services/$1',
	},
};
