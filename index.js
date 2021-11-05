var postcss = require('postcss');
var assign = require('object-assign');

module.exports = function (options = {}) {
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

  /**
   * 检测当前 decl 是否含行内注释转换
   * @param {process.Declaration} decl
   */
  function checkDeclTransform(decl) {
    return (decl.next() && decl.next().type === 'comment' && decl.next().text === 'units-transform') || false;
  }
  let hasGlobalMembers;
  return {
    postcssPlugin: 'postcss-units-transform',
    Comment(comment) {
      // 根节点的注释 units-transform
      if (comment.parent.type === 'root') {
        const reg = /units\-transform(?:\:([-,\w]+))?/;
        const specs = comment.text.match(reg);
        if (specs) {
          if (specs[1]) {
            hasGlobalMembers = specs[1].split(',');
          } else {
            hasGlobalMembers = '*';
          }
        }
      }
    },
    Declaration(decl) {
      if (decl && decl.next() && decl.next().type === 'comment' && decl.next().text === opts.comment) {
        decl.next().remove();
      } else {
        // 存在行内注释
        if (checkDeclTransform(decl)) {
          decl.value = replacePx(decl.value);
        } else if (hasGlobalMembers) {
          if (hasGlobalMembers === '*' || (Array.isArray(hasGlobalMembers) && hasGlobalMembers.includes(decl.prop))) {
            decl.value = replacePx(decl.value);
          }
        } else if (
          opts.declMembers === '*' ||
          (Array.isArray(opts.declMembers) && opts.declMembers.includes(decl.prop))
        ) {
          decl.value = replacePx(decl.value);
        }
      }
    },
  };
};

module.exports.postcss = true;
