# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

## Project setup

```bash
# Prerequisites
$ install Nodejs #Recommend version 16 or newer (Currently tested v18.20.5)
```

```bash
$ npm install
```

```bash
# Copy env
# On Linux/macOS:
$ cp .env.example .env

# On Window:
$ copy .env.example .env
```

```bash
# Run project on dev
$ npm run dev
```

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
