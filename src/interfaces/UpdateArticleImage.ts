export enum ArticleImageAction {
    ADD = 'add',
    REMOVE = 'remove',
    PIN = 'pin'
}

export interface UpdateArticleImage {
    name: string;
    url: string;
    action: ArticleImageAction;
}