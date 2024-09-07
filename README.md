<br/>
<p align="center">
  <img src="./assets/icon.png" alt="Library Icon" width="164" height="164" />
  <h1 align="center">Diffusion Studio</h1>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Made with-Typescript-blue?color=000000&logo=typescript&logoColor=ffffff" alt="Static Badge">
  <a href="https://vitejs.dev"><img src="https://img.shields.io/badge/Powered%20by-Vite-000000?style=flat&logo=Vite&logoColor=ffffff" alt="powered by vite"></a>
  <a href="https://discord.gg/zPQJrNGuFB"><img src="https://img.shields.io/discord/1115673443141156924?style=flat&logo=discord&logoColor=fff&color=000000" alt="discord"></a>
  <a href="https://x.com/diffusionstudi0"><img src="https://img.shields.io/badge/Follow for-Updates-blue?color=000000&logo=X&logoColor=ffffff" alt="Static Badge"></a>
</p>
<br/>

# Diffusion Studio Examples

This repository contains example projects built using [Diffusion Studio](https://github.com/diffusionstudio/core). This is an ideal starting point for exploring Diffusion Studio, if you prefer learning from code examples rather than detailed documentation.

## Simple Example

This project is powered by Vite (vanilla TypeScript). To begin, navigate to the project directory:

```sh
cd simple
```

Install the required dependencies:

```sh
npm install
```

Next, start the development server:

```sh
npm run dev
```

You can now open `http://localhost:5173/` in your browser (preferably Chromium-based).

In the `/src/compositions` directory, you will find an example script that you can modify. You can comfortably load assets by placing them in the `/public` directory. For instance:

```typescript
const video = await VideoSource.from('/drone_footage_1080p_25fps.mp4');
```

> Since Vite supports hot module reloading, your composition will automatically update as you save your changes.
