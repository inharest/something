var me = function(selector, context){
  context = context || document;
  return context.querySelectorAll(selector);
};
