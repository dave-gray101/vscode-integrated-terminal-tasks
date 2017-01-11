'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { workspace, commands, ExtensionContext, window, Uri, FileSystemWatcher, Disposable } from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';
import { IntegratedTerminalTask, IntegratedTerminalTaskMap, ShellOptions } from './IntegratedTerminalTask';

let taskMap: IntegratedTerminalTaskMap = {};
let iTTFileWatcher: FileSystemWatcher = null;
let iTTConfigurationWatcher: Disposable = null;
let defaultShell: string 
let defaultShellArgs: string[] = [];

function getWorkspaceConfigLocation(configFileName) {
    const { rootPath } = workspace;
    return rootPath
        ? path.join(rootPath, '.vscode', configFileName)
        : undefined;
}

function loadTaskMap(configFile: Uri) {
    const tasks = workspace.openTextDocument(configFile).then((data) => {
        taskMap = JSON.parse(data.getText());
    }, (reason) => {
        window.showErrorMessage(`Error: ${reason}`);
        taskMap = {};
    });
};

function configure() {

    if(iTTFileWatcher) {
        iTTFileWatcher.dispose();
    }

    const config = workspace.getConfiguration('integratedTerminalTasks');

    defaultShell = config.get<string>('defaultShell.default');
    switch (os.platform()) {
        case "darwin":
            defaultShell = config.get<string>('defaultShell.mac') || defaultShell;
            break;
        case "linux":
            defaultShell = config.get<string>('defaultShell.linux') || defaultShell;
            break;
        case "win32":
            defaultShell = config.get<string>('defaultShell.windows') || defaultShell;
            break;
    }
    defaultShellArgs = config.get<string[]>('defaultShell.args.default');
    switch (os.platform()) {
        case "darwin":
            defaultShell = config.get<string>('defaultShell.args.mac') || defaultShell;
            break;
        case "linux":
            defaultShell = config.get<string>('defaultShell.args.linux') || defaultShell;
            break;
        case "win32":
            defaultShell = config.get<string>('defaultShell.args.windows') || defaultShell;
            break;
    }
    const taskFileName: string = config.get<string>('taskFileName');

    loadTaskMap(Uri.file(getWorkspaceConfigLocation(taskFileName)));

    iTTFileWatcher = workspace.createFileSystemWatcher(getWorkspaceConfigLocation(taskFileName));
    iTTFileWatcher.onDidChange((watchedFile) => {
        loadTaskMap(watchedFile);
    });
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: ExtensionContext) {

    configure();

    iTTConfigurationWatcher = workspace.onDidChangeConfiguration(() => {
        configure();
    });

    let disposable = commands.registerCommand('integratedTerminalTasks.pick', () => {
        
        window.showQuickPick(Object.keys(taskMap)).then((selected: string) => {
            const task = taskMap[selected];
            if (task) {
                let shell = defaultShell;
                let shellArgs = defaultShellArgs;
                if (task.shellOptions) {
                    shell = task.shellOptions.default || shell;
                    switch (os.platform()) {
                        case "darwin":
                            shell = task.shellOptions.mac || shell;
                            break;
                        case "linux":
                            shell = task.shellOptions.linux || shell;
                            break;
                        case "win32":
                            shell = task.shellOptions.windows || shell;
                            break;
                    }
                    if (task.shellOptions.args) {
                        shellArgs = task.shellOptions.args.default || shellArgs;
                        switch (os.platform()) {
                            case "darwin":
                                shellArgs = task.shellOptions.args.mac || shellArgs;
                                break;
                            case "linux":
                                shellArgs = task.shellOptions.args.linux || shellArgs;
                                break;
                            case "win32":
                                shellArgs = task.shellOptions.args.windows || shellArgs;
                                break;
                        }
                    }
                }
                const terminal = window.createTerminal(`Integrated Terminal Task - ${selected}`, shell, shellArgs);
                terminal.show(! task.stealFocus);
                let cmd: string;
                let cmdArgs: string[];
                if (typeof task.cmd === 'string') {
                    cmd = task.cmd;
                } else {
                    cmd = task.cmd.default;
                    switch (os.platform()) {
                        case "darwin":
                            cmd = task.cmd.mac || cmd;
                            break;
                        case "linux":
                            cmd = task.cmd.linux || cmd;
                            break;
                        case "win32":
                            cmd = task.cmd.windows || cmd;
                            break;
                    }
                }
                if (task.args instanceof Array) {
                    cmdArgs = task.args;
                } else {
                    cmdArgs = task.args.default;
                    switch (os.platform()) {
                        case "darwin":
                            cmdArgs = task.args.mac || cmdArgs;
                            break;
                        case "linux":
                            cmdArgs = task.args.linux || cmdArgs;
                            break;
                        case "win32":
                            cmdArgs = task.args.windows || cmdArgs;
                            break;
                    }
                }
                terminal.sendText([cmd, ...(cmdArgs? cmdArgs : [])].join(' '), true);
            }
        })
    });

    context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
    iTTFileWatcher.dispose();
    iTTConfigurationWatcher.dispose();
}