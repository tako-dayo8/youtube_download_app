import UglifyJS from 'uglify-js';
import fs from 'fs';
import { globSync } from 'glob';
import { execSync } from 'child_process';

/**圧縮オプション*/
const minifyOption = {
    mangle: {
        toplevel: true,
    },
    nameCache: {},
};

if (fs.existsSync('build')) {
    fs.rmSync('build', { recursive: true, force: true });
}

fs.mkdirSync('build');


execSync("npx tsc")

globSync("build/**/*.js", {nodir : true}).forEach((file) => {
    // JavaScriptファイルの場合、圧縮処理を実行して新しいファイルに保存
    const jsContent = fs.readFileSync(file, 'utf8');
    const minifiedContent = UglifyJS.minify(jsContent, minifyOption).code;
    fs.writeFileSync(file, minifiedContent);
    console.log(`ファイル "${file}" に圧縮版を保存しました。`);
});
