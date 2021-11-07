import * as vscode from 'vscode';
import { MiniCommandPaletteItem, PaletteConfigs } from './types';

const SETTINGS_PREFIX = "baincd.mini-command-palettes";
const PALETTE_COMMANDS_PREFIX = "baincd.mini-command-palettes.cmds";

let registeredCommandDisposables: vscode.Disposable[] = [];

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push({ dispose: disposeRegisteredCommands});
	reload();
	vscode.workspace.onDidChangeConfiguration(e => {
        if (e.affectsConfiguration(SETTINGS_PREFIX)) {
            reload();
        }
    },null,context.subscriptions);
}

function disposeRegisteredCommands() {
	registeredCommandDisposables.forEach(d => d.dispose());
	registeredCommandDisposables = [];
}

function reload() {
	disposeRegisteredCommands();

	const configs = getPaletteConfigs();

	for (const paletteName in unproxy(configs)) {
		const cmd = vscode.commands.registerCommand(PALETTE_COMMANDS_PREFIX + "." + paletteName, () => showPalette(paletteName));
		registeredCommandDisposables.push(cmd);
	}
}

function showPalette(paletteName: string) {
	const configs = getPaletteConfigs();

	const cmdPalette = configs[paletteName];
	const cmds = cmdPalette.commands.filter(c => !c.showWhen?.extensionEnabled || vscode.extensions.getExtension(c.showWhen?.extensionEnabled) );

	vscode.window.showQuickPick(cmds, cmdPalette).then( (selected) => {
		if (selected) {
			vscode.commands.executeCommand(selected.command, ...(selected.commandArgs || []));
		}
	});
}

function getPaletteConfigs() {
	return vscode.workspace.getConfiguration(SETTINGS_PREFIX).get("paletteConfigs") as PaletteConfigs;
}

function unproxy(original: any): any {
	if (typeof original != "object") {
		return original;
	} else {
		const unproxied: { [key: string]: any; } = {};
		Object.keys(original).forEach(originalKey => {
			unproxied[originalKey] = unproxy(original[originalKey]);
		});
		return unproxied;
	}
}
