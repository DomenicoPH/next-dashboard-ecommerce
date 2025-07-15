export enum ArticleImageAction {
    ADD = 'add',
    REMOVE = 'remove',
}

export interface UpdateArticleImage {
    name: string;
    url: string;
    action: ArticleImageAction;
}