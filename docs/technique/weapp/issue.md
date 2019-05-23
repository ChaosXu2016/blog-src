# 小程序踩坑记
::: tip
这里主要记录这段时间开发小程序过程中遇到的坑。主要是希望在以后开发小程序的过程中能在评审需求的时候就发现哪些能实现，哪些实现起来比较困难。这样就能在定设计和交互之前尽可能的减少后期踩坑的风险。  
  
个人非常不喜欢hack，因为这会使代码变得不优雅，后期别人接手时也会很难理解  
  
所以尽可能的了解小程序的特点，可以让我们在评审需求的阶段把一些不合理的和设计和产品沟通，尽可能的减少代码中的hack
:::  

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

但是当我们用到自定义`navigationBar`的时候，会发现，本来`fixed`定位在顶端的`navigationBar`会被一起拉下来。。。  

这时候我们就不得不去自己实现了

### 层级问题  

按照正常的`navigationBar`，一般这个组件的层级是最高，仅次于遮罩层和弹窗这些组件。一般的组件可以使用`z-index`属性来控制层级。  

但是小程序中有种概念叫做：[原生组件](https://developers.weixin.qq.com/miniprogram/dev/component/native-component.html)  

这些组件包括`camera`，`canvas`，`input`（仅在focus时表现为原生组件），`map`，`textarea`，`video`，`live-player`，`live-pusher`

这种组件脱离于WebView渲染流程之外，层级也是最高的，因此无论`z-index`设置多大，都无法覆盖原生组件。  
  
虽然理论上我们可以用`cover-view`和`cover-image`来实现自定义的`navigationBar`，但是个人觉得还是尽量避免使用自定义的`navigationBar`。

::: tip
虽然`cover-view`和`cover-image`组件可以覆盖在**部分**原生组件上面。对于原生组件之间，可以使用`z-index`来控制他们的层级。  

但是小程序`cover-view`组件内部只支持嵌套`cover-view`和`cover-image`以及`button`。这在很大程度上不支持我们作出多么有个性化的组件。而且实现起来坑也很多。
:::

### 键盘弹起时会将顶部导航栏顶上去

这个是针对`textarea`组件

## 自定义底部`tabbar`  

### 谈谈实现方式


