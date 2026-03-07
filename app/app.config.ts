export default defineAppConfig({
  ui: {
    colors: {
      primary: 'orange',
      neutral: 'slate'
    }
  },
  footer: {
    credits: `CubeDesigns • © ${new Date().getFullYear()}`,
    colorMode: false,
    links: [{
      'icon': 'i-simple-icons-stackoverflow',
      'to': 'https://stackoverflow.com/users/4861651/cubakos',
      'target': '_blank',
      'aria-label': 'Find me on StackOverflow'
    }, {
      'icon': 'i-simple-icons-github',
      'to': 'https://github.com/ApoGouv',
      'target': '_blank',
      'aria-label': 'Find me on GitHub'
    }]
  }
})