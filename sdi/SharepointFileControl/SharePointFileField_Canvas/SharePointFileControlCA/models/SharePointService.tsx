import { arrayBuffer } from "stream/consumers";
import { fileURLToPath } from "url";
import { XrmWebApi } from "./XrmWebApi";

class spFolder {
    Name: string;
}
class spFile {
    Name: string;
}
class xhrParameter {
    url: string;
    method: string;
    token: string;
    file?: File;
    fileLength?: string;
}
export class spbuild {
    appWebUrl: string;
    library: string;
    uploadFolders: string[];
    WebAPI: XrmWebApi;
    token: string;
}
export class FileData {
    public file: File;
    public fileLength: string;
    public dpFileName: string;
}

export class SharePointService {
    private appWebUrl: string;
    private library: string;
    private uploadFolderPath: string;
    private uploadFolders: string[];

    constructor(param: spbuild) {
        this.appWebUrl = param.appWebUrl;
        this.library = param.library;

        this.uploadFolders = param.uploadFolders;
        this.uploadFolderPath = this.uploadFolders.join("/");
    }
    private spClient = (param: xhrParameter): Promise<any> => {
        return new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest();
            xhr.onload = async function () {
                // console.log("SUCCESS");
                resolve(xhr.response);
            }
            xhr.onerror = function () {
                console.log("ERROR");
                reject({ statue: xhr.status, statusText: xhr.statusText });
            }
            xhr.open(param.method, param.url);
            xhr.setRequestHeader("Accept", "application/json; odata=verbose");
            xhr.setRequestHeader("Content-type", "application/json; odata=verbose");
            xhr.setRequestHeader("Authorization", `Bearer ${param.token}`);
            xhr.responseType = "json";
            if (param.file && param.fileLength) {
                xhr.send(param?.file);
            }
            else
                xhr.send();
        })

    }
    public ensureUploadFolder = async (token: string): Promise<void> => {
        const self: SharePointService = this;

        let checkPath: string = self.library;
        for (let folder of self.uploadFolders) {
            checkPath = `${checkPath}/${folder}`;
            await ensureFolder(checkPath);
        }

        async function ensureFolder(folderPath: string) {
            const folders = folderPath.split('/');
            const parentPath = folders.slice(0, folders.length - 1).join('/');
            const folderName = folders[folders.length - 1];
            const apiUrl = `${self.appWebUrl}/_api/web/GetFolderByServerRelativeUrl('${parentPath}')/Folders`;

            let response = await self.spClient({ url: apiUrl, method: "GET", token: token });
            let childFolders = response?.d?.results as Array<spFolder>;
            let matchNameFolders = childFolders.filter(folder => folder.Name == folderName);
            if (matchNameFolders.length > 0) return;
            await self.createFolder(parentPath, folderName, token);
        }
    }
    public getDuplicateFileName = async (fileName: string, token: string): Promise<string> => {
        let recordRoute = `${this.library}/${this.uploadFolderPath}`;
        let url = `${this.appWebUrl}/_api/web/GetFolderByServerRelativeUrl('${recordRoute}')/Files`;
        let ind: number = -1;
        await this.spClient({
            url: url,
            method: "GET",
            token: token,
        }).then(async (response) => {
            let fileArray = (response as any)?.d?.results as Array<spFile>;
            ind = fileArray ? this.getFirstIndex(fileArray, fileName) : -1;
        })
        return this.generateFileNameByIndex(fileName, ind);
    }
    private getFirstIndex = (arr: Array<spFile>, fileName: string): number => {
        let dotPos = fileName.lastIndexOf(".");
        let len = fileName.length;
        let pos: number;
        let reg: RegExp;
        let rawName: string;
        let regRawName: string;
        let extension: string;
        let fileArr: string[] = [];
        let indexArr: number[] = [];
        let ind: number = 0;

        rawName = dotPos == -1 ? fileName : fileName.substring(0, dotPos);
        extension = dotPos == -1 ? "" : "\\." + fileName.substring(dotPos + 1);
        regRawName = rawName.replace(/\(/g, "\\(");
        regRawName = regRawName.replace(/\)/g, "\\)");
        reg = new RegExp(`^${regRawName}(\\s\\(\\d+\\))?${extension}$`, 'g');
        pos = rawName.length + 2;

        arr.forEach((file) => {
            let match = file.Name.match(reg);
            if (match) {
                fileArr.push(file.Name);
            }
        })
        fileArr.forEach((name) => {
            let pushNum = 0;
            if (name.length > len) {
                pushNum = parseInt(name.substring(pos));
            }
            indexArr.push(pushNum);
        })
        indexArr.sort((a, b) => a - b);
        while (ind < 999) {
            if (indexArr.find((val) => val == ind) == undefined) return ind;
            ind++;
        }
        return -1;
    }
    private generateFileNameByIndex = (fileName: string, ind: number): string => {
        let suffix = ind > 0 ? ` (${ind})` : "";
        let dotPos = fileName.lastIndexOf(".");
        if (dotPos == -1) return fileName + suffix;
        return fileName.substring(0, dotPos) + suffix + fileName.substring(dotPos);
    }
    public createFolder = async (path: string, folderName: string, token: string): Promise<void> => {
        let url = this.appWebUrl + `/_api/Web/Folders/add('${path}/${folderName}')`;
        this.spClient({
            url: url,
            method: "POST",
            token: token,
        }).then((response) => {
            // console.log(`folder: "${path}/${folderName}" created!`);
        })
    }
    public uploadFile = async (fileData: FileData, token: string): Promise<string> => {
        let recordRoute = `${this.library}/${this.uploadFolderPath}`;
        let url = `${this.appWebUrl}/_api/web/GetFolderByServerRelativePath(decodedUrl='${recordRoute}')/Files/AddUsingPath(decodedurl='${encodeURIComponent(fileData.dpFileName)}')`;
        let output: string = "";
        await this.spClient({
            url: url,
            method: "POST",
            file: fileData.file,
            fileLength: fileData.fileLength,
            token: token,
        }).then((response) => {
            // console.log(response);
            // output = (response as any).d.ServerRelativeUrl;
        })
        return output;
    }
    public removeFolder = async (path: string, folderName: string, token: string): Promise<boolean> => {
        let success = false;
        await new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest();
            let url = this.appWebUrl + `/_api/Web/GetFolderByServerRelativePath(decodedUrl='${path}/${encodeURIComponent(folderName)}')`;
            xhr.open("POST", url);
            xhr.setRequestHeader("If-Match", "*");
            xhr.setRequestHeader("X-HTTP-Method", "DELETE");
            xhr.setRequestHeader("Authorization", `Bearer ${token}`);
            xhr.onload = async function () {
                if (xhr.status == 200) {
                    // console.log("SUCCESS DELETE!");
                    success = true;
                    resolve("");
                } else {
                    console.log(xhr.status);
                    console.log(xhr.response);
                    reject("");
                }
            }
            xhr.onerror = function () {
                reject("onerror");
            }
            xhr.send();
        })
        return success;
    }
    public removeFile = async (path: string, fileName: string, token: string): Promise<boolean> => {
        let success = false;
        await new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest();
            let encodedUrl = this.appWebUrl + `/_api/Web/GetFileByServerRelativePath(decodedUrl='${path}/${encodeURIComponent(fileName)}')`;
            xhr.open("POST", encodedUrl);
            xhr.setRequestHeader("If-Match", "*");
            xhr.setRequestHeader("X-HTTP-Method", "DELETE");
            xhr.setRequestHeader("Authorization", `Bearer ${token}`);
            xhr.onload = async function () {
                if (xhr.status == 200) {
                    // console.log("SUCCESS DELETE!");
                    success = true;
                    resolve("");
                } else if (xhr.status == 404) {
                    console.log("[Info] file does not exist, clear crm field value.");
                    success = true;
                    resolve("");
                } else {
                    console.log(xhr.status);
                    console.log(xhr.response);
                    reject("");
                }
            }
            xhr.onerror = function () {
                reject("onerror");
            }
            xhr.send();
        })
        return success;
    }

    public getFileBlob = async (path: string, fileName: string, token: string): Promise<Blob | null> => {
        return await new Promise((resolve) => {
            let encodedUrl = `${this.appWebUrl}/_api/web/GetFileByServerRelativePath(decodedurl='${path}/${encodeURIComponent(fileName)}')/$value`;
            let xhr = new XMLHttpRequest();
            xhr.onload = async function () {
                if (xhr.status == 200) {
                    const result = await xhr.response;
                    resolve(new Blob([result]));
                }
                else {
                    const result = await xhr.response;
                    resolve(new Blob([result]));
                }
            };
            xhr.onerror = function () {
                console.log("ERROR");
            }
            xhr.open("GET", encodedUrl);
            xhr.setRequestHeader("Accept", "application/json; odata=verbose");
            xhr.setRequestHeader("Content-type", "application/json; odata=verbose");
            xhr.setRequestHeader("Authorization", `Bearer ${token}`);
            xhr.responseType = "blob";
            xhr.send();
        })
    }

    public downloadFile = (blob: Blob): string => {
        return URL.createObjectURL(blob);
    }
}