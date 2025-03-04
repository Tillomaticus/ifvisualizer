// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';


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

// Create the webview panel to display if conditions
function createWebviewPanel(conditions: string[]) {
	const panel = vscode.window.createWebviewPanel(
		'ifConditionVisualizer',
		'If Condition Visualizer',
		vscode.ViewColumn.One,
		{}
	);

	// Set the content of the webview with HTML and the extracted conditions
	panel.webview.html = `
    <html>
        <body>
            <h1>Visualize If Conditions</h1>
            <ul>
                ${conditions.map(cond => `<li>${cond}</li>`).join('')}
            </ul>
        </body>
    </html>`;
}

// This method is called when your extension is activated
export function activate(context: vscode.ExtensionContext) {

	console.log("Activated ");
	// Register the 'visualizeMarkedIfCondition' command
	const visualizeDisposable = vscode.commands.registerCommand('ifvisualizer.visualizeMarkedIfCondition', () => {
		const editor = vscode.window.activeTextEditor;
		if (editor) {
			const selection = editor.selection;
			const selectedText = editor.document.getText(selection);
			
			const conditions = extractIfConditions(selectedText); // Extract if conditions using the regex

			// Check if the selected text is an 'if' condition and visualize it
			if (selectedText.includes('if')) {
				createWebviewPanel(conditions);
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
				createWebviewPanel(conditions);
			} else {
				vscode.window.showWarningMessage('No if conditions found in this file!');
			}
		}
	});

	context.subscriptions.push(visualizeDisposable, visualizeAllDisposable);
}



// This method is called when your extension is deactivated
export function deactivate() { }
