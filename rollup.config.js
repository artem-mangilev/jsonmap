import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";

export default [
    {
        input: './src/index.ts',
        output: {
            file: 'bundle.js',
            format: 'cjs'
        },
        plugins: [
            typescript({ target: 'ES6' }),
            commonjs()
        ]
    }
]