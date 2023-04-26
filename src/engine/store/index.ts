
const createRenderStore = () => {
    const state: RenderState = {
        // 使用背面剔除
        'use-backCull': false,
        // 使用CVV裁剪
        'use-cvvCull': true
    }

    const enable = (key: keyof RenderState) => {
        state[key] = true
    }

    const disable = (key: keyof RenderState) => {
        state[key] = false
    }

    return { enable, disable, state }
}

// 渲染用状态
export const RenderStore = createRenderStore()
