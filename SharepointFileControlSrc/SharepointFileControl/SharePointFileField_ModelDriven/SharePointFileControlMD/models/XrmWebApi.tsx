export class IXrmWebApiProps {
    clientUrl: string;
}
export class XrmWebApi {
    clientUrl: string;
    constructor(props: IXrmWebApiProps) {
        this.clientUrl = props.clientUrl;
    }
    retrieveRecords = (entityName: string, query: string | null): Promise<any> => {
        return new Promise<any>((resolve, reject) => {
            const url = this.clientUrl + `/api/data/v9.2/${entityName}/` + (query ?? "");
            const request = new XMLHttpRequest();
            request.open("GET", url, true);
            this.setupRequestHeader(request);
            this.setupRetrieveStateChange(request, resolve, reject);
            request.send();
        })
    }
    updateRecord = (entityName: string, id: string, data: any = {}): Promise<string> => {
        return new Promise<string>((resolve, reject) => {
            const url = this.clientUrl + `/api/data/v9.2/${entityName}(${id})`;
            const request = new XMLHttpRequest();
            request.open("PATCH", url, true);
            this.setupRequestHeader(request);
            this.setupUpdateStateChange(request, resolve, reject);
            request.send(JSON.stringify(data));
        })
    }
    private setupRetrieveStateChange(request: XMLHttpRequest, resolve: (value: any | PromiseLike<any>) => void, reject: (reason?: any) => void) {
        request.onreadystatechange = function () {
            if (this.readyState !== 4) return;
            request.onreadystatechange = null;

            if (this.status !== 200) {
                reject("request fails.");
                return;
            }

            try {
                const result = JSON.parse(this.responseText);
                resolve(result);
            }
            catch (err) {
                console.log("request.responseText:")
                console.log(this.responseText)
                reject("JSON.parse fails.");
            }
        };
    }
    private setupUpdateStateChange(request: XMLHttpRequest, resolve: (value: string | PromiseLike<string>) => void, reject: (reason?: any) => void) {
        request.onreadystatechange = function () {
            if (this.readyState !== 4) return;
            request.onreadystatechange = null;

            if (this.status !== 204) {
                reject("request fails.");
                return;
            }

            resolve("success");
        };
    }
    private setupRequestHeader(request: XMLHttpRequest) {
        request.setRequestHeader("Accept", "application/json");
        request.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        request.setRequestHeader("OData-MaxVersion", "4.0");
        request.setRequestHeader("OData-Version", "4.0");
    }
}