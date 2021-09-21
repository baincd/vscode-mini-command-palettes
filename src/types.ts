import * as vscode from 'vscode';

export interface PaletteConfigs {
    [key: string]: PaletteConfig;
}

export interface PaletteConfig extends vscode.QuickPickOptions {
    commands: MiniCommandPaletteItem[];
}

export interface MiniCommandPaletteItem extends vscode.QuickPickItem {
    command: string,
    commandArgs?: any[]
}
