import { Plugin } from 'rollup';

const ANTD_IMPORT_LINE_REG = /import {[\w,\s]+} from (\'|\")antd(\'|\");?/g;

function transformToKebabCase (name: string) {
  return name.replace(/([^-])([A-Z])/g, '$1-$2').toLocaleLowerCase();
}

export default function antdImportPlugin(): Plugin {
  return {
    name: 'vite-plugin-react-antd-import',
    transform(code) {
      if (/antd/.test(code)) {
        const importLine = code.match(ANTD_IMPORT_LINE_REG)![0];
        const cssLines = importLine
          .match(/\w+/g)!
          .slice(1, -2)
          .map(name => `import "antd/lib/${transformToKebabCase(name)}/style/index.css";`)
          .join('\n');

        return code.replace(ANTD_IMPORT_LINE_REG, `${importLine}\n${cssLines}`)
      }

      return null;
    },
  };
}