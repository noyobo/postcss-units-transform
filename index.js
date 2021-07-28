var postcss = require('postcss');
var assign = require('object-assign');

module.exports = postcss.plugin('postcss-units-transform', function (options = {}) {
  opts = assign(
    {
      divisor: 1, // 被除数
      multiple: 1, // 倍数
      decimalPlaces: 2, // 小数点位数
      sourceUnits: 'px',
      targetUnits: 'rpx',
      comment: 'no',
      declMembers: '*',
    },
    options
  );

  function replacePx(value) {
    if (!value) {
      return value;
    }
    const sourceReg = new RegExp(`\\b(\\d+(\\.\\d+)?)${opts.sourceUnits}\\b`, 'gi');

    return value.replace(sourceReg, function (_, x) {
      var size = (x * opts.multiple) / opts.divisor;
      return size % 1 === 0 ? size + opts.targetUnits : size.toFixed(opts.decimalPlaces) + opts.targetUnits;
    });
  }

  return function (root) {
    root.walkDecls(function (decl) {
      if (decl && decl.next() && decl.next().type === 'comment' && decl.next().text === opts.comment) {
        decl.next().remove();
      } else {
        if (opts.declMembers === '*' || opts.declMembers.includes(decl.prop)) {
          decl.value = replacePx(decl.value);
        }
      }
    });
  };
});
