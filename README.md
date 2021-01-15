Gulp開発環境のテンプレート

## Scirpts
### `npm run dev`
ローカルサーバーの起動とファイルの監視を実行

### `npm run build`
HTML、CSS、JavaScriptのビルドを実行

### `npm run build:html`
Ejsを使用してHTMLのビルドを実行

### `npm run build:css`
Sassを使用してCSSのビルドを実行

### `npm run build:js`
Rollupを使用してJavaScriptのビルドを実行

## ディレクトリ構成
project_directory
├── gulpfile.js
├── package-lock.json
├── package.json
├── public
│   ├── assets
│   │   └── css
│   └── js
└── src
    ├── html
    │   ├── include_html
    │   │   ├── _footer.ejs
    │   │   ├── _head.ejs
    │   │   ├── _header.ejs
    │   │   └── _module.ejs
    │   └── index.ejs
    ├── js
    │   ├── index.js
    │   └── module-a.js
    └── sass
        ├── _components.scss
        ├── _foundation.scss
        ├── _layout.scss
        ├── _utilities.scss
        ├── _variable.scss
        ├── components
        ├── pages
        └── style.scss

