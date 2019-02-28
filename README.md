# Elrond SPA
Elrond SPA 是为了微服务界面集成而设计的单页应用管理器  
支持各个子应用选择不同JS框架开发。支持React、Angular、Vue.js、Svelte、Preact等前端框架，也支持原生JS。  
Elrond SPA修改自Single SPA 3.7.0，相较于Single SPA，Elrond SPA  
- 调整工程化配置，使用webpack，不使用jspm及rollup
- 在初始化后仍然允许添加子应用。

难点：单页应用管理器可以管理不同的JS框架  
解决方案：为不同的JS框架写适配器，让Elrond可以得到子应用JS实例，并在需要卸载子应用时去调用子应用JS实例上的销毁方法去移除相关DOM对象及绑定的事件。
这个适配不同框架的工作需要对各JS框架的运行机制、生命周期有深入的了解。  

### 基于Elrond的微服务的界面集成示例工程  
http://repo.slimcloud.io:5002/slimcloud/microservices-portal-js  
- 用代码示例了React、Angular、Vue.js、原生JS实现的4个子应用
- 用代码示例了后端子应用注册、子应用健康检查功能
- 用代码示例了前端子应用之间的消息通讯

### 示例
1. 创建一个html文件
```html
<html>
<body>
	<script src="elrond-spa-config.js"></script>
</body>
</html>
```

2. 创建 elrond-spa-config，将子应用注册到 elrond SPA，并初始化 elrondSpa，
```js
// elrond-spa-config.js
import * as elrondSpa from 'elrond-spa';

const appName = 'app1';

/* The loading function is a function that returns a promise that resolves with the javascript application module.
 * The purpose of it is to facilitate lazy loading -- elrond-spa will not download the code for a application until it needs to.
 * In this example, import() is supported in webpack and returns a Promise, but elrond-spa works with any loading function that returns a Promise.
 */
const loadingFunction = () => import('./app1/app1.js');

/* Elrond-spa does some top-level routing to determine which application is active for any url. You can implement this routing any way you'd like.
 * One useful convention might be to prefix the url with the name of the app that is active, to keep your top-level routing simple.
 */
const activityFunction = location => location.pathname.startsWith('/app1');

elrondSpa.registerApplication(appName, loadingFunction, activityFunction);
elrondSpa.start();
```
3. 实现子应用。子应用应该实现 bootstrap mount unmount 三个生命周期方法。
```js
//app1.js

let domEl;

export function bootstrap(props) {
	return Promise
		.resolve()
		.then(() => {
			domEl = document.createElement('div');
			domEl.id = 'app1';
			document.body.appendChild(domEl);
		});
}

export function mount(props) {
	return Promise
		.resolve()
		.then(() => {
			// This is where you would normally use a framework to mount some ui to the dom. See https://github.com/zvingsoft/elrond-spa/blob/master/docs/elrond-spa-ecosystem.md.
			domEl.textContent = 'App 1 is mounted!'
		});
}

export function unmount(props) {
	return Promise
		.resolve()
		.then(() => {
			// This is normally where you would tell the framework to unmount the ui from the dom. See https://github.com/zvingsoft/elrond-spa/blob/master/docs/elrond-spa-ecosystem.md
			domEl.textContent = '';
		})
}
```
