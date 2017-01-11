import { IntegratedTerminalTask, ShellArgOptions, ShellOptions, PlatformObject } from './IntegratedTerminalTask';
'use strict';

export interface PlatformObject<T> {
    default?: T;
    windows?: T;
    mac?: T;
    linux?: T;
}

export interface ShellArgOptions extends PlatformObject<string[]> {

}

export interface ShellOptions extends PlatformObject<string> {
    args?: ShellArgOptions
}

export interface IntegratedTerminalTask {
    cmd: string | PlatformObject<string>;
    args?: string[] | PlatformObject<string[]>;
    shellOptions?: ShellOptions;
    stealFocus?: boolean;
}

export interface IntegratedTerminalTaskMap {
    [key: string]: IntegratedTerminalTask;
}