import { remote } from 'electron';

const isDev = process.env.NODE_ENV === 'development';

export default class Menu {
    constructor({
        onRepositoryOpen = () => {},
    }) {
        this.remote = remote;
        this.window = remote.getCurrentWindow();
        this.onRepositoryOpen = onRepositoryOpen;
        this.create();
    }

    get repositoryTemplate() {
        return {
            label: 'Repository',
            submenu: [
                {
                    label: 'Open Folder',
                    role: 'open',
                    click: async () => {
                        const { canceled, filePaths } = await this.remote.dialog.showOpenDialog(
                            this.window,
                            { properties: ['openDirectory'] },
                        );
                        this.onRepositoryOpen(canceled, filePaths[0]);
                    },
                },
            ],
        };
    }

    get devTemplate() {
        return {
            label: 'Development',
            submenu: [
                {
                    label: 'Toggle Developer Tools',
                    accelerator: 'Alt+Ctrl+I',
                    click: () => {
                        this.window.webContents.toggleDevTools();
                    },
                },
                {
                    label: 'Reload',
                    accelerator: 'Ctrl+R',
                    click: () => {
                        this.window.webContents.reload();
                    },
                },
            ],
        };
    }

    get templates() {
        const templates = [
            this.repositoryTemplate,
            isDev ? this.devTemplate : null,
        ];
        return templates.filter((t) => t !== null);
    }

    create() {
        const menu = this.remote.Menu.buildFromTemplate(this.templates);
        this.remote.Menu.setApplicationMenu(menu);
    }
}
