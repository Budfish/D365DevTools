import * as React from 'react';
import { IInputs } from "./generated/ManifestTypes";
import { Label, List } from '@fluentui/react';
import Dropzone from "react-dropzone";
import { useDropzone, Accept } from 'react-dropzone';
import { SharePointService, spbuild, FileData } from './models/SharePointService';
import { XrmWebApi, IXrmWebApiProps } from './models/XrmWebApi';
import { EnvSetting } from './EnvSetting';

const mimeMap: Map<string, string> = new Map([
  ["jpg", "image/jpeg"],
  ["jpeg", "image/jpeg"],
  ["jpe", "image/jpeg"],
  ["png", "image/png"],
  ["pdf", "application/pdf"],
  ["txt", "text/plain"],
  ["gif", "image/gif"],
])

export interface FileInfo {
  fileName: string;
  fileType: string;
  mimeType: string | undefined;
}

export interface IFieldComponentProps {
  context: ComponentFramework.Context<IInputs>;
  fileName: string;
  duplicateDetect: string | undefined;
  getOutput: (fileName: string, dpFileName: string | undefined) => void;
}

export class FieldComponent extends React.Component<IFieldComponentProps> {
  spService: SharePointService;
  clientUrl: string = EnvSetting.clientUrl;
  domain: string = EnvSetting.domain;
  site: string = EnvSetting.site;
  appWebUrl: string = this.domain + "/sites/" + this.site;
  library: string = EnvSetting.library;
  entityName: string;
  entityID: string;
  fullPath: string;
  fileName: string;
  isDisabled: boolean;
  fileTypes: string[];

  constructor(props: IFieldComponentProps) {
    super(props);
    this.init(props);
  }
  private init = async (props: IFieldComponentProps): Promise<void> => {
    setUpEntity(this);
    this.setUpEnability(this, props);
    this.setUpFileName(this, props);
    setUpService(this);
    setUpFileType(this);
    await this.spService.refreshToken();
    await this.spService.ensureEntityFolder();

    function setUpEntity(self: FieldComponent) {
      let nullableLookup = props?.context?.parameters?.lookupParent?.raw;
      if (nullableLookup && Array.isArray(nullableLookup)) {
        // with setting parent, direct folder to parent folder
        let parentRecord = nullableLookup[0];
        self.entityName = (parentRecord as any)?.LogicalName ?? "entityName_not_found";
        self.entityID = (parentRecord as any)?.Id._formattedGuid ?? "entityID_not_found";
      } else {
        // with no parent, direct folder to self folder
        self.entityName = (props.context.mode as any)?.contextInfo.entityTypeName ?? "entityName_not_found";
        self.entityID = (props.context as any)?.page.entityId ?? "entityID_not_found";
      }
    }
    function setUpService(self: FieldComponent) {
      const webApiProps = new IXrmWebApiProps();
      webApiProps.clientUrl = self.clientUrl;
      const webApi = new XrmWebApi(webApiProps);

      let param: spbuild = {
        appWebUrl: self.appWebUrl,
        library: self.library,
        entityName: self.entityName,
        entityID: self.entityID,
        WebAPI: webApi,
      }
      self.spService = new SharePointService(param);
    }
    function setUpFileType(self: FieldComponent) {
      const acceptTypeStr = self.props.context.parameters?.acceptType?.raw ?? "";
      self.fileTypes = acceptTypeStr.match(/\.\w+/g) ?? [];
      self.fileTypes = self.fileTypes.map(e => e.replace('.', ''));
    }
  }
  setUpFileName(self: FieldComponent, props: IFieldComponentProps): void {
    self.fullPath = "";
    self.fileName = "";

    self.fullPath = getFullPath();
    self.fileName = getFileName();

    function getFullPath() {
      return props.context.parameters.fileName.raw ?? "";
    }
    function getFileName() {
      if (self.fullPath == "") return "";

      let id = retrieveId();
      let lastSlash = id.lastIndexOf("/");
      if (lastSlash == -1) return "unmatched format";
      return id.substring(lastSlash + 1);

      function retrieveId() {
        const idParamStr = "?id=";
        const parentParamStr = "&parent=";
        let idParamPos = self.fullPath.indexOf(idParamStr);
        let parentParamPos = self.fullPath.indexOf(parentParamStr);
        if (idParamPos == -1 || parentParamPos == -1) { console.log("[SharePoint PCF Error] Unecpected fieldVale: fieldVale has no id or parent parameter"); return ""; }
        return self.fullPath.substring(idParamPos, parentParamPos).replace(idParamStr, "");
      }
    }
  }
  setUpEnability = (self: FieldComponent, props: IFieldComponentProps): void => {
    self.isDisabled = props.context.mode.isControlDisabled;
  }
  onFileDropped = async (acceptedFiles: any, fileRejections: any, event: any): Promise<void> => {
    if (this.isDisabled) return;

    let fileData: FileData = new FileData();
    let isValidFile = validateFileType(this);
    if (!isValidFile) return;
    await ensureSharePointStatus(this);
    await getFileData(this, fileData, acceptedFiles);
    await this.spService.uploadFile(fileData);
    updateOutput(this, fileData);

    function validateFileType(self: FieldComponent) {
      if (acceptedFiles.length == 0) {
        alert(`請上傳${self.fileTypes}類型的檔案。`);
        return false;
      }
      return true;
    }
    async function ensureSharePointStatus(self: FieldComponent) {
      await self.spService.refreshToken();
      await self.spService.ensureEntityFolder();
      await self.spService.ensureRecordFolder();
    }
    async function getFileData(self: FieldComponent, fileData: FileData, acceptedFiles: any) {
      let dpFileName: string; // duplicate file name
      const file = acceptedFiles[0] as File;
      const buffer = await (await file.arrayBuffer());
      const fileLength = buffer.byteLength.toString();
      dpFileName = await self.spService.getDuplicateFileName(file.name);
      fileData.file = file;
      fileData.fileLength = fileLength;
      fileData.dpFileName = dpFileName;
    }
    function updateOutput(self: FieldComponent, fileData: FileData) {
      self.fileName = fileData.dpFileName;
      self.generateFullPath();
      self.props.getOutput(self.fullPath, fileData.file.name);
    }
  }
  generateFullPath = (): void => {
    let parent = `/sites/${this.site}/${this.library}/${this.entityName}/${this.entityID}`;
    let id = `${parent}/${this.fileName}`;

    this.fullPath = `${this.appWebUrl}/${this.library}/Forms/AllItems.aspx?id=${id}&parent=${parent}`;
  }
  removeFile = async (): Promise<void> => {
    let path = `/sites/${this.site}/${this.library}/${this.entityName}/${this.entityID}`;
    let success = await this.spService.removeFile(path, this.fileName);
    if (!success) {
      alert("檔案刪除失敗。無法刪除開啟中的檔案。");
      return;
    }
    this.fileName = "";
    this.props.getOutput(this.fileName, "");
  }
  public render(): React.ReactNode {
    this.setUpEnability(this, this.props);
    this.setUpFileName(this, this.props);
    if (this.fileName != "") {
      return <SharePointLink component={this} />
    }
    if (this.isDisabled) {
      return <DisabledDropZone />
    }
    return <CustomDropZone component={this} acceptTypes={this.fileTypes} />
  }
}

interface ISharePointLinkProps {
  component: FieldComponent;
}
function SharePointLink(props: ISharePointLinkProps) {
  const fileInfo = getFileInfo(props.component.fullPath);
  let buttonStyle = { display: props.component.isDisabled ? "none" : "block" };
  let clickFunction = async (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>): Promise<void> => {
    e.preventDefault();
    await getFileBlob();
    // let link = constructLink(props.component.fullPath);
    // window.open(link, '_blank')?.focus();
  }

  function getFileInfo(fullPath: string): FileInfo {
    const idParamStr = "?id=";
    const parentParamStr = "&parent=";
    let idParamPos = fullPath.indexOf(idParamStr);
    let parentParamPos = fullPath.lastIndexOf(parentParamStr);
    let idValue = fullPath.substring(idParamPos, parentParamPos).replace(idParamStr, "");
    let parentValue = fullPath.substring(parentParamPos).replace(parentParamStr, "");
    const result = idValue.replace(`${parentValue}/`, "").split(/\.(?=[^.]+$)/);
    const output: FileInfo = {
      fileName: result[0],
      fileType: result.length > 1 ? result[1].toLowerCase() : "",
      mimeType: result.length > 1 ? mimeMap.get(result[1].toLowerCase()) : ""
    };
    return output;
  }

  let getFileBlob = async (): Promise<void> => {
    const path = constructPath(props.component.fullPath);
    const blob = await props.component.spService.getFileBlob(path, props.component.fileName);
    if (blob instanceof Blob) {
      if (blob.size > 0) {
        await downloadLink(blob, fileInfo);
      }
      else {
        const alertString = {
          confirmButtonLabel: "好的",
          text: "所選的檔案沒有內容，請重新上傳後再試！",
          title: "錯誤"
        } as ComponentFramework.NavigationApi.AlertDialogStrings;
        showAlertDialog(alertString);
      }
    }
  }

  let previewFile = async (): Promise<void> => {
    const path = constructPath(props.component.fullPath);
    let blob = await props.component.spService.getFileBlob(path, props.component.fileName);
    if (blob instanceof Blob) {
      if (blob.size < 1) {
        const alertString = {
          confirmButtonLabel: "好的",
          text: "所選的檔案沒有內容，請重新上傳後再試！",
          title: "錯誤"
        } as ComponentFramework.NavigationApi.AlertDialogStrings;
        showAlertDialog(alertString);
      }
      if (!fileInfo.mimeType) {
        const alertString = {
          confirmButtonLabel: "好的",
          text: "所選的檔案格式無法預覽，請點選其他的檔案後再試！",
          title: "錯誤"
        } as ComponentFramework.NavigationApi.AlertDialogStrings;
        showAlertDialog(alertString);
      }
      blob = new Blob([blob], { type: fileInfo.mimeType });
      await openLink(blob);
    }
  }

  let showAlertDialog = (alertstring: ComponentFramework.NavigationApi.AlertDialogStrings): void => {
    props.component.props.context.navigation.openAlertDialog(alertstring, { height: 120, width: 260 });
  }

  let BlobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        let base64String = reader.result as string;
        const result = base64String.substr(base64String.indexOf(',') + 1);
        resolve(result);
      }
    })
  }

  let downloadLink = async (blob: Blob, fileInfo: FileInfo): Promise<void> => {
    const link = await props.component.spService.downloadFile(blob);
    const a = document.createElement('a');
    a.href = link;
    a.download = `${fileInfo.fileName}` + (fileInfo.fileType ? `.${fileInfo.fileType}` : "");
    a.click();
  }

  let openLink = async (blob: Blob): Promise<void> => {
    const link = await props.component.spService.downloadFile(blob);
    window.open(link, '_blank');
  }

  let constructPath = (fullPath: string): string => {
    const parentParamStr = "&parent=";
    let parentParamPos = fullPath.lastIndexOf(parentParamStr);
    let parentValue = fullPath.substring(parentParamPos).replace(parentParamStr, "");
    let encodeParentValue = encodeURIComponent(parentValue);
    return encodeParentValue;
  }

  let constructLink = (fullPath: string): string => {
    const idParamStr = "?id=";
    const parentParamStr = "&parent=";
    let idParamPos = fullPath.indexOf(idParamStr);
    let parentParamPos = fullPath.lastIndexOf(parentParamStr);
    let idValue = fullPath.substring(idParamPos, parentParamPos).replace(idParamStr, "");
    let encodeIdValue = encodeURIComponent(idValue);
    let parentValue = fullPath.substring(parentParamPos).replace(parentParamStr, "");
    let encodeParentValue = encodeURIComponent(parentValue);
    let link = fullPath.substring(0, idParamPos) + `${idParamStr}${encodeIdValue}` + `${parentParamStr}${encodeParentValue}`;
    return link;
  }
  return (
    <div className='art_pcf LinkDiv'>
      <a href="/" title={props.component.fileName} className='art_pcf LinkA' onClick={clickFunction}>{props.component.fileName}</a>
      <button className='art_pcf PreviewButton' onClick={previewFile} style={{ display: fileInfo.mimeType ? "block" : "none" }}>預覽</button>
      <button className='art_pcf LinkButton' onClick={props.component.removeFile} style={buttonStyle}>刪除</button>
    </div>
  )
}

function DisabledDropZone() {
  return (
    <section className={"art_pcf DropzoneSection"}>
      <div className='art_pcf DropzoneDiv disabled'>
        <p>Upload File</p>
      </div>
    </section>
  )
}

interface ICustomDropZoneProps {
  component: FieldComponent;
  acceptTypes: string[];
}
function CustomDropZone(props: ICustomDropZoneProps) {
  let accept: Accept | undefined = {};
  for (let type of props.acceptTypes) {
    let typeMime = mimeMap.get(type);
    if (!typeMime) continue;
    accept[typeMime] = [];
  }
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ accept, onDrop: props.component.onFileDropped });

  return (
    <section className='art_pcf DropzoneSection'>
      <div {...getRootProps()}
        className='art_pcf DropzoneDiv active'
        style={{ backgroundColor: isDragActive ? "#c8c8c8" : "#f2f2f2" }}>
        <input {...getInputProps()} />
        <p>Upload File</p>
      </div>
    </section>
  );
}