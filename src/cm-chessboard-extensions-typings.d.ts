// cm-chessboard-extensions-typings.d.ts

declare module '@lib/cm-chessboard/src/extensions/markers/markers' {
    export class Markers {
        constructor(options?: any);

        addMarker(square: string, type: any): void;
        removeMarker(square: string, type: any): void;
    }
    export const MARKER_TYPE: any;
}

declare module '@lib/cm-chessboard/src/extensions/arrows/arrows' {
    export class Arrows {
        constructor(options?: any);
        // Métodos específicos de Arrows
        addArrow(fromSquare: string, toSquare: string, type?: any): void;
        removeArrow(fromSquare: string, toSquare: string, type?: any): void;
    }
    export const ARROW_TYPE: any;
}

declare module '@lib/cm-chessboard/src/extensions/promotion-dialog/PromotionDialog' {
    export class PromotionDialog {
        constructor(options?: any);
        // Métodos específicos de PromotionDialog
        show(square: string, color: 'w' | 'b', pieceSet: string): Promise<string>;
    }
}
