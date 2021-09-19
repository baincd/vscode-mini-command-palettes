import * as vscode from 'vscode';
import { MiniCommandPaletteItem, PaletteConfigs } from './types';

export function activate(context: vscode.ExtensionContext) {
	vscode.window.showErrorMessage("Activated!");

	const configs = vscode.workspace.getConfiguration("baincd.mini-command-palettes").get("paletteConfigs") as PaletteConfigs;

	for (const paletteName in unproxy(configs)) {
			vscode.commands.registerCommand("baincd.mini-command-palettes.cmds." + paletteName, () => showPalette(paletteName));
	}

}

function showPalette(paletteName: string) {
	const configs = vscode.workspace.getConfiguration("baincd.mini-command-palettes").get("paletteConfigs") as PaletteConfigs;
	vscode.window.showQuickPick(configs[paletteName]).then( (selected) => {
		if (selected) {
			vscode.commands.executeCommand(selected.command, ...(selected.commandArgs || []));
		}
	});
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
