export class Games {
    id?: number;
    name: string;
    published : string;

    constructor(name: string, published: string) {
        this.name = name;
        this.published = published;
    }
}
