# Astro Shadcn UI Template

This template helps you build apps with Astro, Tailwind CSS, and Shadcn UI.

## Features

- [Astro](https://astro.build): A modern static site builder that allows you to write components using familiar web standards like HTML, CSS, and JavaScript.
- [Tailwind CSS](https://tailwindcss.com): A utility-first CSS framework that provides a set of pre-designed styling classes to rapidly build user interfaces.
- [shadcn/ui](https://ui.shadcn.com): A collection of reusable UI components for building responsive and accessible interfaces.

## Getting Started

### Development

```bash
npm install
npm run dev
```

Your site will be available at `http://localhost:4321`

### Building for Production

```bash
npm run build
```

This generates a static site in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## Deployment

This site is configured for **GitHub Pages** deployment.

### Automatic Deployment

The site automatically builds and deploys to GitHub Pages when you push to the `main` or `quantum-nest` branch. This is handled by the GitHub Actions workflow in `.github/workflows/build-and-deploy.yml`.

### Manual Deployment

To manually trigger a build and deployment:

1. Go to your GitHub repository
2. Click on the "Actions" tab
3. Select "Build and Deploy to GitHub Pages"
4. Click "Run workflow"
5. Choose your branch and click "Run workflow"

### Custom Domain

This site is configured to deploy to **thefourfamily.life**.

- **Current domain:** thefourfamily.life (HTTP)
- **SSL/HTTPS:** To be configured when SSL certificate is available
- **Deployment:** Automatic via GitHub Actions

For more details on setting up GitHub Pages with a custom domain, see [GitHub Pages Documentation](https://docs.github.com/en/pages).

## How to add components

Shadcn UI is a collection of re-usable components that can be easily integrated into your applications. It is not a component library, but rather a set of components that you can copy and paste into your projects.

To add a new component to your application, please refer to the [configuration guide](https://ui.shadcn.com/docs/installation/astro#thats-it).

> [!NOTE]
> In Astro, an [island](https://docs.astro.build/en/concepts/islands/) refers to any interactive UI component on the page. To add an interactive component like [Accordion](https://ui.shadcn.com/docs/components/accordion), [Dialog](https://ui.shadcn.com/docs/components/dialog) and more you have a couple of solutions available: [Add a Shadcn UI Component - Space Madness](https://spacemadness.dev/docs/add-a-shadcn-ui-component) or [shadcn-ui/ui#2890](https://github.com/AREA44/astro-shadcn-ui-template/issues/66).

For detailed documentation on using Shadcn UI, please visit the [full documentation](https://ui.shadcn.com/docs).

Shadcn UI is primarily built for the React framework. If you are unfamiliar with framework components in Astro, we recommend reading the [framework components guide](https://docs.astro.build/en/core-concepts/framework-components/) to get started.

Feel free to explore the various components and enhance your application with Shadcn UI!

## License

Licensed under the [MIT License](LICENSE).
