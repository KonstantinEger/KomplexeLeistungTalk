class DrawingBoard {
  private _width: number;
  private _height: number;
  private _canvasElement: HTMLCanvasElement;
  private _parentElement: HTMLElement;
  private _ctx: CanvasRenderingContext2D;
  private _cells: Array<Array<boolean>>;
  private _drawingListeners: Array<() => void>;

  constructor(parent?: HTMLElement) {
    this._width = 200;
    this._height = 200;
    this._drawingListeners = [];

    if (!parent) {
      parent = document.body;
    }

    this._canvasElement = document.createElement('canvas');
    this._canvasElement.width = this._width;
    this._canvasElement.height = this._height;
    this._ctx = this._canvasElement.getContext('2d');

    this._parentElement = parent;
    this._parentElement.appendChild(this._canvasElement);

    this._cells = [];
    for (let i = 0; i < 24; i++) {
      this._cells[i] = [];
      for (let j = 0; j < 24; j++) {
        this._cells[i][j] = false;
      }
    }
    // initial draw
    this.draw(false);
  }

  public reset(): void {
    for (let i = 0; i < 24; i++) {
      for (let j = 0; j < 24; j++) {
        this._cells[i][j] = false;
      }
    }
    this.draw();
  }

  private draw(callListeners?: boolean): void {
    if (callListeners === undefined) callListeners = true;
    if (callListeners === true) {
      for (let l of this._drawingListeners) {
        l();
      }
    }
    this._ctx.fillStyle = 'black';
    this._ctx.fillRect(0, 0, this._width, this._height);

    this._ctx.fillStyle = 'white';
    for (let i = 0; i < 24; i++) {
      for (let j = 0; j < 24; j++) {
        if (this._cells[i][j] === true) {
          const x = i * (this._width / 24);
          const y = j * (this._height / 24);
          this._ctx.fillRect(x, y, this._width / 24, this._height / 24);
        }
      }
    }
  }

  public onDraw(listener: () => void): void {
    this._drawingListeners.push(listener);
  }

  public displayPicture(data: DataObject): void {
    this.reset();
    for (let i = 0; i < 24; i++) {
      for (let j = 0; j < 24; j++) {
        if (data.grid[i][j] === 255) {
          this._cells[i][j] = true;
        }
      }
    }
    this.draw();
  }

  public exportCellsAsArray(): number[] {
    const res: number[] = [];
    for (let i = 0; i < 24; i++) {
      for (let j = 0; j < 24; j++) {
        res.push(this._cells[i][j] === true ? 255 : 0);
      }
    }
    return res;
  }

  public enableDrawingMode(): void {
    this.reset();

    const onDrag = (callback: (e: MouseEvent) => void) => {
      const handleMouseMove = ($e: MouseEvent) => {
        callback($e);
      };
      const handleMouseUp = () => {
        this._canvasElement.removeEventListener('mousemove', handleMouseMove);
      };
      const handleMouseDown = () => {
        this._canvasElement.addEventListener('mousemove', handleMouseMove);
        this._canvasElement.addEventListener('mouseup', handleMouseUp);
      };

      this._canvasElement.addEventListener('mousedown', handleMouseDown);
    };

    onDrag($e => {
      const [x, y] = (() => {
        // @ts-ignore
        const c: { left: number; top: number } = $e.target.getBoundingClientRect();
        const x = $e.clientX - c.left;
        const y = $e.clientY - c.top;
        return [Math.round(x), Math.round(y)];
      })();

      for (let i = 0; i < 24; i++) {
        for (let j = 0; j < 24; j++) {
          const cw = this._width / 24;
          const ch = this._height / 24;
          const ccx = i * cw + cw / 2;
          const ccy = j * ch + ch / 2;
          const dist = (x1: number, y1: number, x2: number, y2: number): number => {
            const a = Math.abs(x1 - x2);
            const b = Math.abs(y1 - y2);
            return Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
          };
          if (dist(x, y, ccx, ccy) < 15) {
            this._cells[i][j] = true;
          }
        }
      }
      this.draw();
    });
  }
}

interface DataObject {
  grid: Array<Array<0 | 255>>;
  label: number;
}

export { DrawingBoard };
