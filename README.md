# Storefront Angular App

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/your-username/your-storefront-repo/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Node Version](https://img.shields.io/badge/node-%3E=16.0.0-brightgreen)](https://nodejs.org/)

A modern, responsive storefront web application developed with [Angular](https://angular.io/), [Angular Material](https://material.angular.io/), [NgRx](https://ngrx.io/), [Angular Signals](https://angular.dev/reference/signals), and [RxJS](https://rxjs.dev/). This project provides a seamless shopping experience and serves as a solid foundation for scalable and customizable e-commerce platforms.

## Demo

<!-- If you have a live demo, add the link or screenshots below -->

[Live Demo](#) <!-- Replace # with your demo URL -->

## Screenshots

<!-- Add screenshots/gifs here -->

![Storefront Screenshot](assets/screenshots/screenshot1.png)

## Features

- 🛒 Product browsing and search
- 🛍️ Shopping cart and checkout flow
- 🔐 User authentication (login/register)
- 🎨 Responsive UI for desktop & mobile (Angular Material)
- ⚡ Fast and scalable architecture (NgRx, Angular Signals, RxJS)
- 🔄 Easy product management and extensibility

## Built With

- [Angular](https://angular.io/)
- [Angular Material](https://material.angular.io/)
- [NgRx](https://ngrx.io/)
- [Angular Signals](https://angular.dev/reference/signals)
- [RxJS](https://rxjs.dev/)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or later recommended)
- [Angular CLI](https://angular.io/cli) (`npm install -g @angular/cli`)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/your-storefront-repo.git
   cd your-storefront-repo
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the App

```bash
ng serve
```
Visit [http://localhost:4200](http://localhost:4200) in your browser.

## Running Tests

- **Unit tests:**
  ```bash
  ng test
  ```
- **End-to-end tests:**
  ```bash
  ng e2e
  ```

## Project Structure

This project uses a **feature-based folder structure** for scalability and maintainability. Each main feature of the app resides in its own directory under `src/app/`.

```
src/
  app/
    feature/
        cart/
          components/
          services/
          store/
          cart.module.ts
        products/
          components/
          services/
          store/
          products.module.ts
        auth/
          components/
          services/
          store/
          auth.module.ts
    shared/
      components/
      directives/
      pipes/
    core/
      services/
      interceptors/
      guards/
    app.module.ts
    app-routing.module.ts
  assets/
  environments/
  # ...other standard Angular files and folders
```

- **Feature folders** (`cart/`, `products/`, `auth/`): Contain components, services, state management (NgRx), and module files for each feature.
- **shared/**: Reusable components, pipes, and directives.
- **core/**: Singleton services, interceptors, and guards used app-wide.

## Customization

- Modify product data and categories in the backend API or mock data files (see `src/assets/mock-data/` or your backend service).
- Update UI styles in `src/styles.scss`.

## Troubleshooting

- If you encounter `Module not found` or similar errors, ensure all dependencies are installed with `npm install`.
- For port conflicts, change the port with `ng serve --port 4300`.
- For issues with the backend API, check your API server is running and accessible.

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](LICENSE)

---

> Built with ❤️ using Angular, Angular Material, NgRx, Angular Signals, and RxJS.
