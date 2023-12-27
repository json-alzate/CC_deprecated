export interface AppPuzzleThemesGroup {
    groupName: string;
    themes: AppPuzzlesThemes[];
}


export interface AppPuzzlesThemes {
    nameEs: string;
    descriptionEs: string;
    count: number;
    img: string;
    value: string; // Name to send to the DB query
};

export interface Opening {
    name: string;
    value: number;
}

