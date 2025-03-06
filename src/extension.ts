// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';



// Function to extract if conditions from a C# file
function extractIfConditions(text: string): string[] {
	const regex = /if\s*\((.*?)\)/g; // Simple regex to match if conditions (for simplicity)
	let conditions: string[] = [];
	let match: RegExpExecArray | null;
	while ((match = regex.exec(text)) !== null) {
		conditions.push(match[1].trim()); // Add the condition part of the if statement
	}
	return conditions;
}

let existingPanel: vscode.WebviewPanel | undefined = undefined;

function createWebviewPanel(conditions: string[], context: vscode.ExtensionContext) {

	if (existingPanel) {
		// If it exists, update the content
		existingPanel.webview.html = getWebviewContent(conditions, context);
		existingPanel.reveal(vscode.ViewColumn.One); // Reveal the panel if it's hidden
		return;
	}

	const panel = vscode.window.createWebviewPanel(
		'ifVisualizer',
		'Visualize If Conditions',
		vscode.ViewColumn.One,
		{ enableScripts: true }
	);

	// Store the panel for future reuse
	existingPanel = panel;

	// Set the content of the webview
	panel.webview.html = getWebviewContent(conditions, context);
	// Send the conditions data to the webview
	panel.webview.postMessage({ conditions });

	// Clean up when the panel is closed
	panel.onDidDispose(() => {
		existingPanel = undefined;
	});
}

function getWebviewContent(conditions: string[], context: vscode.ExtensionContext): string {
	const htmlPath = path.join(context.extensionPath, 'media', 'webview.html');
	let htmlContent = fs.readFileSync(htmlPath, 'utf8');

	// Generate the cssUri within the function, where panel is available
	const cssUri = vscode.Uri.file(path.join(context.extensionPath, 'media', 'styles.css'));


	const conditionsList = conditions.map(cond => `<li>${cond}</li>`).join('');
	htmlContent = htmlContent.replace('{{conditionsList}}', conditionsList);
	htmlContent = htmlContent.replace('{{cssUri}}', cssUri.toString());

	return htmlContent;
}


// This method is called when your extension is activated
export function activate(context: vscode.ExtensionContext) {

	console.log("Activated");

	// Register the 'visualizeMarkedIfCondition' command
	const visualizeDisposable = vscode.commands.registerCommand('ifvisualizer.visualizeMarkedIfCondition', () => {
		const editor = vscode.window.activeTextEditor;
		if (editor) {
			const selection = editor.selection;
			const selectedText = editor.document.getText(selection);

			const conditions = extractIfConditions(selectedText); // Extract if conditions using the regex

			// Check if the selected text is an 'if' condition and visualize it
			if (selectedText.includes('if')) {
				createWebviewPanel(conditions, context);
			} else {
				vscode.window.showWarningMessage('Selected text is not an if condition!');
			}
		}
	});


	// Register the 'visualizeAllIfConditions' command
	const visualizeAllDisposable = vscode.commands.registerCommand('ifvisualizer.visualizeAllIfConditions', () => {
		const editor = vscode.window.activeTextEditor;
		if (editor) {
			const text = editor.document.getText();
			const regex = /\bif\s*\(.*\)/g; // A simple regex to match "if" conditions
			const matches = [...text.matchAll(regex)];

			if (matches.length > 0) {
				const conditions = extractIfConditions(matches.toString()); // Extract if conditions using the regex
				createWebviewPanel(conditions, context);
			} else {
				vscode.window.showWarningMessage('No if conditions found in this file!');
			}
		}
	});

	context.subscriptions.push(visualizeDisposable, visualizeAllDisposable);
}



// This method is called when the extension is deactivated
export function deactivate() { }