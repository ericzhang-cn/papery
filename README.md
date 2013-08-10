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

+ 纯nodejs编写，跨平台，通过npm直接安装使用
+ 不使用动态脚本，没有数据库
+ 全结构化文本模式(yaml + markdown)发布文章及页面
+ 全静态网站，访问速度飞快，天然防SQL注入等攻击
+ 可定制模板系统，并可方便的扩展
+ 支持自定义皮肤主题
+ 自带代码高亮及LaTeX数学公式支持
+ 可通过插件支持评论、分享、站内推荐等功能

# 使用说明

## 安装

首先要保证机器上安装有[nodejs](http://nodejs.org/)及[npm](https://npmjs.org/)。

然后执行

```bash
npm install -g papery
```

即可完成安装。

## 命令行工具

安装papery后，则可以通过命令行工具创建、构建及调试博客。papery包含pap-create，pap-build和pap-server三个命令。

### pap-create

pap-create命令用于创建一个新的博客，使用方法为：

```bash
pap-create blog_root_directory
```

执行后则会在blog_root_directory目录创建一个全新的博客，里面包含papery博客的基本目录结构及配置文件等你内容。详细信息会在下文详述。

### pap-build

通过pap-create创建的博客还不能成为一个真正可以访问的网站，因为里面只包含配置信息和元文本，还没有web页面。pap-build用于根据配置和元文本生成web内容。使用方法为：

```bash
pap-server cmd blog_root_directory
```

其中cmd列表如下：

+ all - 构建所有页面
+ index - 只构建index.html
+ tag - 只构建tag.html
+ rss - 只构建rss.xml
+ pages - 只构建pages/目录下的内容
+ articles - 只构建articles/下的内容

### pap-server

pap-server可以在本地启动一个调试服务器用于快速预览和调试内容，命令为：

```bash
pap-server blog_root_directory
```

执行上述命令将在本地8001端口启动一个webserver，在浏览器中输入http://localhost:8001/即可访问。

## 目录结构及URL

### 目录结构

一个papery博客的目录结构如下

```
root
 | - articles.yml
 | - ext.yml
 | - navbar.yml
 | - pages.yml
 | - site.yml
 | - index.html
 | - rss.xml
 | - tag.html
 | - articles
      |- post1.md
      |- post1.html
      |- post2.md
      |- post2.html
 | - pages
      |- page1.md
      |- page1.html
      |- page2.md
      |- page2.html
 | - assets
      |- vendor
      |- themes
          |- default
 | - templates 
```
