import * as vscode from 'vscode';

export interface MiniCommandPaletteItem extends vscode.QuickPickItem {
    command: string,
    commandArgs?: any[]
}

export interface PaletteConfigs {
    [key: string]: MiniCommandPaletteItem[];
}
