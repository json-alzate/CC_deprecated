export class DbUpgradeStatements {
    dbPuzzlesUpgrades = [
        {
            toVersion: 1,
            statements: [
                `CREATE TABLE IF NOT EXISTS chesscolate_puzzles (
             id INTEGER PRIMARY KEY AUTOINCREMENT,
             name TEXT NOT NULL,
             active INTEGER DEFAULT 1
             );`
            ]
        }
    ];
}
