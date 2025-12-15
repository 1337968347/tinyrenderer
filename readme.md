# 纯 JavaScript 软光栅渲染器

> 一个不依赖 WebGL 的 3D 渲染器，完全使用原生 Canvas 2D API 和 JavaScript 实现

## ✨ 特性

- 🎨 **纯 JavaScript 实现** - 无需 WebGL，仅使用 Canvas 2D API
- 🔺 **软光栅渲染** - 手动实现光栅化管线
- 💡 **光照系统** - 支持 Phong 光照模型
- 🎮 **交互控制** - WASD 移动 + 鼠标视角控制
- 📦 **3D 模型加载** - 支持 OBJ 格式模型
- 🌈 **纹理贴图** - 支持纹理映射和法线贴图
- 🎯 **天空盒** - 环境映射支持

## 🎮 控制说明

- **鼠标拖拽** - 调整视角方向
- **W/S** - 前进/后退
- **A/D** - 左移/右移

## 🚀 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm start

# 构建生产版本
npm run build
```

## 🛠️ 技术栈

- **TypeScript** - 类型安全的 JavaScript
- **Three.js** - 仅用于数学库（Vector3, Matrix4）
- **Stencil.js** - Web Components 构建工具
- **Canvas 2D API** - 图形渲染

## 📂 项目结构

```
src/
├── engine/          # 渲染引擎核心
│   ├── pipeline/    # 渲染管线
│   ├── geometry/    # 几何体和数学工具
│   ├── control/     # 输入控制
│   ├── scene/       # 场景管理
│   └── mesh/        # 网格模型
├── shader/          # 着色器实现
│   ├── black/       # 黑人头着色器
│   ├── wall/        # 墙面着色器
│   ├── skybox/      # 天空盒着色器
│   └── raytrace/    # 光线追踪着色器
└── assets/          # 3D 模型资源
```

## 🎓 实现原理

本项目实现了完整的 3D 图形渲染管线：

1. **顶点处理** - 模型空间 → 世界空间 → 相机空间 → 裁剪空间
2. **图元装配** - 顶点组装成三角形
3. **光栅化** - 三角形转换为像素片段
4. **片段着色** - Phong 光照计算、纹理采样
5. **深度测试** - Z-buffer 深度缓冲
6. **帧缓冲输出** - 写入 Canvas

## 📝 说明

这是一个教学性质的项目，演示了如何从零开始实现 3D 渲染器的核心功能。虽然性能不如 WebGL，但能帮助理解图形学渲染管线的工作原理。

## 📄 License

MIT
