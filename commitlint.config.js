module.exports = {
  plugins: ['commitlint-plugin-jira-rules'],
  extends: ['jira'],
  rules: {
    'jira-task-id-max-length': [2, 'always', 8],
    'jira-task-id-min-length': [2, 'always', 5],
    'jira-task-id-project-key': [2, 'always', 'MF'],
    'jira-commit-message-separator': [2, 'always', ': '],
  },
  ignores: [(message) => message.includes('[hot]')],
};
