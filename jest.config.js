module.exports = {
    'preset': 'ts-jest',
    'clearMocks': true,
    'coverageDirectory': 'coverage',
    'coverageProvider': 'v8',
    'testEnvironment': 'node',
    'testMatch': [
        './**/*.test.[jt]s',
    ],
    'coverageReporters': [
        'text',
        'html',
        'cobertura'
    ]
}
