import { Vector4 } from "three"

export const Cute = () => {
    // 天空盒的顶点数据 平面的正方向朝里
    const position = [
        // 正 X 面
        new Vector4(1, -1, -1, 1.0),
        new Vector4(1, 1, 1, 1.0),
        new Vector4(1, -1, 1, 1.0),
        new Vector4(1, -1, -1, 1.0),
        new Vector4(1, 1, -1, 1.0),
        new Vector4(1, 1, 1, 1.0),

        // 负 X 面
        new Vector4(-1, -1, 1, 1.0),
        new Vector4(-1, 1, -1, 1.0),
        new Vector4(-1, -1, -1, 1.0),
        new Vector4(-1, -1, 1, 1.0),
        new Vector4(-1, 1, 1, 1.0),
        new Vector4(-1, 1, -1, 1.0),

        // 正 Y 面
        new Vector4(-1, 1, 1, 1.0),
        new Vector4(1, 1, 1, 1.0),
        new Vector4(1, 1, -1, 1.0),
        new Vector4(-1, 1, 1, 1.0),
        new Vector4(1, 1, -1, 1.0),
        new Vector4(-1, 1, -1, 1.0),

        // 负 Y 面
        new Vector4(-1, -1, -1, 1.0),
        new Vector4(1, -1, -1, 1.0),
        new Vector4(1, -1, 1, 1.0),
        new Vector4(-1, -1, -1, 1.0),
        new Vector4(1, -1, 1, 1.0),
        new Vector4(-1, -1, 1, 1.0),

        // 正 Z 面
        new Vector4(-1, -1, 1, 1.0),
        new Vector4(1, -1, 1, 1.0),
        new Vector4(1, 1, 1, 1.0),
        new Vector4(-1, -1, 1, 1.0),
        new Vector4(1, 1, 1, 1.0),
        new Vector4(-1, 1, 1, 1.0),

        // 负 Z 面
        new Vector4(1, -1, -1, 1.0),
        new Vector4(-1, -1, -1, 1.0),
        new Vector4(-1, 1, -1, 1.0),
        new Vector4(1, -1, -1, 1.0),
        new Vector4(-1, 1, -1, 1.0),
        new Vector4(1, 1, -1, 1.0),
    ];

    const texcoord = [
        // 正 X 面
        new Vector4(0, 0, 0, 1.0),
        new Vector4(1, 1, 0, 1.0),
        new Vector4(1, 0, 0, 1.0),
        new Vector4(0, 0, 0, 1.0),
        new Vector4(0, 1, 0, 1.0),
        new Vector4(1, 1, 0, 1.0),

        // 负 X 面
        new Vector4(1, 0, 0, 1.0),
        new Vector4(0, 1, 0, 1.0),
        new Vector4(0, 0, 0, 1.0),
        new Vector4(1, 0, 0, 1.0),
        new Vector4(1, 1, 0, 1.0),
        new Vector4(0, 1, 0, 1.0),

        // 正 Y 面
        new Vector4(0, 1, 0, 1.0),
        new Vector4(1, 1, 0, 1.0),
        new Vector4(1, 1, 1, 1.0),
        new Vector4(0, 1, 0, 1.0),
        new Vector4(1, 1, 1, 1.0),
        new Vector4(0, 1, 1, 1.0),

        // 负 Y 面
        new Vector4(1, 0, 0, 1.0),
        new Vector4(0, 0, 0, 1.0),
        new Vector4(0, 0, 1, 1.0),
        new Vector4(1, 0, 0, 1.0),
        new Vector4(0, 0, 1, 1.0),
        new Vector4(1, 0, 1, 1.0),

        // 正 Z 面
        new Vector4(0, 0, 1, 1.0),
        new Vector4(1, 0, 1, 1.0),
        new Vector4(1, 1, 1, 1.0),
        new Vector4(0, 0, 1, 1.0),
        new Vector4(1, 1, 1, 1.0),
        new Vector4(0, 1, 1, 1.0),

        // 负 Z 面
        new Vector4(1, 0, 0, 1.0),
        new Vector4(0, 0, 0, 1.0),
        new Vector4(0, 1, 0, 1.0),
        new Vector4(1, 0, 0, 1.0),
        new Vector4(0, 1, 0, 1.0),
        new Vector4(1, 1, 0, 1.0)
    ]

    return { position, texcoord }
}