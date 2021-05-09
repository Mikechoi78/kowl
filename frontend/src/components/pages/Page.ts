import React from "react";
import { ParsedQuery } from "query-string";
import { uiState } from "../../state/uiState";


//
// Page Types
//
export type PageProps<TRouteParams = Record<string, unknown>> = TRouteParams & { matchedPath: string; query: ParsedQuery; }

export class PageInitHelper {
    set title(title: string) { uiState.pageTitle = title; }
    addBreadcrumb(title: string, to: string) { uiState.pageBreadcrumbs.push({ title: title, linkTo: to }) }
}
export abstract class PageComponent<TRouteParams = Record<string, unknown>> extends React.Component<PageProps<TRouteParams>> {

    constructor(props: Readonly<PageProps<TRouteParams>>) {
        super(props);

        uiState.pageBreadcrumbs = [];

        this.initPage(new PageInitHelper());
    }

    abstract initPage(p: PageInitHelper): void;
}
export type PageComponentType<TRouteParams = Record<string, unknown>> = (new (props: PageProps<TRouteParams>) => PageComponent<PageProps<TRouteParams>>);


