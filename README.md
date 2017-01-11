# integrated-terminal-tasks README

This extension allows a workspace to define specific tasks that should be ran in VSCode's interactive terminal

## Features

In order to use this application, create a configuration file in your .vscode directory. This file will define the available tasks.

For example, it could look something like:
```
{
    "Task Name": {
        "cmd": "ps",            // The command you'd like to run in the terminal
        "args": ["-a"],         // Array of string arguments to the command
        "stealFocus": true,     // If this is true, focus will jump to the terminal right away
        "shellOptions": {}      // This allows you to override the default shell options described below for this specific task.
    },
    "Task 2:" {
        "cmd": {                // cmd and args can also vary based on platform, just like default shell.
            "default": "vi",
            "mac": "nano",
            "linux": "emacs"
        },
        "args": {
            "default": []
            "mac": ["-B"]
        }
    }
}
```

## Extension Settings

This extension contributes the following settings:

* `integratedTerminalTasks.taskFileName`: Name of the configuration file in the .vscode directory to read for tasks. Defaults to `integrated-terminal-tasks.json`
* `integratedTerminalTasks.defaultShell`: This object configures the default shells to be used if the task does not override it. By default, the only configured property is to set the default shell to `sh`.

This object has the following properties
```
{
    "default": "sh",        // The shell to use if no OS-specific override is detected.
    "mac": "bash",
    "windows:" "cmd.exe",
    "linux": "zsh",
    "args": {               // Arguments to append to the shell if no task-specific override is used.
        "default": "",      // Arguments to use if no OS-specific override is detected.
        "mac": "",
        "windows": ""
        "linux": ""
    }
}
```

## Release Notes

### 1.1.0

Adds multi-platform support for task's cmd/args

### 1.0.0

Initial release of Integrated Terminal Tasks
