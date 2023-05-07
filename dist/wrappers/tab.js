export class Tab {
    name;
    component;
    constructor({ ...args }) {
        this.name = args.name;
        this.component = args.component;
    }
}
