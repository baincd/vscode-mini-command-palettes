import * as vscode from 'vscode';
import { MiniCommandPaletteItem, PaletteConfigs } from './types';

const SETTINGS_PREFIX = "baincd.mini-command-palettes";
const PALETTE_COMMANDS_PREFIX = "baincd.mini-command-palettes.cmds";

export function activate(context: vscode.ExtensionContext) {
	reload();
}

function reload() {
	const configs = getPaletteConfigs();

	for (const paletteName in unproxy(configs)) {
		vscode.commands.registerCommand(PALETTE_COMMANDS_PREFIX + "." + paletteName, () => showPalette(paletteName));
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
