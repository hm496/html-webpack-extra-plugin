module.exports = class htmlWebpackExtraPlugin {
  apply(compiler) {
    const ID = 'htmlWebpackExtraPlugin';

    compiler.hooks.compilation.tap(ID, compilation => {
      if (compilation.hooks.htmlWebpackPluginBeforeHtmlGeneration) {
        compilation.hooks.htmlWebpackPluginAlterAssetTags.tap(ID, (htmlPluginData) => {
          const oldPublicPath = compilation.options.output.publicPath;
          let newPublicPath = htmlPluginData.plugin.options.publicPath;
          if (typeof newPublicPath !== 'string' || typeof oldPublicPath !== 'string') {
            return;
          }

          newPublicPath = newPublicPath.replace(/([^/])$/, '$1/');

          htmlPluginData.head = htmlPluginData.head.map(tag => {
            return changeTagAttr(tag, oldPublicPath, newPublicPath);
          });

          htmlPluginData.body = htmlPluginData.body.map(tag => {
            return changeTagAttr(tag, oldPublicPath, newPublicPath);
          });
        });
      } else {
        throw new Error('html-webpack-extra-plugin can only work with html-webpack-plugin 3.x.x');
      }
    });

    function changeTagAttr(tag, oldPublicPath, newPublicPath) {
      if (tag.tagName === 'link') {
        tag.attributes.href = tag.attributes.href.replace(new RegExp('^' + oldPublicPath), newPublicPath);
      } else if (tag.tagName === 'script') {
        tag.attributes.src = tag.attributes.src.replace(new RegExp('^' + oldPublicPath), newPublicPath);
      }
      return tag;
    }
  }
};
