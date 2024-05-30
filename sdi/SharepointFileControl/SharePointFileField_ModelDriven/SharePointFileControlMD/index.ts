import { IInputs, IOutputs } from "./generated/ManifestTypes";
import { FieldComponent, IFieldComponentProps } from "./FieldComponent";
import * as React from "react";

export class SharePointFileControlMD implements ComponentFramework.ReactControl<IInputs, IOutputs> {
    private theComponent: ComponentFramework.ReactControl<IInputs, IOutputs>;
    private notifyOutputChanged: () => void;
    private context: ComponentFramework.Context<IInputs>;
    private props: IFieldComponentProps;
    private theField: React.ReactElement;

    constructor() { }

    public init(
        context: ComponentFramework.Context<IInputs>,
        notifyOutputChanged: () => void,
        state: ComponentFramework.Dictionary
    ): void {
        this.notifyOutputChanged = notifyOutputChanged;
        this.props = {
            context: context,
            fileName: context.parameters.fileName.raw || "",
            duplicateDetect: context.parameters.duplicateDetect.raw || undefined,
            getOutput: this.updateField,
        };
        this.theField = React.createElement(FieldComponent, this.props)
    }

    public updateView(context: ComponentFramework.Context<IInputs>): React.ReactElement {
        this.props = {
            context: context,
            fileName: context.parameters.fileName.raw || "",
            duplicateDetect: context.parameters.duplicateDetect.raw || undefined,
            getOutput: this.updateField,
        };
        this.theField = React.createElement(FieldComponent, this.props)
        return this.theField;
    }

    public getOutputs(): IOutputs {
        return {
            fileName: this.props.fileName,
            duplicateDetect: this.props.duplicateDetect,
        };
    }

    public destroy(): void {
        // Add code to cleanup control if necessary
    }

    private updateField = (fileName: string, dpFileName: string | undefined): void => {
        this.props.fileName = fileName;
        this.props.duplicateDetect = dpFileName || undefined;
        this.notifyOutputChanged();
    }
}
