# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Angular 17 frontend (standalone components, SSR + prerendering) for a personal portfolio site, production at `https://marwankw.com`. Pages so far: the public site in `home/` (a top-bar layout with pages About `/`, Experience `/experience` and Certificates `/certificates` (both paginated: `GET /api/experiences|certificates?page=&size=`), Skills `/skills` (a plain list from `GET /api/skills`, already sorted by category and grouped under category headings in the browser), Contact `/contact` (form → public `POST /api/contact`), Courses `/courses` and course detail `/courses/:id`, using the public `GET /api/about`, `GET /api/courses` and `GET /api/courses/{id}`. Public list styles are the global `.entry-list` in `styles.css`. Data loads in the browser, because the site is hosted on Netlify and prerendered data would go stale), `/login`, and an admin area at `/admin` (sidebar layout) with six sections: About (one record edited with `GET`/`PUT /api/admin/about`; a 404 means nothing is saved yet, so it shows an empty form) Experience, Skills, Certificates and Courses (list and delete on the page; add and edit in a pop-up), and Messages (contact messages: open in a pop-up, which marks them read via `PUT /{id}/read`, or delete; no add or edit, so it uses the shared pieces directly instead of `app-crud-page`). The sidebar shows the unread count from `GET /api/admin/contact-messages/total-unread`, kept in the `unread` signal on `ContactMessageService` and refreshed when the admin opens and after a message is opened or deleted. Audit (`admin/audit/`) is a read-only table of how often each public endpoint was called, from `GET /api/admin/stats` (the backend counts public API calls only). Shared colours and base styles live in `src/styles.css`. The public site uses the warm neutral tokens on `:root`, and the admin area and login keep the original light pink via the `.theme-pink` class, which redefines the same tokens. Don't change the admin colours when restyling the public site. and the API URL is in `src/environments/environment.ts` (production, `https://api.marwankw.com`) and `environment.development.ts` (`ng serve`, `http://localhost:8080`), swapped via `fileReplacements` in `angular.json`.

The backend is a separate Spring Boot 4.1 / Java 21 repo at `~/Desktop/portfolio ` — **the directory name has a trailing space**, so quote the path in shell commands. That repo has its own `CLAUDE.md` with the details.

## Preferences

Keep everything as simple as possible. Build only what is asked for: no extra copy, helper text, features, or decoration.

## Commands

```bash
npm start                    # ng serve, dev server on http://localhost:4200
npm run build                # production build into dist/portfolio-ui/{browser,server}
npm run watch                # development build in watch mode
npm run serve:ssr:portfolio-ui   # run the built SSR Express server (PORT env, default 4000)
npm test                     # Karma + Jasmine (Chrome), watches by default
npx ng test --watch=false    # single run
```

To run a single spec or test, focus it with `fdescribe`/`fit` (Karma has no CLI filter here), or use `npx ng test --include=src/app/path/to/file.spec.ts`.

No linter is configured (no ESLint in `angular.json`). Formatting follows `.editorconfig`: 2-space indentation and single quotes in `.ts` files.

## Architecture

- **Bootstrapping**: no NgModules. `src/main.ts` bootstraps `AppComponent` with `appConfig` (`app.config.ts`). `src/main.server.ts` bootstraps it with `app.config.server.ts`, which merges `appConfig` with `provideServerRendering()`. App-wide providers such as `provideHttpClient()` go in `app.config.ts` so both the browser and the server get them.
- **SSR**: `server.ts` at the repo root is an Express server that serves static files from `dist/.../browser` and renders every other route through Angular's `CommonEngine`. `angular.json` has `prerender: true`, so routes are also prerendered at build time. `provideClientHydration()` is on. Code that touches `window`, `document`, or `localStorage` must be guarded with `isPlatformBrowser` or `afterNextRender`, because it also runs in Node.
- **Build budgets** (production): 500kb warning / 1mb error for the initial bundle, and **2kb warning / 4kb error per component stylesheet**. Put large styles in `src/styles.css` rather than component CSS.

## Admin sections

- `admin/admin-layout/` is the sidebar and `<router-outlet>`. Its `sections` array drives the sidebar links.
- To add a list section (e.g. projects), copy `admin/experiences/`: a model, a service that `extends CrudService<T, TRequest>` with `super('<resource>', '<sort>')`, a `*-fields.ts` with the form's `CrudField`s and the table's `CrudColumn`s, and a tiny list component whose template is just `<app-crud-page>`. `app-crud-page` does the table, paging, delete, and the add/edit pop-up (`app-modal` + `app-crud-form`). With `[reorderable]="true"` it adds drag-and-drop rows (Angular CDK `@angular/cdk/drag-drop`, plus arrow keys on the handle) that save via `PUT /api/admin/<resource>/reorder` with `[{ id, position }]` (positions continue across pages: page × size + index); `[groupBy]` limits moves to one group (skills by category). Admin lists sort by `displayOrder` like the public site.
- Reuse the shared building blocks in `src/app/shared/`: `CrudService` (calls `/api/admin/<resource>`, typed `Page<T>` for lists), `app-form-field` (label, projected input, error), `app-page-header` (title plus projected buttons), `app-pager`, `app-crud-page`, `app-crud-form` (field types include `date` and `number`; empty ones are sent as `null`, and numbers as numbers; fields can set `required`, `maxLength` and `placeholder`, and `email` fields are format-checked; `image` fields show a preview and a file picker, read the file as a base64 data URI, and send it as `<name>Base64` next to the current URL in `<name>`, which the backend uploads to Cloudinary, keeping the current image when no new one is sent), and `app-modal` (native `<dialog>`: show it with `@if` and it opens itself; Esc emits `closed`). Their styles, and those for tables, buttons and inputs, live in `src/styles.css`, not in component CSS.
- `auth.interceptor.ts` adds the Bearer token to every request and sends you to `/login` on a 401. `auth.guard.ts` protects `/admin`.
- Load data in `ngOnInit` behind `isPlatformBrowser`, because the server has no token. Don't use `afterNextRender` for fetching: in Angular 17 it runs outside the zone, so the view never updates.

## Backend integration

- The API runs on `http://localhost:8080` locally (Spring Boot default), with a PostgreSQL database. Start it with `./mvnw spring-boot:run` from the backend repo. This needs JDK 21: the default shell JDK on this machine is Java 8, so point `JAVA_HOME` at a JDK 21 first.
- CORS on the backend allows only `https://marwankw.com` and `http://localhost:4200`. Serving the UI from another origin (for example the SSR server on :4000) needs a change to the backend's `CorsConfig`.
- **Auth**: there is one admin account and no user table. `POST /api/auth/login` with `{ email, password }` returns the JWT as a **raw string, not JSON**, so call it with `responseType: 'text'` in `HttpClient`. Send the token as `Authorization: Bearer <token>`. It expires after 1 hour. Local dev credentials are in the backend's `application-local.yaml`.
- **Access rules**: every `GET` is public. Every other method (POST, PUT, DELETE) requires the JWT, except login.
- The only backend entity so far is `Course` (`id`, `title`, `description`), and it has no REST endpoints yet.
