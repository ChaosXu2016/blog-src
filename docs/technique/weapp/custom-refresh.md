# 小程序自定义下拉刷新和触底加载

::: tip

在考虑实现自定义的下拉刷新组件的时候，首先要明确，这个算是一种hack方案。并不是说自定义的有多么好，反而自定义的下拉刷新在`android`下会有细微的卡顿（我这种实现方式）。所以尽量还是用小程序自带的吧。  

这个实现主要是参考[艾伦大佬的组件](https://www.cnblogs.com/aaronjs/p/9982708.html)。  

:::

## 实现方式

我们将页面分为下面的结构

<div style="width: 100%;font-size: 0;padding: 20px;background: #eee;border-radius: 3px;margin-top: 15px;display: flex;justify-content: space-around;flex-wrap: wrap;box-sizing: border-box;">
  <div>
    <img :src="$withBase('/imgs/refresh_view_1.png')" style="width: 250px; margin: auto;display: block;" alt="foo">
  </div>
</div>  

正常的时候**下拉刷新区域**的高度为`0`。  

然后我们通过`scroll-view`的`scrollToUpeper`事件来标记开始下滑。

通过`touchstart`来记录我们手指的初始位置。  

通过监听**列表区域**的`touchmove`事件，来不断的计算手指移动距离。 

`touchend`事件来触发更新事件。  

我们将页面分为几种状态：  

```typescript
enum refreshStatus {
  INIT,
  PULL_DOWN,
  READY_REFRESH,
  LOADING,
  DONE
}
```  

大致流程如下：  

1. 页面加载之后是`INIT`状态。  

2. 当触发了`scroll-view`的`scrollToUpeper`事件，我们记录一个标志位`isUpper`，在`scroll-view`的`scroll`事件触发时，`isUpper`记为`false`

3. 当我们列表页滑倒顶部的时候再下拉，页面进入了`PULL_DOWN`状态。 一般会设置一个有效的下拉距离，称之为`validHeight`，当下拉的高度不足`validHeight`时，这时候松开手指，页面回弹不刷新。  

4. 当我们继续下拉，距离超过了`validHeight`这时候进入了`READY_REFRESH`状态。  

5. 在`READY_REFRESH`状态的时候放开手指，页面刷新，进入`LOADING`状态。

6. 页面刷新完毕之后，进入`DONE`状态，刷新区域高度变为`0`  

我们还需要设置一个最大下拉高度，以及在`READY_REFRESH`状态，手指放开后回弹到刷新区域的最大高度。  

至此我们可以写出`touchend`、`touchstart`、`touchmove` 代码大致如下：（[详细代码](https://github.com/ChaosXu2016/blog-mini)）

```typescript
  handleTouchMove(e) {
    const curTouch = e.touches[0]
    const moveY = (curTouch.pageY - this.lastTouchY) * .3
    if(
      !this.isUpper ||
      moveY < 0 || 
      moveY > 2 * this.maxHeight ||
      this.state.refreshStatu === refreshStatus.LOADING
    ) {
      return
    }
    if(moveY < this.validHeight) {
      this.setState({
        refreshHeight: moveY,
        refreshStatu: refreshStatus.PULL_DOWN
      })
    } else {
      this.setState({
        refreshHeight: moveY,
        refreshStatu: refreshStatus.READY_REFRESH
      })
    }
  }
  handleTouchStart(e) {
    const curTouch = e.touches[0]
    this.lastTouchY = curTouch.pageY
  }
  handleTouchEnd() {
    this.lastTouchY = 0
    if(this.state.refreshStatu === refreshStatus.READY_REFRESH) {
      this.setState({
        refreshStatu: refreshStatus.LOADING,
        refreshHeight: this.maxHeight
      })
      if (this.props.onRefresh) {
        this.props.onRefresh()
      }
    } else {
      this.setState({
        refreshHeight: 0
      })
    }
  }
  handleScrollToUpeper() {
    this.isUpper = true
  }
  handleScroll() {
    this.isUpper = false
  }
```  

除此之外，我们还需要在调用的页面上加上`disableScroll: true`的配置，以解决ios整个页面跟着下滑的问题。  

## 对比原生的下拉刷新  

1. android下会有稍微的卡顿，ios和模拟器体验比较好。

2. 可以页面局部的下拉刷新。刷新的样式也可以定制化。  


## 结语  

其实在`ios`下还有一种实现方式，利用的就是`ios`的`scroll-view`在拉到顶部的时候还可以往下拉（橡皮筋效果），这时候我们可以把刷新的区域放在`scroll-view`可是区域上面。性能上肯定要比不断的计算高度来的要好。  

但是有两个问题：  

1. 不能再页面中局部使用，因为局部使用的话就需要禁用页面滚动，这也跟着禁用了ios的橡皮筋效果，从而使我们的下拉刷新不能用  

2. 手指放开之后有个轻微的回弹效果，虽然无伤大雅，但是感觉还是挺奇怪的。  

这种实现方式下次我也贴出来，也可以参照[艾伦的博客](https://www.cnblogs.com/aaronjs/p/9982708.html)，他说的比较详细，我也主要是参考他的代码来实现的。
