import * as vscode from 'vscode';
import { MiniCommandPaletteItem, PaletteConfigs } from './types';

export function activate(context: vscode.ExtensionContext) {
	reload();
}

function reload() {
	const configs = getPaletteConfigs();

	for (const paletteName in unproxy(configs)) {
		vscode.commands.registerCommand("baincd.mini-command-palettes.cmds." + paletteName, () => showPalette(paletteName));
	}
}

function showPalette(paletteName: string) {
	const configs = getPaletteConfigs();

	vscode.window.showQuickPick(configs[paletteName]).then( (selected) => {
		if (selected) {
			vscode.commands.executeCommand(selected.command, ...(selected.commandArgs || []));
		}
	});
}

function getPaletteConfigs() {
	return vscode.workspace.getConfiguration("baincd.mini-command-palettes").get("paletteConfigs") as PaletteConfigs;
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
