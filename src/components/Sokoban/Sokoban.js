import React, { Component } from 'react';
import levels from './levels.json';
import './style.css';

export default class Sokoban extends Component {
    constructor (props) {
        super(props);
        this.blocks = {
            'p': 'red',
            'pe': 'radial-gradient(green, red)',
            '0': 'rgba(0, 0, 0, 0)',
            'b': 'blue',
            'e': 'green',
            'w': 'gray'
        };
        this.levels = levels;
        this.state = {
            lvl: 0,
            levelsState: JSON.parse(JSON.stringify(levels))
        }
    }
    render () {
        const { lvl, levelsState } = this.state;
        const { blocks } = this;

        const parsed = levelsState[lvl] ? levelsState[lvl].map((row, y) =>
            <tr className="board-row" key={ y }>
                {
                    row.map((element, x) => 
                        <td 
                            className="board-row__element" 
                            style={{ background: blocks[element] }} 
                            key={ x }
                        ></td>
                    )
                }
            </tr>
        ) : (
            <tr className="win">
                <td className="board-row__element">
                    WIN!
                </td>
            </tr>
        );

        return (
            <div className="game">
                <div className="options">

                    <div className="btn" onClick={ this.resetLevel.bind(this) }>Reset level</div>
                    <div className="btn" onClick={ this.resetGame.bind(this) }>Reset game</div>
                </div>
                <table className="board" onKeyDown={ levelsState[lvl] ? this.onKeyDown.bind(this) : undefined } tabIndex="0">
                    <tbody className="board-body">
                        { parsed }
                    </tbody>
                </table>
            </div>
        )
    }
    resetLevel () {
        let { lvl, levelsState } = this.state;
        const { levels } = this;
        levelsState[lvl] || lvl--;
        levelsState[lvl] = JSON.parse(JSON.stringify(levels[lvl]));
        return this.setState({
            lvl,
            levelsState
        })
    }
    resetGame () {
        const { levels } = this;
        return this.setState({
            lvl: 0,
            levelsState: JSON.parse(JSON.stringify(levels))
        })
    }
    onKeyDown (event) {
        const code = event.keyCode;
        const { levelsState, lvl } = this.state;

        const level = levelsState[lvl];
        let changed = false;

        const dir = {
            x: 0,
            y: 0
        }

        // arrow-down
        if (code === 40) {
            dir.y = 1;
        }
        // arrow-right
        if (code === 39) {
            dir.x = 1;
        }
        // arrow-top
        if (code === 38) {
            dir.y = -1;
        }
        // arrow-left
        if (code === 37) {
            dir.x = -1;
        }

        for (let y = 0; y < level.length && !changed; y++) {
            for (let x = 0; x < level[y].length && !changed; x++) {
                const [y1, x1, y2, x2] = [
                    y + 1 * dir.y, 
                    x + 1 * dir.x, 
                    y + 2 * dir.y,
                    x + 2 * dir.x
                ];
                if (level[y][x][0] === 'p') {
                    const after = level[y][x][1] || '0';

                    let next = level[y1];
                    if (!next)
                        continue;

                    next = next[x1];
                    if (!next)
                        continue;

                    if (next === '0') {
                        [level[y][x], level[y1][x1]] = [after, 'p'];
                    } else if (next === 'b') {
                        let jumpTwo = level[y2];
                        if (!jumpTwo)
                            continue;

                        jumpTwo = jumpTwo[x2];
                        if (!jumpTwo)
                            continue;

                        if (jumpTwo === '0') {
                            [level[y][x], level[y1][x1], level[y2][x2]] = [after, 'p', 'b'];
                        } else if (jumpTwo === 'e') {
                            return this.setState({
                                levelsState,
                                lvl: lvl + 1
                            })
                        }
                    } else if (next === 'e') {
                        [level[y][x], level[y1][x1]] = [after, 'pe'];
                    }

                    changed = !changed;
                }
            }
        }
        
        levelsState[lvl] = level;

        return this.setState({
            lvl,
            levelsState
        })
    }
}