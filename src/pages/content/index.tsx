function recordCustomerInput() {
  // 使用名称或ID选择器获取 Google 搜索框
  let searchInput = document.querySelector('[type="search"]') as HTMLInputElement;

  if (searchInput) {
    // 如果用户修改了搜索内容并提交，你还可以监听搜索框的变化
    searchInput.addEventListener('input', function (e: Event) {
      // 断言 e.target 的类型为 HTMLInputElement
      const target = e.target as HTMLInputElement;

      if (target.name === 'q') {
        console.log('用户修改了搜索内容为:', target.value);
      }
    });
  }
}
console.log('document init');

if (document.readyState === 'loading') {
  console.log('document loading');

  document.addEventListener('DOMContentLoaded', recordCustomerInput);
}
