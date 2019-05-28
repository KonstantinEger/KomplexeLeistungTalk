class Matrix {
  private rows: number;
  private cols: number;
  private data: Array<Array<number>>;

  constructor(rows: number, cols: number, init: (r: number, c: number) => number) {
    this.rows = rows;
    this.cols = cols;
    this.data = [];

    for (let i = 0; i < this.rows; i++) {
      this.data[i] = [];
      for (let j = 0; j < this.cols; j++) {
        this.data[i][j] = init(i, j);
      }
    }
  }

  public static multiply(a: Matrix, b: Matrix) {
    if (a.cols !== b.rows) {
      throw new Error('Cols of "a" must match rows of "b"');
    }
    let res = new Matrix(a.rows, b.cols, () => 0);
    for (let i = 0; i < res.rows; i++) {
      for (let j = 0; j < res.cols; j++) {
        let sum = 0;
        for (let k = 0; k < a.cols; k++) {
          sum += a.data[i][k] * b.data[k][j];
        }
        res.data[i][j] = sum;
      }
    }
    return res;
  }

  public static subtract(a: Matrix, b: Matrix) {
    const res = new Matrix(a.rows, a.cols, () => 0);
    for (let i = 0; i < a.rows; i++) {
      for (let j = 0; j < a.cols; j++) {
        res.data[i][j] = a.data[i][j] - b.data[i][j];
      }
    }
    return res;
  }

  static transpose(matrix: Matrix) {
    let result = new Matrix(matrix.cols, matrix.rows, () => 0);
    for (let i = 0; i < matrix.rows; i++) {
      for (let j = 0; j < matrix.cols; j++) {
        result.data[j][i] = matrix.data[i][j];
      }
    }
    return result;
  }

  public static from1DArray(array: number[]) {
    return new Matrix(array.length, 1, r => array[r]);
  }

  public static to1DArray(matrix: Matrix) {
    let res = [];
    for (let i = 0; i < matrix.rows; i++) {
      for (let j = 0; j < matrix.cols; j++) {
        res.push(matrix.data[i][j]);
      }
    }
    return res;
  }

  public get(row: number, col: number) {
    return this.data[row][col];
  }

  public map(cb: (v: number, r: number, c: number) => number) {
    let res = new Matrix(this.rows, this.cols, (r, c) => this.data[r][c]);
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        res.data[i][j] = cb(res.data[i][j], i, j);
      }
    }
    return res;
  }

  public log() {
    console.table(this.data);
  }

  public static fromOBJ(obj: any) {
    return new Matrix(obj.rows, obj.cols, (r, c) => obj.data[r][c]);
  }
}

export { Matrix };
