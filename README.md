# React Starterify

A minimal React JS application starter kit.

## Start small, add what you need.

React Starterify aims to give you a good starting point for your projects.
If you're looking for a minimal ES6 (ES2015) React JS starter with nice [shallow rendering](https://facebook.github.io/react/docs/test-utils.html#shallow-rendering) test examples, this is probably for you.

## Why there are no Flux or Isomorphic things inside?

If you are a beginner, you probably don't want a complex structure with lots of things to care about.
If you are an advanced user, and you need more features, you can choose one of the thousand existing full-stack starter kit. Or you can build your own.

## Usage

__Install the dependencies:__

`npm install`

__Test:__

`npm test`

__Development mode with livereload:__

`npm run watch` or just `npm start`

__When you are done, create a production ready version of the JS bundle:__

`npm run build`

__Deploy on Github pages with one command:__

`npm run deploy`

## What's new in v2.0:

- React Router integration
- CSS processing via [PostCSS](https://github.com/postcss/postcss)
  - cssnano for minification
  - nested
  - extend
  - vars
  - autoprefixer
- gulpfile written in ES6 (ES2015)
- better folder structure
- no predefined AJAX libraries (use [Fetch](https://github.com/github/fetch) or [Superagent](https://github.com/visionmedia/superagent) if you need one).

## License

[MIT License](http://opensource.org/licenses/MIT)
