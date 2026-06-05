# ZenPad

ZenPad is a beautiful, offline-first, dark-themed markdown notes application featuring a Sublime Text-inspired UI, code highlighting, and side-by-side editing capabilities. This app works as a web application and can also be built as a standalone desktop application using Electron.

## 🚀 Getting Started (Development)

First, install the dependencies:

```bash
npm install
```

Run the development server for the web application:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

**Run Electron Desktop App (Development Mode)**:
```bash
npm run electron:dev
```
This command starts both the Next.js development server and the Electron application concurrently.

## 📦 Building the App

### 1. Build Web Application
To build the application for the web (static HTML export):

```bash
npm run build
```
This will compile the application and output the static files into the `out/` directory. You can serve this directory using any static file server (e.g., `npx serve out`).

### 2. Build Desktop Application (Electron)
To package the app as a standalone desktop application for your operating system (creates a `.dmg` or `.exe` depending on your OS platform):

```bash
npm run electron:build
```
Once the build is complete, the executable files will be available in the `release/` directory.

## 🌐 Deploying to GitHub Pages

You can easily deploy the static web version of this application to GitHub Pages.

**Prerequisites:**
You need to have this project initialized as a Git repository and connected to your GitHub remote.

**Deployment Command:**
We've included a handy script that builds the static export and pushes it to your `gh-pages` branch.

```bash
npm run deploy:gh-pages
```

1. Run the command above. It will:
   - Build the Next.js static output in `out/`.
   - Add a `.nojekyll` file so GitHub Pages doesn't try to parse your Next.js files with Jekyll.
   - Commit and push the `out/` folder directly to the `gh-pages` branch on your current remote repository.
2. In your GitHub repository, go to **Settings > Pages**.
3. Under "Source" or "Build and deployment", select **Deploy from a branch**.
4. Choose the `gh-pages` branch and `/(root)` folder, then click **Save**.
5. Your application will be live at `https://<your-username>.github.io/<your-repo-name>`.

*Note: If you are serving the app on a subpath (like `https://<your-username>.github.io/<your-repo-name>`), you might need to adjust the Next.js `basePath` in `next.config.ts`. If you are using a custom domain or deploying to the root of a domain, the default setup works out of the box.*
