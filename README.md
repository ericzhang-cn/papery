[![Build Status](https://travis-ci.org/ericzhang-cn/papery.png)](https://travis-ci.org/ericzhang-cn/papery)

Papery - Create your simple, fast & elegant blog with plain text.

# 一分钟生成自己的博客

```bash
npm install -g papery

papery create myblog
papery build myblog
papery server myblog
```

在浏览器中输入 http://localhost:8001/ 即可访问

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
## 安装及升级
首先要保证机器上安装有[NodeJS](http://nodejs.org/)及[npm](https://npmjs.org/)。

NodeJs版本需要 >= 0.10。

### 安装
```bash
npm install -g papery
```

### 升级
```bash
npm update -g
```

## 命令列表
### create
create命令用于创建一个新的博客，使用方法为：

```bash
papery create <root>
```

执行后则会在root目录创建一个全新的博客，里面包含papery博客的基本目录结构及配置文件等内容。详细信息会在下文详述。

### build
通过create创建的博客还不能成为一个真正可以访问的网站，因为里面只包含配置信息和元文本，还没有web页面。build用于根据配置和元文本生成web内容。使用方法为：

```bash
papery build <root>
```

### server
server可以在本地启动一个调试服务器用于快速预览和调试内容，命令为：

```bash
papery server <root> [<port>]
```

执行上述命令将在本地port指定的端口启动一个webserver，其中port为可选项，默认值为8001。在浏览器中输入 http://localhost:<port>/ 即可访问。

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
由于yaml的配置格式非常简洁且具有较高的自解释能力，因此即使你没接触过yaml也可以很快理解配置的意义。

通过create创建的默认site.yml内容如下：

```yaml
title: Title of blog
subtitle: Subtitle of blog
link: Homepage link
meta:
  description: Content of description meta tag
  keywords: !!seq
    - keyword1
    - keyword2
    - keyword3
  author: Content of author meta tag
master:
  name: Your name
  about: Introduce yourself here
  email: Your E-mail
rss:
  title: RSS feed title
  desc: RSS feed description
  lang: RSS feed language (ex: zh-cn)
  max: 10
copyright:
  owner: Copyrighter
  beginYear: 2011
  endYear: 2013
theme: default
codetheme: night
```

其中每个字段的意义已经标示清楚，按照自己的需求修改即可。

## 写文章
papery中的文章有两部分组成：文章配置及元文本。文章配置用于告诉papery的构建系统文章的一些信息，而元文本则是文章的内容。

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

注意其中最重要的配置项是id。id作为文章的唯一标识，要求在整个articles.yml配置的所有文章中唯一，并且只能包含小写英文字母、数字和中横“-”。

id不但指定了元文本的名称，而且会成为文章permalink的。建议的id写法是文章的英文标题按单词用“-”连接。例如“papery-quickstart”。

### 元文本
元文本是文章的内容，papery根据元文本和文章配置最终生成文章页面。papery使用[GitHub Flavored Markdown](https://help.github.com/articles/github-flavored-markdown)(简称gfm)作为元文本书写格式。gfm基本保持了标准markdown的功能，同时增加了一些新的特性，文档见[这里](https://help.github.com/articles/github-flavored-markdown)。

一篇元文本是放在articles目录下以“md”为后缀名的文件，注意元文本的名字对应配置中id字段的名字。例如“id: papery-quickstart”的文章对应的元文本为articles/papery-quickstart.md。

你可以用任何文本编辑器书写元文本。如果某些地方markdown的表达能力不够，你可以直接插入html代码。papery元文本支持markdown与html混编。

## 写独立页面
博客中有时需要一些如“关于”等独立页面。独立页面的编写与文章非常类似，也是用yaml编写配置文件，用gfm编写元文本。

独立页面的配置文件为pages.yml，元文本放在pages/目录下。

独立页面的配置项只有id和title，同样通过id关联配置项和元文本。

## 配置导航菜单
papery默认的导航菜单项只有“首页”和“标签”。如果要增加新的导航菜单项，则需要在navbar.yml中配置。例如我们配置两个导航菜单，一个到博客的RSS订阅源，一个到github首页，则可以如下配置navbar.yml

```yaml
- label: 订阅
  href: /rss.xml
  target: _self

- label: github
  href: https://github.com
  target: _blank
```

注意target配置项可以配置此导航链接是在本窗口打开还是在新窗口打开。

## 代码高亮
papery内置代码高亮支持，高亮通过[Google Code Prettify](https://code.google.com/p/google-code-prettify/)实现。

插入代码时使用gfm格式，用“\`\`\`[lang]”开头，并用“\`\`\`”结尾，如：

<pre>
```c
#include <stdio.h>

int main(int argc, char** argv) {
    printf("%s\n", "Hello, World!");
}
```
</pre>

即可实现代码高亮。

papery自带两种代码高亮风格，分别是“night”和“light”。默认为“night”，可以在site.yml的“codetheme”中配置。

## 数学公式
papery默认启用[MathJax](http://www.mathjax.org/)插件，因此直接支持LaTeX格式的数学公式渲染。不过由于反斜杠“\”和下划线“_”在markdown中有特殊意义，因此需要转义。

### 内联数学公式
内联数学公式使用“$...$”或“\\(...\\)”包裹，渲染后内联于行内。例如：

```
\\(e^{i\\pi}+1=0\\)
$e^{i\\pi}+1=0$
```

注意反斜杠需要转义。另外，如果需要将“$”解释为字符本身而非Tex数学公式，可以使用转义字符，如：

```
\\$2.50
```

### 单行数学公式
单行数学公式使用“$$...$$”或“\\[...\\]”包裹，渲染后单独占一行，例如：

```
\\[e^{i\\pi}+1=0\\]
$$e^{i\\pi}+1=0$$
```

## TOC
在文中任何位置插入

```html
<!-- toc -->
```

会在当前位置根据文章outline自动生成TOC。

# 高级使用
## 扩展配置及自定义模板
### 自定义模板
papery使用[ejs](https://github.com/visionmedia/ejs)作为模板引擎。模板文件全部放在templates目录下，后缀名为ejs。对于有html基础的用户可以自己对模板进行定制。

## 扩展配置项绑定
除了固定配置项外，papery还提供了一个ext.yml用于用户自定义扩展配置。用户在这个yaml中可以输入自己的配置，然后在模板中通过ext命名空间绑定内容。

例如，在ext.yml中输入：

```yaml
foo: bar
```

则在模板文件中用

```html
<%= ext.foo %>
```

则此处内容会被替换为“bar”。结合yaml的数据结构及ejs模板引擎，有编程基础的用户可以灵活的按需定制。

## 自定义主题
papery的模板中没有表现相关的东西，最终的外观表现依赖于皮肤主题。皮肤主题存放在assets/themes/目录下，子目录名称就是主题名称。当前启用的主题在site.yml的theme配置项中配置。

papery默认带一个名叫“default”的主题。

自定义主题的主文件是assets/themes/[theme_name]/main.css文件。用户可以通过写不同的main.css文件放在相应目录下，然后修改site.yml来启用不同主题。

如需引入额外css、js或图片文件，请使用下文提到的插件模式。

## 插件
papery通过在模板文件中引入不同的模板片段启用不同插件。启用插件的方式是将相关代码片段放到相关的注入点模板文件即可。默认有三个注入点：

### header\_plugin
header\_plugin的模板文件为templates/inc/header\_plugin.ejs。这个文件的内容会被包含到网站所有页面的head部分内。可以用于引入一些在页面主内容加载前需要引入的css、js等。如皮肤主题需要的额外css。

### footer\_plugin
footer\_plugin的模板文件为templates/inc/footer\_plugin.ejs。这个文件的内容会被包含到网站所有页面的body部分结束前。可以用于引入一些在页面主内容加载后需要引入的css、js等。如网站统计代码。

papery默认启用的mathjax插件在这里引入。

### article\_footer\_plugin
article\_footer\_plugin的模板文件为templates/inc/article\_footer\_plugin.ejs。这个文件的内容被包含到所有文章页面的底部。可以用于引入评论、分享等于文章相关的插件。

如上述位置不满足需求，用户也可以通过自定义模板方式自己定制页面。

### 常用插件推荐
#### 评论
+ 多说 - http://duoshuo.com
+ 友言 - http://www.uyan.cc
+ 畅言 - http://changyan.sohu.com

#### 社会化分享
+ JiaThis - http://www.jiathis.com
+ bShare - http://www.bshare.cn
+ 百度分享 - http://share.baidu.com

#### 推荐系统
+ 友荐 - http://www.ujian.cc

#### 统计
+ Google Analytics - http://www.google.com/analytics
+ 百度统计 - http://tongji.baidu.com
+ 量子恒道 - http://www.linezing.com
+ 腾讯分析 - http://ta.qq.com

# 开发
## 代码库
```bash
git clone https://github.com/ericzhang-cn/papery.git
```

## 运行单元测试
```bash
cd papery
npm test
```

# License
[The MIT License (MIT)](http://opensource.org/licenses/MIT)

Copyright (c) 2013 Eric Zhang

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
