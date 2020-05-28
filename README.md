# umi project

## Getting Started

Install dependencies,

```bash
$ yarn
```

Start the dev server,

```bash
$ yarn start
```

## Functions

Markdown 编辑器功能总览：
1. 总窗口
    1. 隐藏 titleBar 并重写拖拽和双击放大的功能
2. 工作区
    1. CodeMirror，vim 模式，样式自定义
    2. 预览区：markdown-it 和插件，样式
    3. 状态栏：光标位置，标签，模式选择，视图选择，标题，创建日期，字数
    4. 去掉列数显示
3. 文档管理
    1. 全局目录：文档，标签，标星等
    2. 本地文件格式：
        1. folder 文件夹
            1. 文件名：folder-uuid.json
            2. 名字：name
            3. 父亲文件夹：folder
            4. 创建日期：create-time
            5. 修改日期：update-time
        2. document 文件夹：
            1. markdown 内容：md 文件
            2. 简要信息：uuid.json
                1. 名称：name
                2. 标签：tag<list>
                3. 所属文件夹：folder
                4. 创建日期：create-time
                5. 修改日期：update-time
4. 图片管理

