import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';

import { capSQLiteImportOptions, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { SqliteService } from '@services/sqlite.service';
import { SqliteDbnameVersionService } from '@services/sqlite-dbname-version.service';
import { DbUpgradeStatements } from '@services/db/db.upgrade.statements';

import { Puzzle } from '@models/puzzle.model';

@Injectable({
  providedIn: 'root'
})
export class SqliteStorageService {

  public puzzlesList: BehaviorSubject<Puzzle[]> = new BehaviorSubject<Puzzle[]>([]);
  private databaseName = '';
  private dbUpdStmts: DbUpgradeStatements = new DbUpgradeStatements();
  private versionUpgrades;
  private loadToVersion;
  private db!: SQLiteDBConnection;
  private isUserReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private sqliteService: SqliteService,
    private dbVerService: SqliteDbnameVersionService) {
    this.versionUpgrades = this.dbUpdStmts.dbPuzzlesUpgrades;
    this.loadToVersion = this.versionUpgrades[this.versionUpgrades.length - 1].toVersion;
  }
  async initializeDatabase(dbName: string) {
    this.databaseName = dbName;
    // create upgrade statements
    await this.sqliteService
      .addUpgradeStatement({
        database: this.databaseName,
        upgrade: this.versionUpgrades
      });
    // create and/or open the database
    this.db = await this.sqliteService.openDatabase(
      this.databaseName,
      false,
      'no-encryption',
      this.loadToVersion,
      false
    );
    this.dbVerService.set(this.databaseName, this.loadToVersion);

    // TODO: quizá no es necesario
    await this.getPuzzles();
  }
  // Current database state
  userState() {
    return this.isUserReady.asObservable();
  }
  fetchUsers(): Observable<Puzzle[]> {
    return this.puzzlesList.asObservable();
  }

  async loadPuzzles() {
    const puzzles: Puzzle[] = (await this.db.query('SELECT * FROM chesscolate_puzzles;')).values as Puzzle[];
    this.puzzlesList.next(puzzles);
  }
  // CRUD Operations
  async getPuzzles() {
    await this.loadPuzzles();
    this.isUserReady.next(true);
  }
  async addUser(name: string) {
    const sql = `INSERT INTO chesscolate_puzzles (name) VALUES (?);`;
    await this.db.run(sql, [name]);
    await this.getPuzzles();
  }

  async updateUserById(id: string, active: number) {
    const sql = `UPDATE chesscolate_puzzles SET active=${active} WHERE id=${id}`;
    await this.db.run(sql);
    await this.getPuzzles();
  }
  async deleteUserById(id: string) {
    const sql = `DELETE FROM chesscolate_puzzles WHERE id=${id}`;
    await this.db.run(sql);
    await this.getPuzzles();
  }

  async importPuzzlesFromJson(jsonData: capSQLiteImportOptions): Promise<void> {
    try {
      const result = await this.sqliteService.importFromJson(jsonData);
      console.log('Import result:', result.changes?.changes ?? 0);
      await this.getPuzzles(); // refresca lista
    } catch (error) {
      console.error('Error importing puzzles:', error);
    }
  }
}
