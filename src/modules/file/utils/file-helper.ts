import path from 'path';

export const getObjectName = (folder: string, name: string, extension: string): string => {
    return `${folder}/${name}.${extension}`;
};

export const getExtension = (filename: string): string => {
    return path.extname(filename).replace(/\./g, '').toLowerCase();
};
