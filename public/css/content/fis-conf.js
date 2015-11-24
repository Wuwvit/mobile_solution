// default settings. fis3 release

// Global start


fis.match('a.css', {
  optimizer: fis.plugin('clean-css'),
  release:"../../../../weixin/Public/css/content/$0"
});

