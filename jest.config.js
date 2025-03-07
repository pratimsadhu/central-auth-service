module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	moduleFileExtensions: ['ts', 'js'],
	transform: {
		'^.+\\.ts$': 'ts-jest',
	},
	setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
	testMatch: ['**/tests/**/*.test.ts'],
	collectCoverage: true,
	collectCoverageFrom: ['src/**/*.ts'],
	coverageDirectory: 'coverage',
	verbose: true,
	modulePathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/dist/'],
};
