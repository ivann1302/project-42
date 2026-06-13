# План: статический деплой Project 42 на Sprinthost через GitHub CI/CD

## Summary

Project 42 подходит для `static export`: это SEO/промо-сайт без Next API routes,
cookies/headers, server actions и серверной динамики. Формы отправляются
клиентским `fetch` на внешний/хостинговый endpoint, блог генерируется статически
через `generateStaticParams`.

Основной путь деплоя: GitHub Actions собирает SEO-friendly static export в `out/`,
загружает `out/ + server/ + package.json` по SSH и перезапускает Node22 static
server. Node нужен для отдачи готовых HTML-файлов и обработки заявок без PHP.

## Progress

- [x] Создан tracked-файл плана `PROJECT42_DEPLOY_PLAN.md`.
- [x] Подтверждено, что Project 42 подходит для `static export`.
- [x] Добавлены явные scripts `build:static` и `build:standalone`.
- [x] `next.config.ts` переключает `export`/`standalone` через `NEXT_OUTPUT`.
- [x] CI/CD workflow используют `npm run build:static`.
- [x] Добавлена локальная серверная заметка и `.gitignore` для нее.
- [x] Проверен `build:standalone` и зафиксирован риск PHP endpoint в Node-режиме.
- [x] Добавлена команда ручного архива `npm run archive:static`.
- [x] Добавлена команда ручного Node-архива `npm run archive:node`.
- [x] Прогнан полный локальный набор проверок перед финальным коммитом.
- [x] Jest настроен игнорировать `.next`, чтобы standalone-артефакты не давали
      haste collision.
- [x] PHP handler удален из `public/`, чтобы openresty не отдавал исходник как статику.
- [x] Добавлен Node static server с Telegram endpoint для Node22-сценария.
- [x] Локально проверена отправка заявки через Node endpoint без PHP.
- [x] Production workflow переключен с FTP mirror на SSH-деплой Node22 server.
- [x] Основной SEO-домен обновлен на `https://project42-studio.ru`.
- [x] Серверный `.env` перенесен в
      `/home/a1256071/domains/project42-studio.ru/project42-node/.env`.
- [x] Node static server адаптирован для запуска через Phusion Passenger.
- [x] Production workflow генерирует `.htaccess` в `public_html` и дергает
      `tmp/restart.txt` для Passenger.
- [ ] Проверить production-деплой и форму после GitHub Actions.

## Key Changes

- Обновить `next.config.ts`, чтобы режимы были явными:
  - `NEXT_OUTPUT=export` или дефолтный режим: `output: 'export'`,
    `images.unoptimized: true`.
  - `NEXT_OUTPUT=standalone`: `output: 'standalone'`, без `images.unoptimized`
    как обязательного правила.
- Обновить `package.json` scripts:
  - `build:static`: сборка static export через `NEXT_OUTPUT=export next build`.
  - `build:standalone`: сборка standalone через `NEXT_OUTPUT=standalone next build`.
  - `archive:static`: создать `project42-static-public-html-YYYY-MM-DD.tar.gz`
    из текущего `out/`.
  - `archive:node`: создать `project42-node-release-YYYY-MM-DD.tar.gz` из
    `out/`, `server/`, `package.json`.
  - `build`: оставить совместимым со static-сборкой, чтобы существующий CI/CD
    не ломался, или перевести CI на `build:static`.
- Обновить `.github/workflows/ci.yml` и `.github/workflows/deploy.yml`:
  - использовать Node.js 22, как сейчас;
  - запускать `npm ci`, `lint`, `lint:css`, `typecheck`, `test`;
  - собирать `npm run build:static`;
  - проверять наличие `out/index.html`, `out/sitemap.xml` и Node server-файлов;
  - паковать `out/`, `server/`, `package.json`;
  - загружать релиз по SSH в `NODE_APP_DIR/releases`;
  - переключать symlink `NODE_APP_DIR/current`;
  - создавать `.htaccess` в `public_html` для Phusion Passenger;
  - дергать `tmp/restart.txt` в текущем релизе для перезапуска Passenger;
  - сохранять локальный `pm2`/`nohup` запуск как диагностический health-check
    на `127.0.0.1:$NODE_APP_PORT`.
- Добавить локальную заметку `PROJECT42_SERVER_TECH_NOTES.local.md`:
  - описать, что production-схема для Project 42: static export, который отдает
    Node22 static server;
  - указать, что `.env` остается на сервере в `NODE_APP_DIR/.env`;
  - описать SSH-релизы, symlink `current`, `pm2`/`nohup` restart и Node endpoint
    для заявок.
- Зафиксировать отличие Node static server от Next standalone:
  - основной Node22-сценарий отдает готовый `out/`, сохраняя SEO-friendly HTML;
  - текущий путь формы `/scripts/api/send.php` перехватывается Node endpoint;
  - Next standalone остается fallback-проверкой, но не production-схемой.
- Обновить `.gitignore`:
  - добавить `PROJECT42_SERVER_TECH_NOTES.local.md`;
  - добавить архивы вида `project42-static-public-html-*.tar.gz`, если будет
    нужен ручной пакет.

## Public Interfaces

- Новые npm scripts:
  - `npm run build:static`
  - `npm run build:standalone`
  - `npm run archive:static`
  - `npm run archive:node`
  - `npm run start:static-node`
- GitHub Secrets/Variables для Node22-деплоя:
  - `SSH_PRIVATE_KEY`: обязательно Secret, private key для SSH-доступа.
  - `SSH_HOST`: Secret или Variable, SSH host Sprinthost.
  - `SSH_USER`: Secret или Variable, SSH user.
  - `NODE_APP_DIR`: Secret или Variable, директория приложения на сервере, где уже лежит `.env`
    (`/home/a1256071/domains/project42-studio.ru/project42-node`).
  - `PUBLIC_HTML_DIR`: Secret или Variable, опционально, по умолчанию соседняя
    директория `public_html` рядом с `NODE_APP_DIR`.
  - `SSH_PORT`: Secret или Variable, опционально, по умолчанию `22`.
  - `NODE_APP_NAME`: Secret или Variable, опционально, по умолчанию `project42`.
  - `NODE_APP_PORT`: Secret или Variable, опционально, по умолчанию `3000`.
  - `APP_URL`: Secret или Variable, опционально, внешний health check.
- Для форм сохранить текущий контракт:
  - `NEXT_PUBLIC_CONTACT_ENDPOINT`, если задан;
  - fallback `/scripts/api/send.php`.

## Test Plan

- Локально/в CI выполнить:
  - [x] `npm run lint`
  - [x] `npm run lint:css`
  - [x] `npm run typecheck`
  - [x] `npm test -- --runInBand`
  - [x] `npm run build:static`
- Проверить static export:
  - существует `out/index.html`;
  - существует `out/sitemap.xml`;
  - существуют страницы `/blog`, `/blog/[slug]`, `/portfolio`, `/offer`,
    `/privacy-policy`, `/thank-you`.
- После деплоя GitHub Actions:
  - local health check на сервере через `http://127.0.0.1:$NODE_APP_PORT/`;
  - внешний health check через `APP_URL`, если secret задан;
  - ручная проверка `https://project42-studio.ru`;
  - проверить отправку формы на production endpoint.

Проверка заявок 2026-06-13:

- Раньше PHP handler лежал в `public/scripts/api/send.php`, но внешний openresty
  отдал его исходник как статический файл. PHP handler удален, production-заявки
  должны идти через Node endpoint.
- Ранее `https://project-42.ru` из текущей среды обрывался на TLS.
- Ранее `http://project-42.ru` отвечал `nginx` parking-страницей REG.RU:
  срок регистрации домена истек. Основной домен сменен на `project42-studio.ru`.
- Ранее POST на `http://project-42.ru/scripts/api/send.php` вернул 404
  parking-страницы, то есть запрос не дошел ни до PHP handler, ни до Node app.

Node-схема:

- `server/static-server.mjs` обслуживает `out/` без зависимостей.
- `server/contact-handler.mjs` отправляет заявки в Telegram через Node `fetch`.
- Node endpoint совместим со старым путем `/scripts/api/send.php`, а также
  принимает `/scripts/api/send` и `/api/send`.
- Локальная проверка Node-схемы: `/`, `/blog` и `/_next/static/...` вернули `200`,
  POST на `/scripts/api/send.php` вернул `200 {"ok":true}`.
- На Sprinthost Node22-сценарий:
  GitHub Actions собирает и загружает релиз, затем создает `.htaccess` для
  Passenger в `public_html`. Для внутренней проверки дополнительно запускается
  `HOSTNAME=127.0.0.1 PORT=$NODE_APP_PORT NODE_ENV=production node22 server/static-server.mjs`.

Примечание: после проверки standalone-сборки Jest был настроен игнорировать
`.next`, чтобы `.next/standalone/package.json` не конфликтовал с корневым
`package.json`.

## Assumptions

- Основной production-хостинг для сайта: Sprinthost shared hosting, не VPS.
- Для Project 42 предпочтителен static export ради надежности и SEO.
- Домен должен запускать Node22-приложение через Sprinthost Phusion Passenger и
  `.htaccess` в `public_html`.
- `.env` хранится на сервере в
  `/home/a1256071/domains/project42-studio.ru/project42-node/.env`; GitHub
  Actions его не заливает.
- Workflow явно падает с понятной ошибкой, если `SSH_HOST`, `SSH_PRIVATE_KEY`,
  `SSH_USER` или `NODE_APP_DIR` не заведены в GitHub Actions.
- Production deploy идет через SSH workflow, не через FTP mirror.
- Существующие незакоммиченные изменения в блоге, sitemap, header/footer и стилях
  не откатывать и не перетирать.
