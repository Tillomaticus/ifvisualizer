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

    // Register the command to open the if condition visualizer
    const disposable = vscode.commands.registerCommand('ifvisualizer.visualizeIfConditions', async () => {
        // Get the currently open document
        const editor = vscode.window.activeTextEditor;

		// Check if language is CSharp
        if (editor && editor.document.languageId === 'csharp') {

            // Extract the text content of the document
            const text = editor.document.getText();
            const conditions = extractIfConditions(text); // Extract if conditions using the regex

            // Create and show the webview with the conditions
            createWebviewPanel(conditions);
        } else {
            vscode.window.showInformationMessage('Please open a C# file to visualize if conditions.');
        }
    });

    context.subscriptions.push(disposable);
}


// This method is called when your extension is deactivated
export function deactivate() {}
