
type ColumnType = { maxLength: number } | (new () => Date); //For testing 

interface Column<TName = string, TOwnerName = string> {
    name: TName;
    tableName : TOwnerName;
    column: ColumnType;
    toString(): string;

}

interface Table<TName, TColumns extends { [name: string]: Column }> {
    name: TName;
    toString(): string;
    columns: TColumns
}

function table<TTableName extends string, TColumns extends { [name: string]: ColumnType }>(tableName: TTableName, columnTypes: TColumns) :  Table<TTableName, { [P in keyof TColumns] : Column<P, TTableName>}> {
    let columns :{ [P in keyof TColumns] : Column<P, TTableName>} = {} as any;
    for(let key of Object.getOwnPropertyNames(columnTypes)) {
        columns[key] = {
            name: key, 
            toString : () => key,
            column: columnTypes[key],
            tableName: tableName
        }
    }

    return {
        name: tableName,
        toString: () => tableName,
        columns
    };
}

class From1<TTableName extends string, TColumns  extends { [name: string] : Column }> {
    private table: Table<TTableName, TColumns>
    private columns: Column<keyof TColumns, TTableName>[]

    constructor(table: Table<TTableName, TColumns>) {
        this.table = table
    }

    public Print() {
        console.log("Table:", this.table.toString())
        this.columns.forEach((column, idx) => {
            console.log("Column", idx + ":", column.toString())
        })
    }
    public Select<TColumnName extends keyof TColumns>(...columns: Column<TColumnName, TTableName>[]) {
        this.columns = columns
        return this
    }

}

function From<TTableName extends string, TColumns  extends { [name: string] : Column<string> }>(table: Table<TTableName, TColumns>) {
    return new From1(table)
}

const Actor = table("Actor", {
    FirstName: { maxLength: 50 },
    LastName: { maxLength: 50 },
    BirthDate: Date
});

const Film = table("Actor", {
    FilmTitle: { maxLength: 50 },
    Rating:{ maxLength: 50 },
});

const A = Actor.columns
const F = Film.columns

From(Actor)
    // A.FirstName is ok, F.FilmTitle fails
    .Select(A.FirstName, A.LastName)
    .Print()






