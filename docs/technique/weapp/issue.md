# 小程序开发日记
::: tip
这里主要记录这段时间开发小程序过程中遇到的坑和要注意的点。主要是希望在以后开发小程序的过程中能在评审需求的时候就发现哪些能实现，哪些实现起来比较困难。这样就能在定设计和交互之前尽可能的减少后期踩坑的风险。  
  
个人非常不喜欢hack，因为这会使代码变得不优雅，后期别人接手时也会很难理解  
  
所以尽可能的了解小程序的特点，可以让我们在评审需求的阶段把一些不合理的和设计和产品沟通，尽可能的减少代码中的hack
:::  

## 下拉刷新

### 自定义的下拉刷新
微信自带的下拉刷新需要在配置中开启：  
1. 配置 `app.json` 中的 `window`或者单个页面的`json`文件  

|          属性          |  类型    | 默认值   | 描述
|-----------------------|----------|---------|------
| backgroundTextStyle   | string   | dark    | 下拉 loading 的样式，仅支持 dark / light
| enablePullDownRefresh | boolean  | false   | true 开启 false关闭

2. 页面中通过`onPullDownRefresh`方法监听下拉动作  

```javascript
  onPullDownRefresh() {
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 1000)
  }
```  
::: warning
这里有个要注意的问题：  
在`onPullDownRefresh`中不能调用`wx.startPullDownRefresh()`，否则会死循环
:::  

自定义的下拉刷新，目前只支持整个页面的下拉刷新，对于局部的下拉刷新，就没有办法了：  

<div style="width: 100%;font-size: 0;padding: 20px;background: #eee;border-radius: 3px;margin-top: 15px;display: flex;justify-content: space-around;flex-wrap: wrap;box-sizing: border-box;">
  <div>
    <p style="font-size: 14px;">局部的下拉刷新</p>
    <img :src="$withBase('/imgs/custom_refresh.jpeg')" style="width: 250px; margin: auto;display: block;" alt="foo">
  </div>
</div>  

这种我们可以使用自定义下拉刷新的方式来实现。具体方式也就不赘述了。

## 关于自定义顶部`navigationBar`  

小程序自带的`navigationBar`仅可以在`json`文件中配置。提供的可配置项也是少的可怜。主要如下：  

|                  属性         | 类型     | 默认值    | 描述
|------------------------------|----------|---------|------
| navigationBarBackgroundColor | HexColor | #000000 | 导航栏标题文字内容	
| navigationBarTextStyle       | string   | white   | 导航栏标题颜色，仅支持 black / white
| navigationBarTitleText       | string	  |         | 导航栏标题文字内容	

从上面的表格可以看出来，顶部导航栏样式固定，我们仅可以修改文字，字体颜色和背景色。  
  
不过还好小程序还提供了自定义顶部导航的配置，`window.navigationStyle`，这个配置项支持两个值`default|custom`。默认是`default`，表示的是用小程序自带的导航栏，配置为`custom`时是自定义导航栏，其实就是小程序隐藏掉导航栏，然后我们自己实现。  

但是自定义导航栏不仅带来了设计上的自由，也带来了很多坑。

### 下拉刷新

不同于`web`开发，小程序和`app`对于下拉刷新的需求非常的多，也算是基本功能之一，小程序本身也自带下拉刷新。我们只需将`window.enablePullDownRefresh`设置为`true`，然后在页面监听`onPullDownRefresh`即可。  

但是当我们用到自定义`navigationBar`的时候，会发现，本来`fixed`定位在顶端的`navigationBar`会被一起拉下来。

<div style="width: 100%;font-size: 0;padding: 20px;background: #eee;border-radius: 3px;margin-top: 15px;display: flex;justify-content: space-around;flex-wrap: wrap;box-sizing: border-box;">
  <div>
    <p style="font-size: 14px;">系统自带的navigationBar的下拉刷新</p>
    <img :src="$withBase('/imgs/navigation_default_pull_down.png')" style="width: 250px; margin: auto;display: block;" alt="foo">
  </div>
  <div>
    <p style="font-size: 14px;">自定义navigationBar的下拉刷新</p>
    <img :src="$withBase('/imgs/navigation_custom_pull_down.png')" style="width: 250px; margin: auto;display: block;" alt="foo">
  </div>
</div>  
  
这个时候我们就必须要使用自定义的下拉刷新。关于自定义的下拉刷新的实现原理这里就不多说了。但是实现起来在真机中发现，`android`手机会有明显的卡顿。

### 层级问题  

按照正常的`navigationBar`，一般这个组件的层级是最高，仅次于遮罩层和弹窗这些组件。一般的组件可以使用`z-index`属性来控制层级。  

但是小程序中有种概念叫做：[原生组件](https://developers.weixin.qq.com/miniprogram/dev/component/native-component.html)  

这些组件包括`camera`，`canvas`，`input`（仅在focus时表现为原生组件），`map`，`textarea`，`video`，`live-player`，`live-pusher`  

这种组件脱离于WebView渲染流程之外，层级也是最高的，因此无论`z-index`设置多大，都无法覆盖原生组件。  

<div style="width: 100%;font-size: 0;padding: 20px;background: #eee;border-radius: 3px;margin-top: 15px;display: flex;justify-content: space-around;flex-wrap: wrap;box-sizing: border-box;">
  <div>
    <p style="font-size: 14px;">系统自带的navigationBar</p>
    <img :src="$withBase('/imgs/navigation_default_textarea.png')" style="width: 250px; margin: auto;display: block;" alt="foo">
  </div>
  <div>
    <p style="font-size: 14px;">自定义navigationBar</p>
    <img :src="$withBase('/imgs/navigation_custom_textarea.png')" style="width: 250px; margin: auto;display: block;" alt="foo">
  </div>
</div>  
  
虽然理论上我们可以用`cover-view`和`cover-image`来实现自定义的`navigationBar`，但是个人觉得还是尽量避免使用自定义的`navigationBar`。

::: tip
虽然`cover-view`和`cover-image`组件可以覆盖在**部分**原生组件上面。对于原生组件之间，可以使用`z-index`来控制他们的层级。  

但是小程序`cover-view`组件内部只支持嵌套`cover-view`和`cover-image`以及`button`。这在很大程度上不支持我们作出多么有个性化的组件。而且实现起来坑也很多。
:::

### 键盘弹起时会将顶部导航栏顶上去

这个是针对`textarea`组件在页面底部的时候，准确来说是`textarea`组件距离底部的距离没有键盘高的时候。在键盘弹起时造成了整个页面上移，从而导致了导航栏会移到页面外。

<div style="width: 100%;font-size: 0;padding: 20px;background: #eee;border-radius: 3px;margin-top: 15px;display: flex;justify-content: space-around;flex-wrap: wrap;box-sizing: border-box;">
  <div>
    <p style="font-size: 14px;">当键盘未弹起时</p>
    <img :src="$withBase('/imgs/navigation_custom_no_focu.jpeg')" style="width: 250px; margin: auto;display: block;" alt="foo">
  </div>
  <div>
    <p style="font-size: 14px;">当键盘弹起时</p>
    <img :src="$withBase('/imgs/navigation_custom_focu.jpeg')" style="width: 250px; margin: auto;display: block;" alt="foo">
  </div>
</div>  

当然这个不算是硬伤，毕竟出现的条件有限，我们可以在设计上尽量避免将`textarea`放到底部来避免这个坑。

## 自定义底部`tabbar`  

### 自定义的`tabbar`  

在说自定义之前先看看小程序自带的`tabbar`可以做到什么程度。  
  
自定义的`tabbar`是在`app.json`中配置的，在`tabBar`下：  

+ 基本配置  

|    属性          | 类型     | 描述
|-----------------|----------|--------------
| color           | HexColor | tab 上的文字默认颜色，仅支持十六进制颜色	
| selectedColor   | HexColor | tab 上的文字选中时的颜色，仅支持十六进制颜色	
| backgroundColor | HexColor | tab 的背景色，仅支持十六进制颜色	
| borderStyle     | string   | tabbar上边框的颜色， 仅支持 black / white	
| list            | Array    | tab 的列表，详见 list 属性说明，最少2个、最多5个 tab	
| position        | string   | tabBar的位置，仅支持 bottom / top	
| custom          | boolean  | 自定义 tabBar，见详情

+ `list`选项配置

|    属性           | 类型   | 描述
|------------------|--------|--------------
| pagePath         | string | 页面路径，必须在 pages 中先定义
| text             | string | tab 上按钮文字
| iconPath         | string | 图片路径，icon 大小限制为40kb，建议尺寸为 81px * 81px，不支持网络图片。当 position 为 top 时，不显示 icon。
| selectedIconPath | string | 选中时的图片路径，icon 大小限制为40kb，建议尺寸为 81px * 81px，不支持网络图片。当 position 为 top 时，不显示 icon。

所以从上面我们可以看到，我们可以定义`tabbar`的选中和未选中图标和字体颜色。没办法加入别的样式和嵌入别的自定义点击事件。

### 自定义的几种实现方式  

1. 组件形式  

这是比较老的版本的形式。在需要`tabbar`的页面嵌入`tabbar`组件。这是最简单的实现方式。但是在首次切换的时候，会有很明显的闪屏。

2. 官网提供的[customer-tab-bar](https://developers.weixin.qq.com/miniprogram/dev/framework/ability/custom-tabbar.html)的形式  

这个比第一种要好点，也是我在项目中用到的一种模式，但是切换的时候也有稍微的闪屏  

3. 伪`tabbar`的形势  

这种实现方式稍微复杂，也就是将首页的几个页面作为组件传入，通过路由控制页面切换。  
  
之所以叫伪`tabbar`的形势，是因为这个只是表面上是`tabbar`。  

理论上这种方式实现的在切换的时候可以做到不闪屏。但是会不会带来别的问题呢？  

比如说返回的时候会不会造成页面错乱？  
原本的页面生命周期和组件的生命周期略有不同，会不会造成一些坑？  
还有个几乎可以肯定的问题，就是如果不使用`cover-view`的话，我们就没法盖住原生组件。

不过好在小程序组件和页面之间的切换很方便，特别是在用`Taro`之后，组件和页面的区分仅仅只是是否在`app.tsx`中注册。所以第二和第三种实现方式切换起来并不是很麻烦。但是目前看来的话第二种实现方式体验还算满意，因此也没有必要切换到第三种方式。  

## 关于弹窗  

额，其实我说的这三个，几乎可以总结出一个问题，那就是小程序中让人吐血的层级问题。  

其实不论是弹窗还是`navigation`还是`tabbar`他们都有一个特点，就是定位在页面的某一个位置，还有层级要足够高，要能够覆盖住底层元素。  

官方没有专门的弹窗容器（我觉得应该有一个弹窗容器）因此只能靠我们自己写了。但是因为`cover-view`令人蛋疼的样式支持度，个人觉得仅仅用`cover-view`和`cover-image`来实现一个定制化的弹窗几乎不可能。  

如果不用`cover-view`你会发现很多常用的组件都是骑在你脸上，而你毫无办法的。  

因此个人建议，在有原生组件的页面上，尽量避免弹层的出现。  

如果是在无法妥协，那也建议弹窗组件分两块来写，一种专门用`cover-view`和`cover-image`来写，并且一定要写`z-index`来控制层级，理论上是后面的元素会覆盖在上一个元素上面，但是还是要防止有些组件在操作的过程中重新渲染，而改变原有的层级。而对于页面中没有原生组件的，可以用`view`来写，这样样式上就自由很多。  


## 关于html2wxml  

关于富文本的渲染。现在基本的做法都是先把`html`解析为节点信息，然后再通过模板渲染为`wxml`。但是因为小程序模板不支持递归调用。所以在很多第三方组件中都出现以下的代码：  

```html
<!--temp0-->
<template>
...
  <template is="temp1"></template>
</template>
<!--temp1-->
<template>
...
  <template is="temp2"></template>
</template>
<!--temp2-->
<template>
...
  <template is="temp3"></template>
</template>
...
```  

通常这种代码会出现十几到二十几个，也就是说最多支持嵌套二十多层。如果不够的话就得自己加了。我就遇到过一个富文本，足足嵌套到了两百多层。我复制到一百的时候实在受不了了，写了一个模板生成器来完成。  

网上有人说这种代码看起来蠢哭了。的确，但是也很无奈。

## 时间格式化问题

这个不能说是小程序的坑，应该说是ios和android对`new Date()`处理上的差异。我们可以用`safari`浏览器和`chrome`来复现这两种差异  

我们公司前后端交互用的时间格式是`YYYY-MM-DDTHH:mm:ss`。这种格式的时间字符串用`new Date()`来处理，在`safari`和`chrome`的表现如下：  

```javascript
new Date('2019-05-29T14:00:00')
// safari Wed May 29 2019 22:00:00 GMT+0800 (CST) = $2
// chrome Wed May 29 2019 14:00:00 GMT+0800 (中国标准时间)
```  

`safari`是比`chrome`要早8小时的，这是因为`chrome`认为这个时间是本地时间，而`safari`认为是国际标准时间，所以会有这样的8小时差异（仅限于中国）。  

因此在调用`new Date()`之前我们需要把`YYYY-MM-DDTHH:mm:ss`格式的转换为`YYYY/MM/DD HH:mm:ss`这种格式的字符串。  

此外，我在处理的过程中还发现带毫秒数的事件字符串`2019-05-29T14:00:00.000`，这种的还需要将毫秒数去掉变成这种格式`2019/05/29 14:00:00`。然后在`ios`和`android`上表现也就一致了。

```javascript
function getDate(date: any) {
  if(typeof date === 'string') {
    return new Date(date.replace('T', ' ').replace(/\-/g, '/').split('.')[0])
  }
  return new Date(date)
}
```  

## 字体  

小程序在`android`下，字体的`font-weight`必须要设置到`700`及以上才会变粗，或者统一使用`bold`  

<div style="width: 100%;font-size: 0;padding: 20px;background: #eee;border-radius: 3px;margin-top: 15px;display: flex;justify-content: space-around;flex-wrap: wrap;box-sizing: border-box;">
  <div>
    <p style="font-size: 14px;">ios</p>
    <img :src="$withBase('/imgs/font-weight-ios.jpeg')" style="width: 250px; margin: auto;display: block;" alt="foo">
  </div>
  <div>
    <p style="font-size: 14px;">android</p>
    <img :src="$withBase('/imgs/font-weight-android.jpeg')" style="width: 250px; margin: auto;display: block;" alt="foo">
  </div>
</div>  

## 小程序分包  

小程序大小是有限制的，目前是主包不超过2M。可是为了实现一些功能，导致我们很容易就超过了这个限制。  

好在官方提供了分包方式。具体可以参照[官方文档](https://developers.weixin.qq.com/miniprogram/dev/framework/subpackages.html)。  

就一点：**对于副包内引用的，较大的包，应该包含在分包的文件夹内部。不然仍然会打包在主包内部**
