// 解析Obj格式
export const parseObj = (text) => {
    // because indices are base 1 let's just fill in the 0th data
    const objPositions = [[0, 0, 0]];
    const objTexcoords = [[0, 0]];
    const objNormals = [[0, 0, 0]];

    // same order as `f` indices
    const objVertexData = [objPositions, objTexcoords, objNormals];

    // same order as `f` indices
    let webglVertexData = [
        [], // positions
        [], // texcoords
        [], // normals
    ];

    function addVertex(vert) {
        const ptn = vert.split('/');
        ptn.forEach((objIndexStr, i) => {
            if (!objIndexStr) {
                return;
            }
            const objIndex = parseInt(objIndexStr);
            const index = objIndex + (objIndex >= 0 ? 0 : objVertexData[i].length);
            webglVertexData[i].push(...objVertexData[i][index]);
        });
    }

    const keywords = {
        v(parts) {
            objPositions.push(parts.map(parseFloat));
        },
        vn(parts) {
            objNormals.push(parts.map(parseFloat));
        },
        vt(parts) {
            // should check for missing v and extra w?
            objTexcoords.push(parts.map(parseFloat));
        },
        f(parts) {
            const numTriangles = parts.length - 2;
            for (let tri = 0; tri < numTriangles; ++tri) {
                addVertex(parts[0]);
                addVertex(parts[tri + 1]);
                addVertex(parts[tri + 2]);
            }
        },
    };

    const keywordRE = /(\w*)(?: )*(.*)/;
    const lines = text.split('\n');
    for (let lineNo = 0; lineNo < lines.length; ++lineNo) {
        const line = lines[lineNo].trim();
        if (line === '' || line.startsWith('#')) {
            continue;
        }
        const m = keywordRE.exec(line);
        if (!m) {
            continue;
        }
        const [, keyword, unparsedArgs] = m;
        const parts = line.split(/\s+/).slice(1);
        const handler = keywords[keyword];
        if (!handler) {
            // console.warn('unhandled keyword:', keyword); // eslint-disable-line no-console
            continue;
        }
        handler(parts, unparsedArgs);
    }
    return {
        position: webglVertexData[0],
        texcoord: webglVertexData[1],
        normal: webglVertexData[2],
    };
};

// 向量叉乘
const cross = (a, b) => {
    return {
        x: a.y * b.z - a.z * b.y,
        y: a.z * b.x - a.x * b.z,
        z: a.x * b.y - a.y * b.x,
    };
};

export const getPosAndNormal = (text) => {
    const { position } = parseObj(text);
    const normals = [];

    for (let i = 0; i < position.length / 9; i++) {
        const idx = i * 9;
        const p0 = { x: position[idx], y: position[idx + 1], z: position[idx + 2] };
        const p1 = {
            x: position[idx + 3],
            y: position[idx + 4],
            z: position[idx + 5],
        };
        const p2 = {
            x: position[idx + 6],
            y: position[idx + 7],
            z: position[idx + 8],
        };
        const a = { x: p2.x - p1.x, y: p2.y - p1.y, z: p2.z - p1.z };
        const b = { x: p1.x - p0.x, y: p1.y - p0.y, z: p1.z - p0.z };
        const normal = cross(a, b);
        normals.push(normal.x);
        normals.push(normal.y);
        normals.push(normal.z);
        normals.push(normal.x);
        normals.push(normal.y);
        normals.push(normal.z);
        normals.push(normal.x);
        normals.push(normal.y);
        normals.push(normal.z);
    }

    return {
        position,
        normal: normals,
    };
};