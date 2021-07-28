postcss-units-transform

[![Build Status](https://travis-ci.org/noyobo/postcss-units-transform.svg?branch=master)](https://travis-ci.org/noyobo/postcss-units-transform)
[![npm version](https://badge.fury.io/js/postcss-units-transform.svg)](https://badge.fury.io/js/postcss-units-transform)
[![change-log](https://img.shields.io/badge/changelog-md-blue.svg)](https://github.com/noyobo/postcss-units-transform/blob/master/CHANGELOG.md)

CSS 任意单位之间的互相转换的 [PostCSS](https://github.com/ai/postcss)插件。

## Install

```
$ npm install postcss-units-transform --save-dev
```

## Usage

### Input/Output

如果使用 默认的 opts，将会得到如下的输出。

```css
/* input */
p {
  margin: 0 0 20px;
  font-size: 32px;
  line-height: 1.2;
  letter-spacing: 1px; /* no */
}

/* output */
p {
  margin: 0 0 20rpx;
  font-size: 32rpx;
  line-height: 1.2;
  letter-spacing: 1px;
}
```

### Example

```js
var fs = require('fs');
var postcss = require('postcss');
var pxtorem = require('postcss-pxtorem');
var css = fs.readFileSync('main.css', 'utf8');
var options = {
  replace: false,
};
var processedCss = postcss(pxtorem(options)).process(css).css;

fs.writeFile('main-rem.css', processedCss, function (err) {
  if (err) {
    throw err;
  }
  console.log('Rem file written.');
});
```

### options

Type: Object | Null

Default:

```js
{
  divisor: 1,
  multiple: 1,
  decimalPlaces: 2,
  comment: 'no',
  targetUnits: 'rpx',
  sourceUnits: 'px',
  declMembers: '*'
}
```

Detail:

- divisor(Number): 除数，转换后的值 等于 pixel / divisor
- multiple(Number): 倍数，转换后的值 等于 pixel \* multiple
- decimalPlaces(Number): 小数点后保留的位数，例如, `width: 100px` 中的 100，将会被转换成 `Number(100 / divisor * multiple).toFixed(decimalPlaces)`
- comment(String): 不转换 px 单位的注释，默认为 `/*no*/`。如果设置 comment 的值为 'not replace', `width: 100px; /* not replace */` 中的 100px 将不会被转换为 rpx。
- sourceUnits(String): 需要转换的单位，默认值为 `px`
- targetUnits(String): 转换单位，默认值为 `rpx`，如果设置其值为 `rem`，px 将会被转换为 rem。
- declMembers(String[]): 可转换的属性成员名单。

### Use with gulp-postcss

```js
var gulp = require('gulp');
var postcss = require('gulp-postcss');
var postcssUnitsTransform = require('postcss-units-transform');

gulp.task('css', function () {
  return gulp
    .src('./**/*.css')
    .pipe(postcss([postcssUnitsTransform()]))
    .pipe(gulp.dest('./dist/css'));
});
```
