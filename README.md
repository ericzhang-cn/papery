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

## 目录结构

一个papery博客的目录结构如下

```bash
root
 | - articles.yml #文章配置
 | - ext.yml      #用户自定义扩展配置
 | - navbar.yml   #导航菜单配置
 | - pages.yml    #独立页面配置
 | - site.yml     #站点主配置
 | - index.html   #首页（自动生成）
 | - rss.xml      #RSS订阅源（自动生成）
 | - tag.html     #标签索引页（自动生成）
 | - articles #放置文章的目录
      |- post1.md    #post1元文本
      |- post1.html  #post1文章页面（自动生成）
      |- post2.md    #post2元文本
      |- post2.html  #post2文章页面（自动生成）
 | - pages #放置独立页面的目录
      |- page1.md    #page1元文本
      |- page1.html  #page1独立页面（自动生成）
 | - assets #资源目录
      |- vendor  #第三方资源
      |- themes  #主题
          |- default #默认主题
 | - templates #模板目录
```

## 配置站点

站点的总配置文件是site.yml。papery使用[yaml](http://www.yaml.org/)格式作为配置文件格式。
由于yaml的配置格式非常简洁且具有较高的自解释能力，因此即使你没接触过yaml也可以很快理解
配置的意义。

通过pap-create创建的默认site.yml内容如下：

```yaml
title: 博客标题
subtitle: 博客副标题
link: 博客URL
meta:
  description: 页面meta中的description
  keywords: !!seq
    - 关键词1
    - 关键词2
    - 关键词3
  author: 页面meta中的author
master:
  name: 博客主
  about: 个人简介
  email: 邮箱
rss:
  title: RSS源标题
  desc: RSS源描述
  lang: zh-cn
  max: 10
copyright:
  owner: 版权所有方
  beginYear: 2011
  endYear: 2013
  ICP: 备案号
theme: default
```

其中每个字段的意义已经标示清楚，按照自己的需求修改即可。

## 写文章

papery中的文章有两部分组成：文章配置及元文本。文章配置用于告诉papery的构建系统文章
的一些信息，而元文本则是文章的内容。

### 文章配置

文章配置文件为articles.yml。其中一篇文章的配置格式如下：

```yaml
- id: post-id
  title: 文章标题 
  postedOn: !!str 2013-01-01
  author: 作者
  tags: 
    - 标签1
    - 标签2
  abstract: 摘要内容 
```

注意其中最重要的配置项是id。id作为文章的唯一标识，要求在整个articles.yml配置的所有
文章中唯一，并且只能包含小写英文字母、数字和中横“-”。

id不但指定了元文本的名称，而且会成为文章permalink的。建议的id写法是文章的英文标题
按单词用“-”连接。例如“papery-quickstart”。

### 元文本

元文本是文章的内容，papery根据元文本和文章配置最终生成文章页面。papery使用
[GitHub Flavored Markdown](https://help.github.com/articles/github-flavored-markdown)，
(简称gfm)作为元文本书写格式。gfm基本保持了标准markdown的功能，同时增加了一些新的特性，
文档见[这里](https://help.github.com/articles/github-flavored-markdown)。

一篇元文本是放在articles目录下以“md”为后缀名的文件，注意元文本的名字对应配置中
id字段的名字。例如“id: papery-quickstart”的文章对应的元文本为articles/papery-quickstart.md。

你可以用任何文本编辑器书写元文本。如果某些地方markdown的表达能力不够，你可以直接插入html代码。
papery元文本支持markdown与html混编。

## 写独立页面

博客中有时需要一些如“关于”等独立页面。独立页面的编写与文章非常类似，也是
用yaml编写配置文件，用gfm编写元文本。不同的是独立页面的配置项只有id和title。

## 配置导航菜单

papery默认的导航菜单项只有“首页”和“标签”。如果要增加新的导航菜单项，则需要在
navbar.yml中配置。例如我们配置两个导航菜单，一个到博客的RSS订阅源，一个到github
首页，则可以如下配置navbar.yml

```yaml
- label: 订阅
  href: /rss.xml
  target: _self

- label: github
  href: https://github.com/ericzhang-cn/papery
  target: _blank
```

注意target配置项可以配置此导航链接是在本窗口打开还是在新窗口打开。

## 代码高亮

papery内置代码高亮支持，高亮通过[Google Code Prettify](https://code.google.com/p/google-code-prettify/)
实现。

只需将在元文本中插入class为prettyprint的pre标签，如：

```html
<pre class="prettyprint">
#include&lt;stdio.h&gt;

int main(int argc, char** argv) {
    printf("%s\n", "Hello, World!");
}
</pre>
```

即可实现代码高亮，代码语言会自动被识别。

注意代码内的“<”，“>”和“&”要做html escape。

## 数学公式

papery默认启用[MathJax](http://www.mathjax.org/)插件，因此直接支持LaTeX格式的数学公式渲染。
不过由于反斜杠“\”和下划线“_”在markdown中有特殊意义，因此需要转义。

### 内联数学公式

内联数学公式使用“\(”和“\)”包裹，渲染后内联于行内。例如：

```
\\(e^{i\\pi}+1=0\\)
```

注意反斜杠需要转义。

### 单行数学公式

单行数学公式使用“\[”和“\]”包裹，渲染后单独占一行，例如：

```
\\[e^{i\\pi}+1=0\\]
```
