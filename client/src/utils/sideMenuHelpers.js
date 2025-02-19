import { v4 as uuidv4 } from 'uuid';

export const generateUniqueFileName = (design, tempSelectedCategory) => {
    if (design?.designType === "motor") {
        return design.structure.mountingTypes[tempSelectedCategory]?.baseDrawing?.path || uuidv4();
    } else if (design?.designType === "smiley") {
        return design.structure.sizes[tempSelectedCategory].baseDrawing?.path || uuidv4();
    }
    return uuidv4();
};

export const prepareFormData = (design, tempSelectedCategory, tempPages, folderNames, structure, newBaseDrawingFiles) => {
    const formData = new FormData();
    
    formData.append('folder', design.folder);
    formData.append('selectedCategory', tempSelectedCategory);
    formData.append('folderNames', folderNames);
    formData.append('structure', JSON.stringify(structure));

    for (const [folder, file] of Object.entries(newBaseDrawingFiles)) {
        const customName = `${folder}<<&&>>${structure.baseDrawing.path}${file.name.slice(-4)}`;
        formData.append('files', file, customName);
    }

    return formData;
};

export const getChangedPages = (design, tempSelectedCategory) => {
    if (design?.designType === "motor") {
        return design.structure.mountingTypes[tempSelectedCategory].pages;
    } else if (design?.designType === "smiley") {
        return design.structure.sizes[tempSelectedCategory].pages;
    }
    return {};
};