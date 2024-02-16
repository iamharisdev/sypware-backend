module.exports = {
  env: {
    node: true, // To enable Node.js environment-specific rules
    es2021: true, // To enable ES2021 features
  },
  extends: 'eslint:recommended', // Use recommended eslint rules
  rules: {
    // Add any specific rules you want to enforce or disable here
    // For example:
    'no-unsafe-optional-chaining': 'off',
    // 'no-console': 'warn', // Warn if you use console.log()
    // 'no-unused-vars': 'error', // Error if you have unused variables
  },
};
