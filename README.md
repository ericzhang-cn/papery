papery - 献给所有简洁控的极客范博客系统

# 一分钟生成自己的博客

通过[npm](https://npmjs.org/)安装papery

```bash
npm install -g papery
```

创建博客

```bash
pap-create myblog
pap-build all myblog
pap-server myblog
```

在浏览器中输入http://localhost:8001/即可访问

# papery的特点

+ 纯nodejs编写，跨平台，通过npm直接使用，免安装
+ 不使用动态脚本，没有数据库
+ 全结构化文本模式(yaml + markdown)发布文章及页面
+ 全静态网站，访问速度飞快，天然防SQL注入等攻击
+ 可定制模板系统，并可方便的扩展
+ 支持自定义皮肤主题
+ 自带代码高亮及LaTeX数学公式支持
+ 可通过插件支持评论、分享、站内推荐等功能
